import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contractId = params.id;
    
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
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Agent failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ risks: data.risks });

  } catch (error) {
    console.error('Analysis proxy error:', error);
    return NextResponse.json({ error: 'Internal server error during analysis' }, { status: 500 });
  }
}
