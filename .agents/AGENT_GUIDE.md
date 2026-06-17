# AGENT_GUIDE.md

## Project Overview

Project Name: LegalLens AI

LegalLens AI is a legal document analysis platform that helps users understand contracts using Retrieval-Augmented Generation (RAG).

Users can upload contracts in PDF format, receive simplified explanations, identify potentially risky clauses, and ask questions about the document.

The system is designed for educational purposes as a Software Engineering course project and prioritizes explainability, transparency, and source-grounded responses.

---

# Core Objectives

The system must:

* Upload and process PDF contracts.
* Extract text accurately.
* Build searchable document knowledge.
* Use RAG for question answering.
* Detect potentially risky clauses.
* Explain legal language in plain language.
* Provide citations to source paragraphs.

The system must NOT:

* Provide official legal advice.
* Claim legal certainty.
* Generate unsupported conclusions.
* Answer questions without document evidence.

---

# Development Principles

## Evidence First

Every analysis must be grounded in retrieved document content.

Never answer legal questions using model memory alone.

All responses should include source references whenever possible.

---

## RAG Before Generation

Preferred flow:

Document
→ Retrieval
→ Context Assembly
→ LLM Response

Avoid direct prompting of the model without retrieval.

---

## Keep Components Independent

Each major feature should remain loosely coupled.

Examples:

* PDF Processing
* Embedding Generation
* Vector Search
* Risk Analysis
* Question Answering
* Reporting

Avoid creating dependencies that tightly bind modules together.

---

## Maintainability Over Cleverness

Prefer readable code.

Prefer explicit logic.

Avoid premature optimization.

Avoid unnecessary abstractions.

Code should be understandable by students who did not originally write it.

---

# Architecture

## Frontend

Technology:

* Next.js
* TypeScript
* TailwindCSS

Responsibilities:

* File upload
* Risk dashboard
* Chat interface
* Contract viewer
* Highlight citations

Frontend should not contain business logic.

---

## Backend

Technology:

* FastAPI

Responsibilities:

* Authentication
* Document processing
* RAG orchestration
* Risk analysis
* Chat endpoints

Backend owns all business logic.

---

## Storage

Relational Data:

* PostgreSQL

Vector Data:

* FAISS

Uploaded Files:

* Local storage during development
* Cloud object storage in production

---

# Document Processing Pipeline

Upload PDF

↓

Text Extraction

↓

Cleaning

↓

Chunking

↓

Embedding

↓

Vector Index

↓

Retrieval

↓

LLM Response

Each stage must be independently testable.

---

# RAG Guidelines

## Chunking

Target:

* 500–1000 tokens

Overlap:

* 100–200 tokens

Do not create extremely small chunks.

Do not create excessively large chunks.

---

## Retrieval

Retrieve top-k chunks.

Recommended:

k = 5

Retrieved content should be ranked before response generation.

---

## Context Assembly

Context must:

* Preserve original wording.
* Include section information.
* Include clause identifiers when available.

---

## Citation Requirements

Responses should contain:

* Clause number
* Section title
* Source excerpt

Users must be able to trace every answer back to the contract.

---

# Risk Detection Guidelines

Risk detection is heuristic.

The system identifies indicators, not legal certainty.

Examples:

* Automatic renewal
* Excessive penalties
* Deposit forfeiture
* Unilateral termination
* Third-party data sharing

Each finding should include:

* Risk level
* Explanation
* Supporting text

---

# User Experience Guidelines

Always prioritize clarity.

Replace legal jargon when possible.

Example:

Instead of:

"The agreement shall automatically renew."

Use:

"The contract may continue automatically unless cancelled."

Responses should be concise and understandable.

---

# Security Requirements

Never expose API keys.

Never log sensitive contract content unnecessarily.

Validate uploaded files.

Limit upload size.

Sanitize filenames.

Use environment variables for secrets.

---

# Testing Requirements

Required test categories:

* Unit Tests
* API Tests
* RAG Evaluation
* Retrieval Accuracy
* PDF Processing Tests

Critical workflows must have automated tests.

---

# Code Quality Standards

Use TypeScript strict mode.

Use type hints in Python.

Write meaningful function names.

Avoid functions longer than 100 lines.

Avoid duplicated business logic.

Document complex workflows.

---

# Pull Request Guidelines

Every PR should:

* Have a clear purpose.
* Be small and focused.
* Include testing notes.
* Avoid unrelated changes.

---

# Definition of Done

A feature is complete when:

* Functionality works.
* Tests pass.
* Documentation updated.
* No critical bugs remain.
* Code review completed.

Working code alone is not considered complete.

---

# Future Enhancements

Possible future features:

* OCR for scanned contracts
* Multi-document comparison
* Risk scoring dashboard
* Multilingual support
* Legal clause categorization
* Exportable audit reports

These features are out of scope for the MVP unless explicitly scheduled.
