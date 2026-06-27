# API Reference

All backend interactions are handled via Next.js API Routes. Authentication is required for all endpoints. Include the Supabase JWT in the `Authorization: Bearer <token>` header.

## 1. Upload Contract

`POST /api/contracts`

Uploads a PDF file, parses the text, generates vector embeddings, and stores them in Supabase.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (Binary PDF file, max 10MB)

**Response (200 OK):**
```json
{
  "success": true,
  "contract_id": "uuid",
  "message": "File processed and chunked successfully."
}
```

**Errors:**
- `400 Bad Request`: Invalid file type or file too large.
- `401 Unauthorized`: Missing or invalid JWT.

---

## 2. Get Contract Details

`GET /api/contracts/[id]`

Retrieves metadata and all extracted text chunks for a specific contract.

**Parameters:**
- `id` (uuid): The contract ID.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "lease_agreement.pdf",
  "status": "analyzed",
  "chunks": [
    {
      "id": "uuid",
      "content": "Raw text snippet...",
      "chunk_index": 1
    }
  ]
}
```

---

## 3. Analyze Contract (Trigger Agent)

`GET /api/contracts/[id]/analyze`

Invokes the AI Agent to scan the contract chunks for legal risks. This endpoint streams events back to the client as the Agent progresses through its State Graph.

**Headers:**
- `Accept: text/event-stream`

**Response (Server-Sent Events):**
```text
data: {"step": "extracting", "message": "Fetching document chunks..."}
data: {"step": "analyzing", "message": "Applying Antigravity heuristics..."}
data: {"step": "verifying", "message": "Checking against hallucination..."}
data: {"step": "complete", "risks": [...]}
```

*Note: The final `risks` array is also permanently written to the `risks` table in Supabase.*
