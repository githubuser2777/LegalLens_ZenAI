# LegalLens AI

## Software Engineering Project

### AI-Powered Contract Analysis Platform

---

# Executive Summary

LegalLens AI is a legal-document intelligence platform that helps users understand contracts before signing them.

The platform allows users to upload contracts, identify potentially risky clauses, receive simplified explanations, and ask questions grounded in the original document using Retrieval-Augmented Generation (RAG).

The project is developed as part of a Software Engineering course and follows an iterative 10-week MVP development process.

---

# Problem

Most people do not read contracts.

Reasons include:

* Legal language is difficult to understand.
* Contracts are often long.
* Users lack legal knowledge.
* Reviewing contracts requires significant time.

As a result, users frequently agree to:

* Automatic renewals
* Unfair penalties
* Deposit forfeiture
* Broad data-sharing permissions
* Restrictive obligations

without fully understanding them.

---

# Opportunity

Millions of users interact with:

* Rental agreements
* Employment contracts
* Freelance agreements
* Terms of Service
* Privacy Policies

Yet very few tools help non-lawyers understand these documents quickly.

LegalLens AI aims to reduce this information gap.

---

# Target Users

## Primary Users

Students

* Dormitory agreements
* Internship contracts
* Scholarship terms

Employees

* Employment contracts
* NDA agreements

Freelancers

* Service agreements
* Client contracts

Consumers

* Terms of Service
* Subscription agreements

---

# User Stories

### User Story 1

As a tenant,

I want to upload a rental contract,

so that I can identify risky clauses before signing.

---

### User Story 2

As an employee,

I want legal language translated into plain language,

so that I can understand my obligations.

---

### User Story 3

As a user,

I want to ask questions about a contract,

so that I do not need to manually search through dozens of pages.

---

### User Story 4

As a user,

I want answers backed by evidence,

so that I can trust the system.

---

# Solution

LegalLens AI provides:

* Contract Upload
* Contract Summary
* Risk Detection
* Clause Explanation
* RAG-based Question Answering
* Source Citations

The platform focuses on understanding rather than legal advice.

---

# MVP Scope

## Included

Upload PDF

Extract Text

Generate Summary

Detect Risks

Ask Questions

Provide Citations

---

## Excluded

Legal Advice

Contract Drafting

Court Prediction

Legal Representation

Electronic Signatures

Multi-user Collaboration

---

# Success Criteria

The MVP is considered successful if users can:

* Upload a contract
* Understand the summary
* Identify important risks
* Ask meaningful questions
* Verify answers using citations

---

# Validation Plan

Validation will be performed through:

* Student testing
* Peer reviews
* Instructor feedback
* Usability testing sessions

Success metrics include:

* Time required to understand a contract
* User satisfaction
* Accuracy of retrieved information
* Citation relevance

---

# Product Features

## Contract Upload

Upload PDF documents.

---

## Contract Summary

Generate concise summaries.

---

## Risk Detection

Highlight:

* Deposit Loss
* Automatic Renewal
* Termination Clauses
* Privacy Risks
* Penalty Clauses

---

## Plain Language Translation

Translate legal terminology into understandable language.

---

## Contract QA

Ask natural language questions.

Example:

Can I lose my deposit?

What happens if I terminate early?

Does this contract renew automatically?

---

## Source Citation

Every answer should reference source clauses.

---

# System Architecture

User
↓
Next.js (Frontend UI & Route Handlers)
↓
Gemini API (Embeddings & RAG Queries)
↓
Supabase (PostgreSQL + pgvector, Storage, Auth)

---

# Technology Stack

* **Core**: Next.js (App Router), TypeScript, TailwindCSS
* **Database & Vector Store**: Supabase (PostgreSQL with pgvector)
* **Object Storage**: Supabase Storage (PDF files)
* **Authentication**: Supabase Auth (JWT)
* **AI & Embedding Engine**: Google Gemini 1.5/2.5 Flash API (model `text-embedding-004`)

---

# Repository Structure

* `/docs`: System specifications, data models, UX design, logs.
* `/src`: Next.js frontend application and API route handlers (monolithic code base).
* `/tests`: Automation and unit tests (e.g. Playwright).

---

# Weekly Deliverables

## Week 1

Problem Definition

Requirements Analysis

User Stories

Architecture Draft

PDF Upload PoC

Deliverable:

Working PDF Upload Demo

---

## Week 2

Frontend Foundation

UI Wireframes

Contract Upload Interface

Deliverable:

Functional Frontend

---

## Week 3

Backend Foundation

Database Design

API Structure

Deliverable:

Working Backend APIs

---

## Week 4

Document Processing

Text Extraction

Chunking

Deliverable:

PDF → Text Pipeline

---

## Week 5

RAG Implementation

Embedding Generation

Vector Search

Deliverable:

Contract Question Answering

---

## Week 6

Risk Detection

Clause Classification

Deliverable:

Risk Dashboard

---

## Week 7

Legal Translation

Explanation Engine

Deliverable:

Plain Language Explanations

---

## Week 8

System Refinement

Performance Improvements

Deliverable:

Integrated MVP

---

## Week 9

Testing

Bug Fixes

Evaluation

Deliverable:

Release Candidate

---

## Week 10

Presentation

Documentation

Final Demonstration

Deliverable:

Final Product

---

# Risks

## Technical Risks

Large PDF processing

Poor retrieval quality

Hallucinated answers

API limitations

---

## Mitigation

Use RAG

Use citations

Implement retrieval evaluation

Limit unsupported answers

---

# Future Improvements

OCR Support

Contract Comparison

Multi-language Support

Advanced Risk Scoring

Report Generation

Enterprise Dashboard

---

# Disclaimer

LegalLens AI is an educational software engineering project.

The system provides informational assistance only.

It does not provide legal advice and should not replace professional legal consultation.
