# Nhật ký Sử dụng AI - Tuần 03

## Dự án

LegalLens AI

## Tuần phát triển

Tuần 03 - Phân tích Mã nguồn hoặc Xây dựng Bản mẫu (Codebase Reading or Prototype)

## Mục tiêu của Nhóm

Sử dụng AI hỗ trợ đọc hiểu cấu trúc codebase hiện tại, thiết kế chi tiết trải nghiệm người dùng (UX Prototype) và cập nhật hoàn thiện tài liệu yêu cầu sản phẩm (REQUIREMENTS.md) với đầy đủ các kịch bản kiểm thử BDD làm cơ sở để phân chia công việc trong các Sprint tiếp theo.

---

## Các công việc đã thực hiện

### Công việc 1: Phân tích & Đọc hiểu cấu trúc mã nguồn (Codebase Reading)

#### Mục tiêu
Tìm hiểu cấu trúc dự án hiện tại, các công nghệ và thư viện đang được sử dụng để chuẩn bị tích hợp tính năng.

#### Hỗ trợ từ AI
AI (Google Antigravity) đóng vai trò là Chuyên gia Đọc hiểu Mã nguồn (Codebase Reader):
* Liệt kê các thư mục chính trong dự án.
* Giải thích vai trò của các tệp tin cấu hình.
* Đề xuất luồng tích hợp giữa phần Backend (FastAPI) và Frontend (Next.js) cho tính năng tải lên và phân tích tài liệu.

#### Prompt đã sử dụng
> Read this repository structure and identify the main directories. Explain where the frontend code, backend code, and documentation reside. Suggest where the AI-related configs should go.

#### Tóm tắt phản hồi của AI
AI đã chỉ ra:
* Thư mục `.agents/` chứa các tài liệu quy chuẩn cho AI Agent.
* Thư mục `docs/` chứa toàn bộ tài liệu đặc tả nghiệp vụ và phân tích sản phẩm của dự án.
* Dự án hiện tại đang ở giai đoạn khởi tạo cấu trúc tài liệu và thiết kế giao diện tĩnh (mockup). AI khuyến nghị duy trì cấu trúc tách biệt giữa các tài liệu nghiệp vụ (`docs/Product_docs`) và tài liệu lớp học (`docs/Activities-on-class`).

#### Đánh giá của Con người
Nhóm chấp nhận khuyến nghị của AI và tiến hành tổ chức lại cấu trúc tài liệu, đưa file `docs/REQUIREMENTS.md` ra thư mục tài liệu chính thức của dự án để dễ quản lý.

---

### Công việc 2: Thiết kế UX/UI Prototype (docs/UX_PROTOTYPE.md)

#### Mục tiêu
Xây dựng chi tiết luồng trải nghiệm người dùng (User Flows) và sơ đồ phác thảo giao diện (Wireframes) cho ứng dụng trước khi tiến hành lập trình giao diện thực tế.

#### Hỗ trợ từ AI
AI đóng vai trò là Chuyên viên Thiết kế Trải nghiệm Người dùng (UX/UI Designer):
* Phác thảo cấu trúc trang web Workspace chia làm 2 phần: Trình xem hợp đồng ở bên trái (2/3 màn hình) và Trình phân tích AI ở bên phải (1/3 màn hình).
* Thiết kế luồng xử lý PDF qua 4 giai đoạn trực quan (Tải lên -> Trích xuất -> Định danh điều khoản -> Phân tích rủi ro).
* Viết chi tiết mã nguồn Markdown phác thảo các khung Wireframe dạng văn bản cho trang chủ và workspace.

#### Prompt đã sử dụng
> Thiết kế một tài liệu UX_PROTOTYPE.md chi tiết cho LegalLens AI. Tập trung vào 3 luồng người dùng chính: Tải lên và xử lý PDF, xem kết quả rủi ro và đối chiếu nguồn gốc, và hỏi đáp hợp đồng (QA). Hãy mô phỏng wireframe bằng định dạng ký tự text (ASCII) trực quan.

#### Tóm tắt phản hồi của AI
AI đã tạo ra tài liệu [UX_PROTOTYPE.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/UX_PROTOTYPE.md) dài hơn 200 dòng, mô tả chi tiết:
* Nguyên tắc thiết kế: Bố cục "Google Docs + AI Audit" giúp người dùng không bị mất dấu văn bản gốc, dịch ngôn ngữ pháp lý phức tạp sang ngôn ngữ dân dã.
* Phác thảo chi tiết 3 màn hình chính: Trang tải lên, Trang thái đang xử lý, và Màn hình Workspace.
* Minh họa chi tiết tương tác cuộn mượt và tô sáng văn bản gốc khi bấm vào nguồn trích dẫn của rủi ro.

#### Đánh giá của Con người
Giao diện chia đôi màn hình và cơ chế tô sáng đồng bộ màu sắc theo mức độ rủi ro rất trực quan, giải quyết được bài toán khó tin tưởng AI của người dùng. Nhóm quyết định áp dụng toàn bộ bản thiết kế này vào giai đoạn xây dựng giao diện.

---

### Công việc 3: Cập nhật Tài liệu Yêu cầu (docs/REQUIREMENTS.md)

#### Mục tiêu
Xây dựng tài liệu yêu cầu sản phẩm chính thức chứa toàn bộ 10 User Stories của dự án cùng các kịch bản kiểm thử BDD (Given-When-Then) để làm đầu vào cho các Sprint.

#### Hỗ trợ từ AI
AI đóng vai trò là Kỹ sư Phân tích Yêu cầu (Requirements Engineer):
* Chuẩn hóa cấu trúc 10 User Stories theo chuẩn Agile (ID, Vai trò, Mục tiêu, Lợi ích).
* Thiết lập các kịch bản kiểm thử BDD (Given-When-Then) cho cả tính năng thường và tính năng tích hợp AI.
* Phân chia độ phức tạp (Story Points) và phân bổ tài nguyên vào các Sprints (MVP vs Post-MVP).

#### Prompt đã sử dụng
> Base on the activities of week 3 and the requirements in 10weeks.md, create the official REQUIREMENTS.md file. Map all 10 user stories from Epic 1 to Epic 5. Write acceptance criteria in Given-When-Then format. Make sure to define which stories are MVP (P1) and which are Post-MVP (P2/P3).

#### Tóm tắt phản hồi của AI
AI đã hoàn thành tài liệu [REQUIREMENTS.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/REQUIREMENTS.md) bao gồm:
* Sơ đồ liên kết Mermaid Epics & User Stories.
* Bảng Sprint Backlog chi tiết với Story Points (SP) cho từng tính năng.
* Mô tả chi tiết 3 kịch bản sử dụng thực tế (Sinh viên thuê trọ, Freelancer, Nhân viên mới đi làm).
* Cấu trúc kịch bản kiểm thử BDD chi tiết cho từng User Story (từ US-01 đến US-10).

#### Đánh giá của Con người
Tài liệu yêu cầu rất chi tiết và bao quát toàn bộ phạm vi dự án. Việc phân chia rõ rệt giữa MVP (Sprint 1 & 2) và Post-MVP (Sprint 3) giúp nhóm tập trung tối đa vào các tính năng cốt lõi trước.

---

## Các Quyết định Quan trọng

### Quyết định 1
**Bố cục giao diện:** Sử dụng bố cục chia đôi màn hình (Split screen: Trình xem hợp đồng bên trái, AI Workspace bên phải) thay vì giao diện Chatbot truyền thống. Điều này giúp tăng độ tin cậy và sự minh bạch do người dùng luôn kiểm chứng được văn bản gốc song song với kết quả của AI.
* *Trạng thái:* Đã thông qua.

### Quyết định 2
**Phạm vi MVP:** Giới hạn phạm vi phát triển ban đầu (Sprint 1 & 2) chỉ tập trung vào 6 User Stories cốt lõi (US-01, US-02, US-05, US-06, US-07, US-08) để đảm bảo hoàn thành đúng hạn. Các tính năng tìm kiếm, đăng ký tài khoản được chuyển sang Sprint 3.
* *Trạng thái:* Đã thông qua.

### Quyết định 3
**Tài liệu tập trung:** Đưa toàn bộ các User Stories từ các tệp tin bài tập nhỏ lẻ về một tệp tin yêu cầu chính thức duy nhất là `docs/REQUIREMENTS.md` để làm nguồn thông tin tham chiếu duy nhất (Single Source of Truth) cho nhóm và các AI Agent.
* *Trạng thái:* Đã thông qua.

---

## Bài học Kinh nghiệm rút ra

### Bài học 1
Việc thiết kế trước giao diện (Wireframes) và luồng người dùng (User Flows) trước khi viết code giúp nhóm phát hiện ra các điểm bất hợp lý trong tương tác (như việc người dùng dễ bị lạc nếu AI chỉ trả về text chat mà không chỉ rõ vị trí hợp đồng).

### Bài học 2
Kịch bản nghiệm thu BDD (Given-When-Then) là công cụ đắc lực để thống nhất hiểu biết giữa các thành viên và định hướng cho AI Agent viết các đoạn mã kiểm thử tự động sau này.

### Bài học 3
AI hỗ trợ viết tài liệu rất nhanh và đúng định dạng chuẩn mực của ngành phần mềm, giúp tiết kiệm 70% thời gian soạn thảo văn bản hành chính cho nhóm.

---

## Các Công cụ AI đã sử dụng

| Công cụ | Mục đích sử dụng |
| ------- | ---------------------- |
| Google Antigravity | Phân tích cấu trúc thư mục dự án |
| ChatGPT | Hỗ trợ brainstorm luồng tương tác UX |
| ChatGPT | Tạo cấu trúc tài liệu REQUIREMENTS.md chuẩn BDD |
| Cursor | Soạn thảo, liên kết và kiểm duyệt các tệp tài liệu |

---

## Đóng góp của Thành viên trong Nhóm

* **Cả nhóm:** Cùng họp thảo luận về các kịch bản sử dụng thực tế (User Personas) và thống nhất nguyên tắc thiết kế giao diện.
* **Thành viên BA:** Kiểm duyệt các kịch bản BDD do AI sinh ra, bổ sung kịch bản thực tế số 3 cho nhân viên mới đi làm.
* **Thành viên Tech Lead:** Đọc và duyệt cấu trúc thư mục do AI phân tích, đảm bảo tính nhất quán về công nghệ.

---

## Thách thức và Cách giải quyết

### Thách thức gặp phải
Việc mô tả cách thức tô sáng và cuộn mượt văn bản gốc (US-08) trên giao diện Web rất phức tạp để đặc tả bằng lời cho lập trình viên hiểu.

### Cách thức giải quyết
Nhóm đã sử dụng AI để phác thảo sơ đồ hành trình người dùng (User Journey) bằng Mermaid và viết kịch bản BDD chi tiết mô tả rõ ràng trạng thái trước (Given), hành động click (When) và kết quả màn hình tự cuộn tô sáng (Then).

---

## Các tài liệu bàn giao Tuần 03

* [docs/UX_PROTOTYPE.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/UX_PROTOTYPE.md) (Bản phác thảo thiết kế giao diện và luồng tương tác)
* [docs/REQUIREMENTS.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/REQUIREMENTS.md) (Tài liệu yêu cầu dự án chính thức)
* [docs/ai-logs/week-03.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/ai-logs/week-03.md) (Tài liệu nhật ký này)
