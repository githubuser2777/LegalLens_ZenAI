# AGENT_GUIDE.md - AI Agent Execution Blueprint

This document contains structured instructions, constraints, and architecture mappings designed for AI coding agents collaborating on **LegalLens AI**.

---

<system_context>

## 1. Project Context
* **Name**: LegalLens AI
* **Concept**: RAG-based (Retrieval-Augmented Generation) legal document analysis platform.
* **Goal**: Help non-legal professionals (students, freelancers, new hires) understand contracts and spot risky clauses in under 5 minutes.
* **Core Principle**: **Evidence First**. Every AI-generated warning or answer must be anchored to a specific source paragraph or clause in the uploaded document.

</system_context>

---

<agent_objectives>

## 2. Core Objectives & Scope

### 2.1 The Agent MUST:
* [x] Parse PDF contracts and extract text accurately.
* [x] Segment document content into search indexable chunks.
* [x] Run vector search retrieval to collect context for QA prompts.
* [x] Detect potentially risky clauses using heuristic indicators and LLM analysis.
* [x] Translate complex legalese into plain language explanations.
* [x] Provide exact source references (citations) with matching highlighted spans.

### 2.2 The Agent MUST NOT:
* [ ] Provide official legal advice or legal certainty claims.
* [ ] Hallucinate or make statements unsupported by the document context.
* [ ] Store API keys or credentials directly in the codebase.
* [ ] Perform automatic database structural changes without documenting migrations.

</agent_objectives>

---

<technology_stack>

## 3. Architecture & Tech Stack

```mermaid
graph TD
    User([User UI]) -->|Upload PDF / Chat| Frontend[Next.js + TS + TailwindCSS]
    Frontend -->|API Routes| API[Next.js API Route Handlers]
    API -->|Auth / Storage / DB| Supabase[(Supabase Cloud)]
    API -->|RAG Queries & Embeddings| Gemini[Gemini API]
```

### 3.1 Component Specifications
| Layer | Technologies | Primary Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | Next.js (Client-side), TypeScript, TailwindCSS | Upload states, contract viewer, risk dashboard, citation highlighting, chat UI. |
| **Backend** | Next.js API Routes (Node.js) | PDF parsing, chunking, Gemini API integration, RAG logic, DB operations. |
| **Storage** | Supabase (PostgreSQL + pgvector, Storage, Auth) | PDF files, contract chunks, embeddings (768d), risk alerts, chat messages, and JWT authentication. |

</technology_stack>

---

<processing_pipeline>

## 4. Document Processing & RAG Specification

### 4.1 Document Pipeline Flow
```
[Upload PDF] ──> [Text Extraction] ──> [Chunking & Normalization]
                                                │
[Retrieval (k=3)] <── [Supabase pgvector] <── [Embedding] <── [Gemini text-embedding-004]
```

### 4.2 Pipeline Parameters
* **Chunk size**: 500 - 1000 tokens.
* **Chunk overlap**: 100 - 200 tokens.
* **Retrieval k**: Top 3 chunks.
* **Citation / Location Metadata Schema**:
  ```json
  {
    "page": 1,
    "start_char": 0,
    "end_char": 100,
    "matching_text": "string"
  }
  ```

</processing_pipeline>

---

<risk_detection_rules>

## 5. AI Risk Detection Heuristics

When scanning contracts, look for specific indicator clauses:

> [!WARNING]
> **HIGH RISK Indicators**:
> * Unilateral termination rights without prior notice.
> * Automatic contract renewal with penalty fees.
> * 100% deposit forfeiture on early termination.
> * Indemnity clauses that transfer all liabilities to the weaker party.

> [!NOTE]
> **MEDIUM / LOW RISK Indicators**:
> * Restrictive Non-compete covenants (geography too broad, duration > 1 year).
> * Unclear milestones or payment schedules without defined grace periods.
> * Mandatory arbitration clauses in unfavorable jurisdictions.

</risk_detection_rules>

---

<development_guidelines>

## 6. Coding & Execution Guidelines for AI Agents

### 6.1 Clean Code Standards
* **TypeScript**: Enforce strict type safety. Do not use `any`. Use proper handler types (`NextRequest`, `NextResponse`) for Next.js API Routes.
* **Validation**: Use schema-based validation (like Zod) for API inputs/outputs.
* **Readability**: Prefer explicit, self-documenting logic over complex optimizations. Keep functions under 100 lines.
* **Robustness**: Wrap API calls and parsing logic in try-catch blocks with clean error reporting.

### 6.2 Definition of Done (DoD)
1. Feature implementation matches the user story acceptance criteria.
2. Unit and integration tests pass successfully.
3. API documentation is updated and verified.
4. No secrets or API credentials are committed to Git.
5. All code changes are reviewed and merged via Pull Requests.

</development_guidelines>
