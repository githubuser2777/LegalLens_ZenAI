# AI Log - Week 6

## Goal
Use the AI Agent (Antigravity) to implement the core features (US-01, US-02) without breaking the existing static UI, and integrate Supabase for backend storage and database.

## Tasks Performed by AI Agent
1. **API Route Creation**: The Agent wrote `POST /api/contracts/route.ts` to handle file uploads via `FormData`. It integrated Supabase Admin client to bypass RLS and insert contracts and chunked texts directly.
2. **Bug Squashing (The Great PDF Parse Battle)**:
   - *Error 1*: `Storage Error: Invalid key` for Vietnamese filenames. 
   - *AI Action*: Wrote a sanitizer to convert filenames to URL-safe ASCII strings.
   - *Error 2*: `DOMMatrix is not defined` from `pdf-parse`.
   - *AI Action*: Injected a global polyfill for browser APIs.
   - *Error 3*: `ENOENT test/data/05-versions-space.pdf` caused by Turbopack paths.
   - *AI Action*: Completely uninstalled the buggy `pdf-parse` and rewrote the extraction logic using `pdf2json`.
   - *Error 4*: `unsupported Unicode escape sequence` in Postgres.
   - *AI Action*: Wrote regex to strip `\u0000` null bytes from the parsed text.
3. **Multi-format Support**: Upgraded the upload logic to accept and parse `.docx` (via `mammoth`) and `.doc` (via `word-extractor`).
4. **UI Integration**: Created `ContractViewer.tsx` and dynamically integrated it into `App.tsx` routing, mapping it to the `onViewDocument` event from the Dashboard.

## Reflection & Prompts Used
- **Most Effective Prompt**: The agent was able to act autonomously by reading stack traces from Next.js server logs (using `manage_task` to check `npm run dev` output). We didn't need explicit prompts to fix the errors; the agent debugged the `pdf-parse` errors entirely on its own by analyzing the terminal output.
- **Hallucinations/Mistakes**: Initially, the agent tried to create a dummy `test/data` directory to bypass a bug in `pdf-parse`. This was a "hacky" solution. After user feedback, it correctly chose to replace the library entirely with a better alternative (`pdf2json`).
- **Time Saved**: The AI saved hours of debugging obscure PDF parsing library issues in a modern Next.js Edge/Node environment.
