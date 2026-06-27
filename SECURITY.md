# Security Policy

## Supported Versions

LegalLens AI follows a continuous deployment model. Only the `main` branch (latest commit) is officially supported for security updates. 

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| `< 1.0` | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not** open a public issue on GitHub. Instead, please report it via email to the core maintainers at [security@legallens-ai.com].

We will respond within 48 hours to acknowledge the report and provide an estimated timeline for the fix.

## AI Safety & Prompt Injection Mitigation

LegalLens AI handles user-uploaded documents (PDFs) that are subsequently passed to Large Language Models (Google Gemini). To ensure the integrity of the agentic workflow and protect against Prompt Injection attacks, we enforce the following security boundaries:

1. **Input Sanitization**: All extracted text from PDFs is strictly treated as passive data. The LLM prompts are structurally designed (using the Google GenAI SDK) to isolate the user text from the system instructions.
2. **Hallucination Mitigation (100% Verification)**: The Agent's `VerifyNode` strictly verifies that every `source_clause` cited by the AI exists verbatim in the original document chunk. Any response containing fabricated or misquoted text is automatically discarded by the system.

## Data Privacy (PostgreSQL RLS)

All user data is stored in Supabase. We rely on Supabase **Row Level Security (RLS)** to enforce multi-tenant isolation.
- Unauthenticated users cannot read or write any data.
- Authenticated users can only read, insert, update, or delete rows in the `contracts`, `contract_chunks`, and `risks` tables where the `user_id` column matches their JWT `auth.uid()`.
- API Routes strictly validate user sessions before interacting with the database or the AI Agent.
