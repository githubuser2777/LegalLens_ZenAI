# Test Result (Week 6)

## Test Environment
- **Framework**: Next.js 16.2.9 (Turbopack)
- **Database**: Supabase (PostgreSQL)
- **Feature**: Document Ingestion Pipeline (US-01, US-02)

## Test Cases Executed

### 1. Upload Standard PDF
- **Action**: Uploaded `Bài tập tuần 3.pdf` via Drag & Drop.
- **Expected**: File uploads to Supabase Storage, text is extracted, and saved to the `contracts` table.
- **Actual**: ✅ Passed. Text was correctly extracted using `pdf2json` and chunks were generated successfully.

### 2. Upload Document with Vietnamese / Special Characters in Filename
- **Action**: Uploaded `Kỹ năng Xây dựng mục tiêu và Lập kế hoạch.pdf`.
- **Expected**: File uploads without breaking Supabase Storage keys.
- **Actual**: ✅ Passed. We implemented filename sanitization (`replace(/[^a-zA-Z0-9.-]/g, '_')`) that strips out Unicode characters for the storage key while retaining the original name in the database.

### 3. Parse Invalid Unicode Characters
- **Action**: Uploaded a PDF containing null byte (`\u0000`) artifacts.
- **Expected**: Database insertion succeeds without `unsupported Unicode escape sequence` error.
- **Actual**: ✅ Passed. Null bytes are stripped via Regex before insertion.

### 4. Upload DOCX and DOC files
- **Action**: Uploaded test `.docx` and `.doc` files.
- **Expected**: Text is extracted successfully.
- **Actual**: ✅ Passed. `mammoth` successfully extracts text from `.docx`, and `word-extractor` processes `.doc` binaries correctly.

### 5. Contract Viewer Rendering
- **Action**: Clicked on an uploaded document from the Dashboard.
- **Expected**: Contract Viewer opens, displaying the exact raw text and title.
- **Actual**: ✅ Passed. The UI fetches data from `GET /api/contracts/[id]` and renders smoothly.

## Summary
All core functionalities for Sprint 1 have been manually tested and verified. The application is stable and ready for AI integration in Week 7.
