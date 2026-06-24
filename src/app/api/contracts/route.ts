import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { AIValidator } from '@/lib/AIValidator';


export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const { data: contracts, error } = await supabase
      .from('contracts')
      .select('id, title, file_url, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ contracts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Require authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Ensure public.profiles exists to satisfy the foreign key constraint
    if (user && user.email) {
      await supabaseAdmin.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.email.split('@')[0],
      }, { onConflict: 'id' });
    }

    // Upload to Supabase Storage bucket 'contracts'
    // Generate a safe ascii filename to prevent 'Invalid key' errors with unicode characters
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${safeName}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: storageData, error: storageError } = await supabaseAdmin
      .storage
      .from('contracts')
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (storageError) {
      return NextResponse.json({ error: `Storage Error: ${storageError.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('contracts')
      .getPublicUrl(fileName);

    // Extract text
    let rawText = '';
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        const PDFParser = require("pdf2json");
        const pdfParser = new PDFParser(null, 1); // 1 = raw text content

        rawText = await new Promise<string>((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
          pdfParser.on("pdfParser_dataReady", () => {
             resolve(pdfParser.getRawTextContent());
          });
          pdfParser.parseBuffer(buffer);
        });

      } catch (e) {
        console.error("PDF parse error:", e);
      }
    } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        rawText = result.value;
      } catch (e) {
        console.error("DOCX parse error:", e);
      }
    } else if (file.name.endsWith('.doc') || file.type === 'application/msword') {
      try {
        const WordExtractor = require('word-extractor');
        const extractor = new WordExtractor();
        const extracted = await extractor.extract(buffer);
        rawText = extracted.getBody();
      } catch (e) {
        console.error("DOC parse error:", e);
      }
    } else {
      rawText = buffer.toString('utf-8');
    }

    // Strip null bytes which PostgreSQL rejects and sanitize AI tokens
    rawText = rawText.replace(/\0/g, '');
    rawText = AIValidator.sanitize(rawText);

    // Insert into contracts table
    const { data: contract, error: contractError } = await supabaseAdmin
      .from('contracts')
      .insert({
        user_id: user.id,
        title: file.name,
        file_url: publicUrl,
        raw_text: rawText,
      })
      .select()
      .single();

    if (contractError) {
      return NextResponse.json({ error: `DB Error: ${contractError.message}` }, { status: 500 });
    }

    // Chunk text and insert to contract_chunks
    const chunkSize = 1000; // characters per chunk
    const chunks = [];
    for (let i = 0; i < rawText.length; i += chunkSize) {
      chunks.push({
        contract_id: contract.id,
        chunk_index: Math.floor(i / chunkSize),
        content: rawText.substring(i, i + chunkSize),
        embedding: null, // AI Integration mapped to Week 7
        metadata: {}
      });
    }

    if (chunks.length > 0) {
      const { error: chunkError } = await supabaseAdmin
        .from('contract_chunks')
        .insert(chunks);
      if (chunkError) {
        console.error("Chunk insert error:", chunkError);
      }
    }

    return NextResponse.json({ contract });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
