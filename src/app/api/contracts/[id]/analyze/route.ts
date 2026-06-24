import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIValidator } from '@/lib/AIValidator';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const contractId = (await params).id;
    const supabase = await createClient();

    // Verify auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    // Fetch contract text for security validation
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select('raw_text')
      .eq('id', contractId)
      .single();

    if (contractError || !contract) {
        return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // --- PROMPT INJECTION SECURITY CHECK ---
    const validationResult = AIValidator.validatePrompt(contract.raw_text);
    if (!validationResult.isValid) {
        return NextResponse.json({ 
            error: validationResult.reason, 
            code: 'PROMPT_INJECTION_DETECTED' 
        }, { status: 400 });
    }

    // Proxy request to ADK Agent Backend (Microservice)
    const agentUrl = process.env.AGENT_URL || 'http://127.0.0.1:8000';
    
    const response = await fetch(`${agentUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contractId })
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: 'Agent failed' };
      }
      return NextResponse.json({ error: errorData.error || 'Agent failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ risks: data.risks });

  } catch (error) {
    console.error('Analysis proxy error:', error);
    return NextResponse.json({ error: 'Internal server error during analysis' }, { status: 500 });
  }
}
