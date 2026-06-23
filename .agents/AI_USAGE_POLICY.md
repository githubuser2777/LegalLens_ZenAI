# AI_USAGE_POLICY.md - AI Usage Policy & Collaboration Framework

This document outlines the bounds, verification criteria, safety regulations, and fallback guidelines for AI-assisted development on the LegalLens AI codebase.

---

<policy_intent>

## 1. Core Philosophy
* **AI as Collaborator**: AI agents are team members designed to accelerate engineering cycles (thinking, building, testing).
* **Humans as Authority**: The ultimate accountability for codebase integrity, correctness, security, and architectural decisions lies with human developers.

</policy_intent>

---

<allowed_usage>

## 2. Allowed AI Use Cases

AI tools are authorized and encouraged to assist with:
* **Product Discovery**: Brainstorming scenarios, refining user personas, drafting requirements.
* **Architecture & API Design**: Creating data schemas, modeling database tables, writing OpenAPI specs.
* **Code Implementation**: Generating boilerplate, refactoring complex code, suggesting optimization structures.
* **Quality Assurance**: Writing unit tests, mocking API inputs/outputs, locating edge cases.
* **Technical Research**: Explaining programming concepts, comparing library capabilities.

</allowed_usage>

---

<verification_levels>

## 3. Trust & Verification Framework

AI-generated outputs are classified by risk and require matching verification steps:

| Risk Classification | Examples | Verification Protocol |
| :--- | :--- | :--- |
| **Low Risk** | Markdown documentation, README files, inline comments, code formatting. | Peer review of the diff before committing. |
| **Medium Risk** | UI components, React hooks, API handlers, database queries. | Local compilation check and functional test verification. |
| **High Risk** | Authentication, authorization rules, encryption, deployment scripts, security credentials. | Strict line-by-line manual audit and mandatory verification tests. |

</verification_levels>

---

<hallucination_mitigation>

## 4. Hallucination Mitigation Protocol

AI agents are prone to generating fictitious parameters or incorrect library methods. When using AI suggestions:

> [!IMPORTANT]
> **Grounding Rule**: Never trust AI-generated code snippets for critical RAG prompts or legal analysis without validating the grounding parameters (e.g. ensure LLM prompts enforce referencing source clauses).

> [!WARNING]
> **Check External Specs**: If the AI suggests using a library function, double-check the API signature against the official library documentation (e.g. Google ADK, FastAPI, pgvector documentation).

</hallucination_mitigation>

---

<cost_safety>

## 5. Cost & Quota Constraints

### 5.1 Cloud API Preservation
* Avoid submitting the entire repository context repeatedly. Use file target paths to keep prompts localized.
* Break large development goals into minor, independent tasks.

### 5.2 Quota Fallback Path
When cloud provider credits (Gemini, Claude, OpenAI) are depleted, developers must follow this recovery sequence:
```
[Cloud Premium Agents] ──> [Gemini Free Tier API] ──> [Local LLM (Ollama/LM Studio)] ──> [Manual Coding]
```

### 5.3 Credentials Safety
* Never include raw API keys or connection strings in code files.
* Use environment variables accessed via `.env` files.
* Ensure `.gitignore` contains rules blocking `.env` commits, and document variables in `.env.example`.

</cost_safety>
