import os
import inspect
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load env variables (Supabase URL/Key, Gemini API Key)
load_dotenv(dotenv_path="../../.env.local", override=True)

from agent import app as adk_app, chat_agent
import json
from fastapi.responses import StreamingResponse
from google.genai import types

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(title="LegalLens AI - Contract Auditor Agent", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    contractId: str

@app.post("/analyze")
async def analyze_contract(req: AnalyzeRequest):
    if not req.contractId:
        raise HTTPException(status_code=400, detail="contractId is required")
        
    async def event_generator_stream():
        try:
            print(f"Starting ADK 2.0 workflow for contract: {req.contractId}")
            yield f"data: {json.dumps({'status': 'starting', 'message': 'Đang khởi tạo Agent phân tích...'})}\n\n"
            
            # In ADK 2.0, you run the root agent (Workflow) by passing the initial input
            event_generator = adk_app.root_agent.run(node_input={"contractId": req.contractId})
            
            final_output = None
            
            if inspect.isasyncgen(event_generator):
                async for event in event_generator:
                    # Send a generic thought step if we get an event
                    yield f"data: {json.dumps({'status': 'running', 'message': 'Agent đang xử lý...'})}\n\n"
                    if event.output is not None:
                        final_output = event.output
            else:
                for event in event_generator:
                    yield f"data: {json.dumps({'status': 'running', 'message': 'Agent đang xử lý...'})}\n\n"
                    if event.output is not None:
                        final_output = event.output
                        
            # Output final result
            if final_output:
                yield f"data: {json.dumps({'status': 'complete', 'result': final_output})}\n\n"
            else:
                yield f"data: {json.dumps({'status': 'complete', 'result': {'risks': []}})}\n\n"
                
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            print("Error during analysis:", e)
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator_stream(), media_type="text/event-stream")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    async def event_generator():
        try:
            contents = []
            for m in req.history:
                # Map roles correctly to 'user' or 'model'
                role = "model" if m.role == "assistant" else "user"
                contents.append(types.Content(role=role, parts=[types.Part.from_text(text=m.content)]))
            
            contents.append(types.Content(role="user", parts=[types.Part.from_text(text=req.message)]))
            
            generator = chat_agent.run(contents)
            
            if inspect.isasyncgen(generator):
                async for event in generator:
                    if event.content and event.content.parts:
                        for part in event.content.parts:
                            if part.text:
                                yield f"data: {json.dumps({'text': part.text})}\n\n"
            else:
                for event in generator:
                    if event.content and event.content.parts:
                        for part in event.content.parts:
                            if part.text:
                                yield f"data: {json.dumps({'text': part.text})}\n\n"
                            
            yield "data: [DONE]\n\n"
        except Exception as e:
            print(f"Chat error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("AGENT_PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
