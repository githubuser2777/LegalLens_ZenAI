export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contractId } = body;

    // Call the Python ADK backend analyze endpoint
    const backendUrl = process.env.AGENT_URL || "http://127.0.0.1:8000";
    
    const response = await fetch(`${backendUrl}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `Backend error: ${errorText}` }), {
        status: response.status,
      });
    }

    // Proxy the Server-Sent Events stream from FastAPI to the Next.js client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Analyze proxy error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
