import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '../.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.AGENT_PORT || 8000;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Google ADK (GenAI)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        risks: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              category: { type: SchemaType.STRING, enum: ['Deposit', 'Termination', 'Penalty', 'Non-Compete', 'Other'] },
              severity: { type: SchemaType.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
              title: { type: SchemaType.STRING, description: "Tên rủi ro ngắn gọn" },
              explanation: { type: SchemaType.STRING, description: "Giải thích ngắn gọn" },
              excerpt: { type: SchemaType.STRING, description: "Trích dẫn CHÍNH XÁC dòng chữ chứa điều khoản này trong hợp đồng gốc" },
              location: {
                type: SchemaType.OBJECT,
                properties: { clause_number: { type: SchemaType.STRING, description: "Tên Điều/Khoản" } }
              }
            },
            required: ['category', 'severity', 'title', 'explanation', 'excerpt', 'location']
          }
        }
      }
    }
  }
});

// Define ADK State Graph Nodes
class ExtractNode {
  async run(contractId: string) {
    console.log(`[ExtractNode] Fetching raw text for contract ${contractId}`);
    const { data: contract, error } = await supabase
      .from('contracts')
      .select('raw_text')
      .eq('id', contractId)
      .single();
    
    if (error || !contract) throw new Error("Contract not found");
    return contract.raw_text;
  }
}

class AnalyzeNode {
  async run(rawText: string) {
    console.log(`[AnalyzeNode] Calling LLM to analyze contract text`);
    
    const prompt = `Bạn là một chuyên gia pháp lý và là Trợ lý phân tích hợp đồng thông minh. Nhiệm vụ của bạn là đọc kỹ văn bản hợp đồng dưới đây và phát hiện ra các rủi ro hoặc điều khoản bất lợi tiềm ẩn cho người dùng phổ thông.

Hãy phân tích dựa trên các danh mục rủi ro: Deposit, Termination, Penalty, Non-Compete, Other.
Lưu ý: Trả về JSON theo cấu trúc rủi ro. Excerpt PHẢI là trích dẫn chính xác 100% từ hợp đồng gốc.

HỢP ĐỒNG:
${rawText}`;

    const response = await model.generateContent(prompt);
    const jsonText = response.response.text() || '{"risks":[]}';
    return JSON.parse(jsonText).risks || [];
  }
}

class VerifyNode {
  async run(risks: any[], rawText: string) {
    console.log(`[VerifyNode] Verifying excerpts against raw text (Anti-Hallucination)`);
    const verifiedRisks = risks.filter(risk => {
      // Basic check: excerpt should exist in raw text
      if (typeof risk.excerpt !== 'string') return false;
      // Strip some spaces to be safe
      const cleanExcerpt = risk.excerpt.replace(/\s+/g, ' ').trim();
      const cleanRaw = rawText.replace(/\s+/g, ' ');
      return cleanRaw.includes(cleanExcerpt);
    });
    console.log(`[VerifyNode] Kept ${verifiedRisks.length}/${risks.length} valid risks.`);
    return verifiedRisks;
  }
}

class SaveNode {
  async run(contractId: string, risks: any[]) {
    console.log(`[SaveNode] Saving ${risks.length} risks to database`);
    if (risks.length === 0) return risks;

    const risksToInsert = risks.map((risk) => ({
      contract_id: contractId,
      category: risk.category,
      severity: risk.severity,
      explanation: risk.explanation,
      excerpt: risk.excerpt,
      location_meta: risk.location
    }));

    await supabase.from('risks').delete().eq('contract_id', contractId);
    await supabase.from('risks').insert(risksToInsert);
    return risksToInsert;
  }
}

// Combine Nodes into ADK State Graph runner
app.post('/analyze', async (req, res) => {
  const { contractId } = req.body;
  if (!contractId) return res.status(400).json({ error: 'contractId required' });

  try {
    const extract = new ExtractNode();
    const analyze = new AnalyzeNode();
    const verify = new VerifyNode();
    const save = new SaveNode();

    // State Transitions
    const rawText = await extract.run(contractId);
    const risks = await analyze.run(rawText);
    const verifiedRisks = await verify.run(risks, rawText);
    await save.run(contractId, verifiedRisks);

    res.json({ risks: verifiedRisks });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`ADK Agent running on port ${PORT}`);
});
