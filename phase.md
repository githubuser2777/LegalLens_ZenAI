# Lộ Trình Phát Triển Chi Tiết & Checklist Từng Giai Đoạn (Weeks 1 - 10)

Bản kế hoạch này tích hợp từ tài liệu lộ trình môn học [10weeks.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/10weeks.md) và danh mục yêu cầu kỹ thuật trong [GITHUB_ISSUES.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md). Sử dụng checklist này để theo dõi tiến độ thực tế theo từng tuần.

---

## 📋 GIAI ĐOẠN 1: KHỞI ĐỘNG & THIẾT KẾ (WEEKS 1 - 5) - [ĐÃ HOÀN THÀNH]

### Tuần 1: Agent Onboarding & Chọn hướng Project [ĐÃ XONG]
- [x] Cài đặt môi trường phát triển và cấu hình Codex / Cursor IDE / CLI.
- [x] Khởi tạo Git repository trên máy local và đẩy lên GitHub.
- [x] Biên soạn tài liệu định hướng sản phẩm.
- [x] Thiết lập tệp chỉ dẫn Agent: [.agents/AGENT_GUIDE.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/.agents/AGENT_GUIDE.md).
- [x] Thiết lập chính sách sử dụng AI: `.agents/AI_USAGE_POLICY.md`.
- [x] Hoàn thành báo cáo sử dụng AI tuần 1: `docs/ai-logs/week-01.md`.

### Tuần 2: Phân Tích Ý Tưởng & Đề Xuất MVP [ĐÃ XONG]
- [x] Khảo sát hành vi người dùng đối với các loại hợp đồng thuê nhà, NDA, hợp đồng lao động.
- [x] Xác định các pain points lớn và giới hạn phạm vi MVP tinh gọn cho LegalLens AI.
- [x] Phác thảo đề xuất tính năng AI: `docs/AI-docs/AI_FEATURE_PROPOSAL.md`.
- [x] Hoàn thành báo cáo sử dụng AI tuần 2: `docs/ai-logs/week-02.md`.

### Tuần 3: Xây Dựng UX Prototype [ĐÃ XONG]
- [x] Tạo bộ khung giao diện tĩnh với Mock Data tại thư mục [UI_wireframe](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/UI_wireframe) sử dụng React, Vite, Tailwind CSS và Framer Motion.
- [x] Cập nhật tài liệu yêu cầu người dùng: `docs/REQUIREMENTS.md`.
- [x] Hoàn thành báo cáo sử dụng AI tuần 3: `docs/ai-logs/week-03.md`.

### Tuần 4: Phân Rã Requirements Thành GitHub Issues [ĐÃ XONG]
- [x] Biên soạn 8-12 User Stories đầy đủ tiêu chí nghiệm thu dạng Given-When-Then.
- [x] Chuyển đổi và thiết lập danh sách công việc sẵn sàng giao: [GITHUB_ISSUES.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md).
- [x] Tạo hướng dẫn Prompts hệ thống: `docs/PROMPTS.md`.
- [x] Hoàn thành báo cáo sử dụng AI tuần 4: `docs/ai-logs/week-04.md`.

### Tuần 5: Thiết Kế Kiến Trúc & Dữ Liệu [ĐÃ XONG]
- [x] Thiết kế sơ đồ kiến trúc hệ thống Next.js + Supabase + Gemini API: [architecture.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/architecture.md).
- [x] Thiết kế cấu trúc bảng DB PostgreSQL kết hợp cột vector 768 chiều và Stored Procedure cho tìm kiếm tương đồng: [data-model.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/data-model.md).
- [x] Thiết kế chi tiết luồng xử lý AI, định dạng JSON Structured Output và phương án loại bỏ ảo tưởng (hallucination): [AI_FEATURE_DESIGN.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/AI-docs/AI_FEATURE_DESIGN.md).
- [x] Hoàn thành báo cáo sử dụng AI tuần 5: [week-05.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/ai-logs/week-05.md).

---

## 🛠️ GIAI ĐOẠN 2: TRIỂN KHAI CORE & AI AGENT INTEGRATION (WEEKS 6 - 8) - [ĐANG THỰC HIỆN]

### Tuần 6: Sprint 1 - Hoàn Thiện Tính Năng Nền Tảng (Core Features) [ĐÃ XONG]
*Mục tiêu: Đưa file PDF của người dùng lên hệ thống, trích xuất text thô thành công và hiển thị rõ ràng lên giao diện.*
- [x] **Khởi tạo và cấu hình dự án**:
  - [x] Khởi tạo dự án Next.js chính thức (App Router, TypeScript, TailwindCSS).
  - [x] Chuyển các component và style từ thư mục [UI_wireframe](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/UI_wireframe) sang codebase mới.
  - [x] Cấu hình các biến môi trường kết nối Supabase (`.env.local` / `.env.example`).
  - [x] Chạy lệnh SQL DDL (từ [data-model.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/data-model.md)) trên Supabase SQL Editor để tạo các bảng `profiles`, `contracts`, `contract_chunks`, `risks`, `chat_messages`.
- [x] **Hoàn thiện tính năng Tải lên PDF (Liên quan đến Issue [#1 [US-01]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L25))**:
  - [x] Tích hợp thư viện `react-dropzone` vào component `DocumentUpload` để xử lý kéo thả.
  - [x] Viết API Route backend `POST /api/contracts` để nhận file PDF từ client.
  - [x] Viết logic validate phía server (chỉ chấp nhận `.pdf`, kích thước < 10MB).
  - [x] Cấu hình Supabase Storage bucket `contracts` và viết logic upload file PDF lên bucket.
  - [x] Ghi thông tin meta của hợp đồng (url, name, size) vào bảng `contracts` của PostgreSQL.
- [x] **Hoàn thiện tính năng Trích xuất & Xem nội dung (Liên quan đến Issue [#2 [US-02]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L52))**:
  - [x] Cài đặt và import thư viện `pdf-parse` (thay thế bằng `pdf2json` và `mammoth`) trong API Route backend Next.js.
  - [x] Viết hàm trích xuất text thô từ file PDF sau khi upload.
  - [x] Xây dựng thuật toán phân cắt văn bản (Chunking) theo kích thước 500-1000 tokens và lưu các đoạn thô vào bảng `contract_chunks`.
  - [x] Tạo API Route `GET /api/contracts/[id]` để lấy danh sách chunks text của hợp đồng.
  - [x] Kết nối dữ liệu thô với Component Contract Viewer phía Client để render văn bản cuộn có đánh số dòng.
- [x] **Tích hợp và Bàn giao tuần 6**:
  - [x] Tạo Pull Request tích hợp tính năng Core (Sprint 1) và thực hiện review mã nguồn.
  - [x] Hoàn thành nhật ký sử dụng AI tuần 6: `docs/ai-logs/week-06.md`.

### Tuần 7: Sprint 2 - Tích Hợp AI Agent & Phân Tích Rủi Ro [ĐANG LÀM]
*Mục tiêu: Thiết kế cấu trúc Agentic, quét rủi ro hợp đồng bằng AI kèm bằng chứng trích dẫn gốc và tương tác highlight trên UI.*
- [ ] **Thiết lập Agentic Stack (Liên quan đến Issue [#10 [US-10]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L253))**:
  - [ ] Cài đặt Google GenAI SDK (hoặc Vercel AI SDK) và cấu hình khóa API Gemini.
  - [ ] Cấu hình Google ADK (Agent Development Kit) cho dự án để thiết lập State Graph.
  - [ ] Viết logic State Graph định nghĩa các node xử lý của Agent (`AnalyzeNode` -> `VerifyNode`).
  - [ ] Thiết lập hàm tự động sinh Vector Embeddings khi lưu chunks bằng mô hình `text-embedding-004`.
- [ ] **Tạo Antigravity Skill mẫu (Liên quan đến Issue [#11 [US-11]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L282))**:
  - [ ] Khởi tạo thư mục `.agents/skills/contract-auditor` và tệp tin `SKILL.md`.
  - [ ] Soạn thảo chỉ dẫn heuristics nhận diện rủi ro (Cao, Trung bình, Thấp) và các mẫu đối chiếu (few-shot examples) trong file `SKILL.md`.
- [ ] **Hoàn thiện tính năng Phân tích Rủi ro bằng AI (Liên quan đến Issue [#5 [US-05]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L118))**:
  - [ ] Xây dựng API Route `GET /api/contracts/[id]/analyze` để kích hoạt phân tích rủi ro của Agent.
  - [ ] Cấu hình prompt chi tiết yêu cầu Gemini API trả về định dạng JSON Structured Output (gồm: id, category, severity, title, explanation, source_clause).
  - [ ] Lưu các thẻ rủi ro trả về vào bảng `risks`.
  - [ ] Hiển thị danh sách thẻ rủi ro có màu sắc phân biệt theo mức độ nghiêm trọng ở Sidebar bên phải.
- [ ] **Hoàn thiện trích xuất dẫn chứng & tô sáng nguồn gốc (Liên quan đến Issue [#6 [US-06]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L162) & [#7 [US-07]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L186))**:
  - [ ] Yêu cầu Gemini API trích xuất nguyên văn chuỗi text gốc làm căn cứ rủi ro (`excerpt`) mà không chỉnh sửa câu từ.
  - [ ] Lưu trữ tọa độ dòng (`line-number`) hoặc offset ký tự của đoạn trích dẫn.
  - [ ] Viết logic client-side: Click vào thẻ rủi ro -> tự động cuộn mượt (smooth scroll) màn hình hiển thị bên trái đến đoạn văn tương ứng và tô sáng màu nền tương ứng mức độ rủi ro.
- [ ] **Kiểm thử & Bàn giao tuần 7**:
  - [ ] Tạo file kiểm thử chất lượng phân tích của AI và các bộ dữ liệu mẫu: `docs/AI_FEATURE_TEST.md`.
  - [ ] Tạo Pull Request tích hợp tính năng AI (Sprint 2).
  - [ ] Hoàn thành nhật ký sử dụng AI tuần 7: `docs/ai-logs/week-07.md`.

### Tuần 8: Sprint 3 - UX Tìm Kiếm, Bảo Mật Xác Thực & Chống Ảo Giác
*Mục tiêu: Nâng cao trải nghiệm tìm kiếm, bảo vệ dữ liệu người dùng bằng tài khoản và cơ chế đối soát chống ảo tưởng.*
- [ ] **UX Tìm kiếm & Mục lục tự động (Liên quan đến Issue [#3 [US-03]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L74) & [#4 [US-04]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L96))**:
  - [ ] Thiết kế và code tính năng Tìm kiếm từ khóa nhanh trong Contract Viewer, tô sáng màu vàng nhạt tất cả từ trùng khớp.
  - [ ] Thêm nút mũi tên Lên/Xuống để duyệt qua các kết quả trùng khớp.
  - [ ] Dùng regex nhận diện tiêu đề cấu trúc hợp đồng để tạo mục lục tự động hiển thị ở sidebar.
- [ ] **Tích hợp Tài khoản & Bảo mật dữ liệu (Liên quan đến Issue [#8 [US-08]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L208), [#9 [US-09]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L234) & [#12 [US-12]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L311))**:
  - [ ] Tích hợp Supabase Auth xử lý đăng ký, đăng nhập bảo mật qua JWT ở client & server.
  - [ ] Cấu hình Row Level Security (RLS) trên các bảng Supabase PostgreSQL để bảo vệ dữ liệu giữa các người dùng.
  - [ ] Triển khai hàm Sanitization làm sạch văn bản PDF đầu vào để chống lỗ hổng bảo mật Prompt Injection trước khi gửi lên AI.
- [ ] **Cơ chế kiểm soát chất lượng AI (Chống ảo tưởng)**:
  - [ ] Viết bộ lọc client-side đối chiếu 100% chuỗi trích dẫn gốc của AI với văn bản thô để đảm bảo độ trung thực trước khi hiển thị thẻ rủi ro lên giao diện.
- [ ] **Báo cáo & Bàn giao tuần 8**:
  - [ ] Biên soạn các báo cáo bảo mật và kiểm thử: `docs/TEST_PLAN.md`, `docs/SECURITY.md`, `docs/AI_SAFETY_REVIEW.md`.
  - [ ] Tạo Pull Request tích hợp Sprint 3.
  - [ ] Hoàn thành nhật ký sử dụng AI tuần 8: `docs/ai-logs/week-08.md`.

---

## 🚀 GIAI ĐOẠN 3: TỐI ƯU HÓA, HOÀN THIỆN & BẢO VỆ (WEEKS 9 - 10)

### Tuần 9: DevOps Triển Khai Cloud, Refactoring & Tài Liệu
*Mục tiêu: Đóng gói Agent, deploy đám mây, tối ưu hóa code và viết hướng dẫn cài đặt.*
- [ ] **Triển khai Agent đám mây (Liên quan đến Issue [#13 [US-13]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L340))**:
  - [ ] Tạo Dockerfile đóng gói Agent viết bằng ADK.
  - [ ] Triển khai Agent lên Google Cloud Agent Runtime.
  - [ ] Cấu hình Next.js server kết nối gọi endpoint Agent Runtime trên đám mây.
- [ ] **Tối ưu hóa Code & Tài liệu**:
  - [ ] Sử dụng AI kiểm toán toàn bộ codebase để phát hiện technical debt, lập tài liệu: `docs/TECHNICAL_DEBT.md`.
  - [ ] Tiến hành refactor mã nguồn (tối ưu hóa cấu trúc component, kiểu dữ liệu TypeScript).
  - [ ] Cập nhật hướng dẫn chạy dự án đầy đủ tại file [README.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/README.md).
  - [ ] Cấu hình Workflow chạy kiểm thử tự động (ví dụ: GitHub Actions).
  - [ ] Viết tài liệu hướng dẫn cách triển khai (deploy) sản phẩm Next.js lên Vercel: `docs/DEPLOYMENT.md`.
- [ ] **Bàn giao tuần 9**:
  - [ ] Tạo Pull Request hoàn thiện và review.
  - [ ] Hoàn thành nhật ký sử dụng AI tuần 9: `docs/ai-logs/week-09.md`.

### Tuần 10: Phát Hành, Demo, Nộp Bài Kaggle & Bảo Vệ Đồ Án
*Mục tiêu: Đóng gói sản phẩm, deploy chạy trực tiếp, nộp bài Kaggle Capstone và sẵn sàng báo cáo.*
- [ ] **Phát hành & Demo**:
  - [ ] Tạo bản phát hành chính thức (Release v1.0.0) trên GitHub.
  - [ ] Triển khai chạy thực tế dự án Next.js trên Vercel. Sẵn sàng link chạy thử nghiệm.
- [ ] **Hồ sơ nộp bài Kaggle Capstone (Liên quan đến Issue [#14 [US-14]](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md#L365))**:
  - [ ] Chuẩn bị và viết bài báo cáo dự án trên Kaggle (< 2500 từ). Lựa chọn Track nộp bài phù hợp nhất (khuyến nghị: **Agents for Good** hoặc **Agents for Business**).
  - [ ] Chuyển trạng thái GitHub Repository của nhóm sang chế độ **Public** và ẩn tất cả API keys.
  - [ ] Quay một video ngắn dưới 5 phút chất lượng cao demo hoạt động thực tế của Agent.
  - [ ] Gửi link bài nộp đầy đủ (Kaggle Writeup, Github link, Video link, Vercel link) lên hệ thống cuộc thi.
- [ ] **Báo cáo tổng kết môn học**:
  - [ ] Biên soạn tài liệu báo cáo tổng kết cuối cùng: `docs/FINAL_REPORT.md`.
  - [ ] Viết bài tự đánh giá, phản hồi về quá trình cộng tác với AI Agent: `docs/AI_ENGINEERING_REFLECTION.md`.
  - [ ] Chuẩn bị bài thuyết trình slide và tập dượt phản biện các câu hỏi kiểm tra của giáo viên hướng dẫn.
  - [ ] Hoàn thành nhật ký sử dụng AI tuần 10: `docs/ai-logs/week-10.md`.

