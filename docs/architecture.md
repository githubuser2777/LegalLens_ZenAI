# KIẾN TRÚC HỆ THỐNG - LEGALLENS AI

Tài liệu này mô tả chi tiết thiết kế kiến trúc hệ thống của **LegalLens AI**, xác định các thành phần phần mềm, cơ chế tương tác và các luồng nghiệp vụ cốt lõi để hiện thực hóa sản phẩm MVP.

---

## 1. Sơ đồ Kiến trúc Tổng quan (System Component Architecture)

Hệ thống được thiết kế theo mô hình kiến trúc **Monolith cải tiến** sử dụng Next.js (chứa cả Giao diện Frontend và API Route Handlers phía Backend). Cách tiếp cận này giúp tối giản hóa hạ tầng, dễ triển khai trên Vercel và tránh việc phân chia dịch vụ quá sớm (YAGNI).

Dưới đây là sơ đồ các thành phần hệ thống và các tầng tương tác:

```mermaid
graph TD
    subgraph ClientLayer ["Tầng Giao diện (Client-side Next.js)"]
        UI["Workspace UI (Tailwind/CSS)"]
        Viewer["Contract Viewer (2/3 screen)"]
        Sidebar["AI Sidebar (1/3 screen)"]
    end

    subgraph ServiceLayer ["Tầng Dịch vụ & Xử lý (Next.js Route Handlers)"]
        API["API Gateway Router"]
        Parser["PDF Parser Service (pdf-parse)"]
        Segmenter["Text Segmenter (Clause Divider)"]
        EmbeddingService["Embedding Client"]
        QAEngine["RAG Retrieval Engine"]
    end

    subgraph DataLayer ["Tầng Dữ liệu (Supabase Cloud)"]
        Storage["Supabase Storage (PDF files)"]
        DB["Supabase PostgreSQL"]
        VectorDB["pgvector Extension (Embeddings)"]
        Auth["Supabase Auth (JWT)"]
    end

    subgraph ExternalLayer ["Tầng Trí tuệ Nhân tạo (External AI Service)"]
        Gemini["Google Gemini 1.5/2.5 Flash API"]
    end

    %% Interactions
    UI -->|HTTPS/JSON| API
    Viewer -->|Highlight & Scroll| UI
    Sidebar -->|Ask Chat/Trigger Audit| UI
    
    API -->|Read File Stream| Parser
    Parser -->|Raw Text| Segmenter
    Segmenter -->|Chunks| EmbeddingService
    EmbeddingService -->|Call Embedding API| Gemini
    
    API -->|JWT Authentication| Auth
    API -->|Write/Read files| Storage
    API -->|Store Metadata & Chunks| DB
    QAEngine -->|Semantic Similarity Search| VectorDB
    
    QAEngine -->|Augmented Context Prompt| Gemini
```

---

## 2. Các Luồng Nghiệp vụ Chính (Sequence Diagrams)

### 2.1 Luồng Tải lên và Xử lý tài liệu (Contract Upload & Indexing Flow)

Luồng này bắt đầu khi người dùng kéo thả hợp đồng dạng PDF lên giao diện và kết thúc khi tài liệu được lưu trữ, trích xuất và lưu vào Vector Store sẵn sàng cho việc phân tích rủi ro.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant UI as Next.js Client
    participant API as Next.js API Route
    participant Storage as Supabase Storage
    participant Gemini as Gemini API
    participant DB as Supabase DB

    User->>UI: Kéo thả tệp PDF hợp đồng (< 10MB)
    UI->>API: POST /api/contracts (File Data)
    API->>Storage: Tải tệp tin gốc lên bucket 'contracts'
    Storage-->>API: Trả về Public File URL
    API->>API: Phân tách văn bản PDF thành Raw Text & chia nhỏ (Chunking)
    API->>Gemini: Gọi Embedding API cho từng Chunk (Vector 768d/1536d)
    Gemini-->>API: Trả về Vector Embeddings
    API->>DB: Lưu Hợp đồng (contracts) & các Chunk kèm Vector (contract_chunks)
    DB-->>API: Xác nhận lưu trữ thành công
    API-->>UI: Phản hồi 200 OK (Upload & Indexing Complete)
    UI-->>User: Hiển thị văn bản hợp đồng trên Workspace và sẵn sàng phân tích
```

### 2.2 Luồng Phân tích Rủi ro và Hỏi đáp Grounded (AI Risk Analysis & Q&A Flow)

Luồng này mô tả cách hệ thống lấy dữ liệu văn bản từ Database, tạo ngữ cảnh an toàn gửi tới Gemini và nhận về phản hồi chính xác giúp người dùng kiểm chứng.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant UI as Next.js Client
    participant API as Next.js API Route
    participant DB as Supabase DB (pgvector)
    participant Gemini as Gemini API

    %% Risk Analysis
    User->>UI: Bấm nút "Analyze Risks"
    UI->>API: GET /api/contracts/{id}/analyze
    API->>DB: Truy vấn tất cả text chunks của hợp đồng
    DB-->>API: Trả về danh sách text chunks
    API->>Gemini: Gửi toàn bộ văn bản + System Prompt phân tích rủi ro (đầu ra JSON)
    Gemini-->>API: Trả về danh sách JSON (Risks: severity, description, citation_excerpt)
    API->>DB: Lưu các rủi ro phát hiện vào bảng 'risks'
    DB-->>API: Xác nhận lưu thành công
    API-->>UI: Trả về JSON chứa danh sách rủi ro & đoạn trích dẫn
    UI-->>User: Hiển thị danh sách rủi ro (Đỏ/Vàng/Xanh) bên Sidebar

    %% Q&A Chat
    User->>UI: Nhập câu hỏi: "Tôi có được trả cọc không?"
    UI->>API: POST /api/contracts/{id}/chat (Question)
    API->>Gemini: Tạo vector embedding cho câu hỏi
    Gemini-->>API: Trả về Question Vector
    API->>DB: Thực hiện cosine similarity tìm 3 chunks gần nhất
    DB-->>API: Trả về 3 Text Chunks tương quan nhất (Context)
    API->>Gemini: Gửi Prompt: Context + Câu hỏi (Yêu cầu chỉ trả lời dựa trên context)
    Gemini-->>API: Trả về Câu trả lời kèm Citation (ví dụ: [Điều 4])
    API-->>UI: Trả về kết quả câu trả lời + Citation Metadata
    UI-->>User: Hiển thị câu trả lời và làm nổi bật các đoạn trích dẫn tương ứng
```

---

## 3. Lý do Lựa chọn Công nghệ (Architectural Decisions)

* **Next.js App Router (Single Deployment Unit):**
  * *Lý do:* Cho phép gộp cả Frontend và Backend API vào một project duy nhất. Giúp tăng tốc độ phát triển và giảm thiểu overhead khi deploy (chỉ cần đẩy lên Vercel).
  * *Hỗ trợ:* API Route Handlers chạy trên Node.js dễ dàng import các thư viện xử lý PDF và gọi API ngoài.
* **Supabase pgvector:**
  * *Lý do:* Tránh việc phải quản lý riêng biệt một cơ sở dữ liệu Vector độc lập (như Pinecone hay Milvus). Supabase cung cấp PostgreSQL mạnh mẽ kết hợp pgvector cho phép thực hiện truy vấn quan hệ thông thường và tìm kiếm tương đồng vector bằng SQL trên cùng một database.
* **Gemini 1.5/2.5 Flash:**
  * *Lý do:* Tốc độ phản hồi cực nhanh (phù hợp với các ứng dụng interactive chat và stream response), hỗ trợ context window lớn để đọc toàn bộ hợp đồng trực tiếp, và chi phí gọi API cực kỳ tối ưu cho môi trường giáo dục/học tập nhóm.
