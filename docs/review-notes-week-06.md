# Review Notes (Week 6)

## Overview
This week focused on implementing the core features: **US-01 (Document Upload & Parsing)** and **US-02 (Contract Viewer)**. We migrated the static React UI into a fully functional Next.js application integrated with Supabase.

## Code Review Findings
- **Security**: Uploaded documents are saved securely in Supabase Storage. We successfully bypassed Row-Level Security (RLS) for the backend parsing API using the `service_role` key, ensuring users can't directly manipulate the database while the API handles the secure processing.
- **Robustness**: 
  - We encountered a critical issue where the default `pdf-parse` library failed in the Next.js Turbopack environment due to missing browser globals (`DOMMatrix`, `Path2D`) and faulty internal test file dependencies (`ENOENT: 05-versions-space.pdf`).
  - **Resolution**: Refactored the extraction logic to use the highly stable `pdf2json` library. We also added `mammoth` and `word-extractor` to support `.docx` and `.doc` files seamlessly.
- **Database Integrity**: Discovered that extracted text sometimes contained null bytes (`\u0000`), which crashed PostgreSQL. Added regex sanitization (`rawText.replace(/\0/g, '')`) before database insertion to guarantee stability.
- **UI/UX**: The Document Upload UI was cleaned up to remove unsupported mock formats (like `.rtf`, `.png`) to avoid user confusion. The Contract Viewer UI correctly displays extracted text with formatting preserved via `whitespace-pre-wrap`.

## Conclusion
The core ingestion pipeline is now extremely robust. All pull requests / commits related to US-01 and US-02 have been reviewed and approved for merging into the main branch.
