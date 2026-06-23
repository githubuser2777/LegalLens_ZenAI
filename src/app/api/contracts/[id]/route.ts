import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const id = (await params).id;

    const { data: contract, error: cError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (cError) return NextResponse.json({ error: cError.message }, { status: 500 });
    
    const { data: chunks, error: chError } = await supabase
      .from('contract_chunks')
      .select('*')
      .eq('contract_id', id)
      .order('chunk_index', { ascending: true });
    
    if (chError) return NextResponse.json({ error: chError.message }, { status: 500 });

    return NextResponse.json({ contract, chunks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
