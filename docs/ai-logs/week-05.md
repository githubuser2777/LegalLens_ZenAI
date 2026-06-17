# Nhật ký Sử dụng AI - Tuần 05

## Dự án

LegalLens AI

## Tuần phát triển

Tuần 05 - Kiến trúc và Thiết kế Tính năng AI (Architecture and AI Feature Design)

## Mục tiêu của Nhóm

Mục tiêu cốt lõi của nhóm trong tuần này là hoàn thiện tài liệu thiết kế kiến trúc hệ thống, mô hình thực thể dữ liệu quan hệ kết hợp Vector Store, và đặc tả luồng xử lý cùng cơ chế kiểm soát chất lượng tính năng AI (chống ảo tưởng, bảo vệ quyền riêng tư). Toàn bộ thiết kế hướng đến sự tối giản và khả thi cho phiên bản MVP.

---

## Các công việc đã thực hiện

### Công việc 1: Thiết kế Kiến trúc Hệ thống (docs/architecture.md)

#### Mục tiêu
Xây dựng sơ đồ phân rã các tầng ứng dụng (Client, API, Data, AI) và mô tả luồng giao tiếp giữa các thành phần qua hai kịch bản: Tải hợp đồng PDF & Phân tích rủi ro/Hỏi đáp.

#### Hỗ trợ từ AI
AI (Google Antigravity) đóng vai trò là Kiến trúc sư Phần mềm (Software Architect):
* Đề xuất sơ đồ component bằng Mermaid trực quan mô tả sự kết hợp giữa Next.js Client, Next.js API Routes, Supabase Storage, và Gemini API.
* Biên soạn hai sequence diagram mô tả luồng bất đồng bộ khi tải lên/xử lý văn bản và luồng RAG khi hỏi đáp grounded.

#### Prompt đã sử dụng
> Act as a software architect. Create a system architecture document for LegalLens AI. We will use Next.js for both client and backend API, Supabase for DB/Storage, and Gemini API. Include Mermaid component diagram and sequence diagrams for contract upload and AI risk analysis/Q&A.

#### Tóm tắt phản hồi của AI
AI đã đề xuất cấu trúc tệp [architecture.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/architecture.md) chi tiết:
* Sơ đồ khối Mermaid phân chia 4 tầng rõ ràng.
* Sơ đồ Sequence mô tả thứ tự gọi API tuần tự từ Client -> API Route -> Storage -> Gemini -> Database.
* Khẳng định tính đúng đắn khi gộp Frontend và Backend API vào Next.js để giảm overhead.

#### Đánh giá của Con người
Sơ đồ Mermaid rất rõ ràng, việc sử dụng Next.js API Routes thay thế cho FastAPI giúp loại bỏ sự phức tạp về hạ tầng mạng và cấu hình bảo mật đa nguồn (CORS). Nhóm thống nhất triển khai trực tiếp thiết kế này.

---

### Công việc 2: Thiết kế Cơ sở Dữ liệu & pgvector (docs/data-model.md)

#### Mục tiêu
Xác định cấu trúc bảng PostgreSQL cần thiết để lưu trữ dữ liệu người dùng, hợp đồng, các phân đoạn text và vector embeddings phục vụ RAG.

#### Hỗ trợ từ AI
AI đóng vai trò là Kỹ sư Cơ sở dữ liệu (Database Engineer):
* Thiết kế sơ đồ ERD mô tả mối quan hệ 1-nhiều từ người dùng đến hợp đồng, và từ hợp đồng đến các bảng vệ tinh (chunks, risks, chats).
* Viết lệnh SQL DDL khởi tạo bảng trên Supabase, tích hợp Row Level Security (RLS) bảo vệ quyền truy cập dữ liệu người dùng.
* Thiết lập Stored Procedure `match_contract_chunks` thực thi thuật toán Cosine Similarity trực tiếp trên PostgreSQL.

#### Prompt đã sử dụng
> Create docs/data-model.md for LegalLens AI. Include Mermaid ERD, DDL SQL queries for Supabase PostgreSQL (with pgvector for contract chunks, auth connection, risks, and chat messages), and a PostgreSQL function for cosine similarity search.

#### Tóm tắt phản hồi của AI
AI đã thiết kế đầy đủ tệp [data-model.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/data-model.md) gồm:
* 5 thực thể chính: `profiles`, `contracts`, `contract_chunks` (vector 768 chiều), `risks`, `chat_messages`.
* Các chính sách RLS ngăn chặn rò rỉ dữ liệu giữa các tài khoản người dùng khác nhau.
* Stored Procedure `match_contract_chunks` nhận embedding truy vấn và trả về kết quả tương đồng Cosine sắp xếp giảm dần.

#### Đánh giá của Con người
Kích thước vector 768 chiều phù hợp chính xác với mô hình `text-embedding-004` của Gemini. Lệnh SQL DDL có cấu trúc hoàn chỉnh và có thể nạp trực tiếp vào Supabase SQL Editor để khởi tạo database.

---

### Công việc 3: Đặc tả Tính năng AI & Prompt (docs/AI_FEATURE_DESIGN.md)

#### Mục tiêu
Thiết kế chi tiết luồng xử lý AI, cấu hình system prompts nghiệp vụ và lên phương án mitigating rủi ro an toàn dữ liệu cũng như ảo tưởng (hallucination) của mô hình.

#### Hỗ trợ từ AI
AI đóng vai trò là Kỹ sư Trí tuệ nhân tạo (AI Engineer):
* Mô tả chi tiết dữ liệu vào/ra và quyền kiểm soát của con người trong chu trình AI (Human-in-the-loop).
* Biên soạn System Prompt cho bộ phân tích rủi ro hợp đồng (yêu cầu đầu ra JSON có cấu trúc chặt chẽ) và System Prompt cho Trợ lý Hỏi đáp grounded.
* Phân tích 3 rủi ro cốt lõi (Bảo mật, Ảo tưởng, Sự ỷ lại) và đề xuất các giải pháp kỹ thuật cụ thể để triệt tiêu chúng.

#### Prompt đã sử dụng
> Generate docs/AI_FEATURE_DESIGN.md mapping the AI feature design for LegalLens AI. Include feature name, user value, inputs/outputs, Mermaid flow, system prompts, risk analysis, mitigation, and human-in-the-loop controls.

#### Tóm tắt phản hồi của AI
AI đã hoàn thành tệp [AI_FEATURE_DESIGN.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/AI_FEATURE_DESIGN.md) với các nội dung:
* Sơ đồ luồng xử lý dữ liệu RAG và Phân tích Rủi ro.
* Định dạng JSON schema bắt buộc cho đầu ra của Gemini API.
* Bảng ma trận rủi ro & giải pháp giảm thiểu chi tiết (như so khớp trích dẫn gốc client-side để chống ảo tưởng).

#### Đánh giá của Con người
Các prompts hệ thống được thiết lập rất chặt chẽ, đặc biệt là cơ chế so khớp chuỗi trích dẫn gốc 100% ở phía Client giúp đảm bảo AI không tự bịa ra điều khoản.

---

## Các Quyết định Quan trọng

### Quyết định 1
**Đơn giản hóa Kiến trúc theo Ponytail (YAGNI):** Loại bỏ việc xây dựng một Backend API bằng FastAPI (Python) chạy độc lập. Thay vào đó, toàn bộ logic xử lý tệp PDF và phân tách văn bản sẽ được thực hiện trực tiếp bởi các API Route Handlers chạy trên Node.js trong chính dự án Next.js. Quyết định này giúp tiết kiệm 1 máy chủ ảo và đơn giản hóa việc deploy sản phẩm MVP.
* *Trạng thái:* Đã thông qua.

### Quyết định 2
**Không sử dụng Vector Index phức tạp:** Đối với cơ sở dữ liệu Vector (`pgvector`), nhóm quyết định không tạo các chỉ mục phức tạp như HNSW hay IVFFlat. Do số lượng chunks của mỗi hợp đồng thuê nhà/freelance thường rất nhỏ (< 300 chunks), việc quét toàn bộ (Flat Search) giới hạn bởi `contract_id` bằng SQL sẽ nhanh hơn và chính xác 100%, tránh lãng phí RAM của database.
* *Trạng thái:* Đã thông qua.

### Quyết định 3
**Cơ chế đối chiếu Client-side chống ảo tưởng:** Hệ thống sẽ bắt buộc AI trả về chuỗi trích dẫn chính xác (`excerpt`). Client-side của Next.js sẽ so khớp chuỗi này trong văn bản gốc trước khi hiển thị thẻ rủi ro cho người dùng. Nếu không khớp 100%, thẻ sẽ bị đánh dấu cảnh báo tính xác thực.
* *Trạng thái:* Đã thông qua.

---

## Bài học Kinh nghiệm rút ra

### Bài học 1
Áp dụng tư duy thiết kế tinh gọn (Lean / Ponytail) giúp chúng ta tránh được bẫy over-engineering. Ban đầu nhóm đề xuất dùng FastAPI chỉ vì quen thuộc với Python trong xử lý AI, nhưng khi phân tích kỹ, Next.js hoàn toàn có các gói npm xử lý PDF tương đương mà lại không phải duy trì 2 dự án song song.

### Bài học 2
Để RAG chạy chính xác, metadata của chunks đóng vai trò sống còn. Việc lưu trữ thông tin số trang và offsets ngay từ bước chunking sẽ giúp giải quyết triệt để tính năng cuộn và tô sáng văn bản ở client-side mà không cần AI định vị lại lần 2.

---

## Các Công cụ AI đã sử dụng

| Công cụ | Mục đích sử dụng |
| ------- | ---------------------- |
| Google Antigravity | Tư vấn thiết kế kiến trúc và sinh mã Mermaid |
| Google Antigravity | Thiết kế DDL SQL cho Supabase pgvector và Stored Procedure |
| Google Antigravity | Biên soạn hệ thống Prompt và ma trận giảm thiểu rủi ro AI |
| Google Antigravity | Hỗ trợ lập tài liệu AI log Tuần 05 |

---

## Đóng góp của Thành viên trong Nhóm

* **Cả nhóm:** Họp bàn phản biện kiến trúc, biểu quyết loại bỏ FastAPI để theo sát cấu hình tinh gọn.
* **Thành viên Tech Lead:** Kiểm duyệt sơ đồ ERD, chạy thử hàm SQL Cosine Similarity trong môi trường Supabase test.
* **Thành viên BA:** Rà soát ma trận rủi ro AI, đặc biệt là các điều khoản bồi thường và đặt cọc để cập nhật cho BA backlog.

---

## Các tài liệu bàn giao Tuần 05

* [docs/architecture.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/architecture.md) (Kiến trúc hệ thống chi tiết)
* [docs/data-model.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/data-model.md) (Mô hình dữ liệu và SQL DDL)
* [docs/AI_FEATURE_DESIGN.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/AI_FEATURE_DESIGN.md) (Thiết kế tính năng AI và giảm thiểu rủi ro)
* [docs/ai-logs/week-05.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/ai-logs/week-05.md) (Nhật ký sử dụng AI tuần này)
