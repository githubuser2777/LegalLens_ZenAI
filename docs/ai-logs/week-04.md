# Nhật ký Sử dụng AI - Tuần 04

## Dự án

LegalLens AI

## Tuần phát triển

Tuần 04 - Tài liệu Yêu cầu, Issues và Nhiệm vụ sẵn sàng cho Agent (Requirements, Issues, and Agent-Ready Tasks)

## Mục tiêu của Nhóm

Mục tiêu chính của nhóm trong tuần này là thiết lập và tinh chỉnh hệ thống danh mục yêu cầu (Backlog) gồm các User Stories tối ưu, chuyển hóa chúng thành danh sách GitHub Issues ở trạng thái "Agent-Ready" (đầy đủ metadata, độ phức tạp, và tiêu chí nghiệm thu BDD). Đồng thời, nhóm xây dựng một thư viện prompts hệ thống và prompts nghiệp vụ chuẩn hóa, thiết lập file kiểm soát phiên bản `.gitignore` để chuẩn bị cho quá trình lập trình tự động bằng AI Agent ở các tuần tiếp theo.

---

## Các công việc đã thực hiện

### Công việc 1: Cấu hình tệp tin kiểm soát phiên bản (.gitignore)

#### Mục tiêu
Tạo tệp `.gitignore` trong thư mục gốc của dự án để ngăn chặn việc commit các thư mục dependencies (`node_modules/`, `venv/`), các tệp tin cache của Next.js (`.next/`), log file, và các tệp môi trường nhạy cảm chứa API keys (`.env*`).

#### Hỗ trợ từ AI
AI (Google Antigravity) đóng vai trò là Kỹ sư DevOps:
* Tư vấn danh sách các thư mục/tệp tin rác phát sinh trong môi trường phát triển Next.js (Node.js) và FastAPI (Python).
* Hướng dẫn loại trừ các file cache và file cục bộ không được đưa lên GitHub để tránh xung đột mã nguồn giữa các thành viên.

#### Prompt đã sử dụng
> Create .gitignore file for node, next.js, python, and local environments in the workspace root. Ensure it includes standard exclusions for Next.js build folders, python virtual environment, environment variable files, and system temporary directories.

#### Tóm tắt phản hồi của AI
AI đã đề xuất cấu trúc tệp [.gitignore](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/.gitignore) toàn diện bao gồm:
* Thư mục `node_modules/`, `.next/`, `out/`, `build/` cho Node/React.
* Thư mục `__pycache__/`, `.venv/`, `venv/`, `.pytest_cache/` cho Python/FastAPI.
* File cấu hình môi trường `.env`, `.env.local`, `.env*.local`.
* Thư mục log (`*.log`) và tệp tạm thời (`tmp/`, `temp/`).

#### Đánh giá của Con người
Tệp `.gitignore` được tạo chính xác, bao phủ đầy đủ cả hai môi trường Frontend và Backend mà nhóm đang định hướng sử dụng. Nhóm đã áp dụng trực tiếp tệp này vào root directory.

---

### Công việc 2: Tái cấu trúc và tinh gọn danh sách User Stories (docs/REQUIREMENTS.md)

#### Mục tiêu
Rà soát tài liệu yêu cầu cũ để đảm bảo tuân thủ nghiêm ngặt nguyên tắc của Tuần 4: Thiết lập 8-12 User Stories, trong đó giới hạn chỉ có **1-2 AI User Stories**.

#### Hỗ trợ từ AI
AI đóng vai trò là Kỹ sư Phân tích Nghiệp vụ (Business Analyst):
* Phát hiện ra tài liệu cũ có 10 User Stories nhưng có tới 3 AI stories (US-05, US-06, US-07).
* Đề xuất phương án gộp và tinh giản: Gộp tính năng phát hiện rủi ro và phân loại mức độ rủi ro (trước đây tách biệt) thành một câu chuyện duy nhất (US-05 [AI]).
* Chuyển đổi tính năng cuộn tô sáng (US-08 cũ, nay là US-07) thành câu chuyện phi-AI vì đây thuần túy là tương tác Frontend.
* Cập nhật lại sơ đồ liên kết Mermaid và bảng phân bổ Sprint Backlog.

#### Prompt đã sử dụng
> Base on the Week 4 guidelines, review and modify docs/REQUIREMENTS.md. We need to limit the AI user stories to exactly 2 stories while keeping the total number of stories between 8 and 12. Consolidate them and update the Mermaid diagram and Sprint Backlog table.

#### Tóm tắt phản hồi của AI
AI đã thực hiện cập nhật thành công tài liệu [REQUIREMENTS.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/REQUIREMENTS.md) với:
* **9 User Stories** (nằm trong khoảng 8-12).
* **2 AI User Stories** là `US-05` (Phân tích & phân loại rủi ro) và `US-06` (Trích xuất trích dẫn nguồn gốc).
* Sơ đồ Mermaid biểu diễn chính xác liên kết giữa 5 Epics và 9 User Stories.
* Bảng Sprint Backlog phân phối Story Points theo Fibonacci hợp lý.

#### Đánh giá của Con người
Việc gộp các câu chuyện AI giúp phân định rõ ràng ranh giới giữa luồng xử lý RAG thông tin (AI) và luồng tương tác hiển thị ở Client-side (phi-AI), giúp giảm độ phức tạp cho Sprint 2 sắp tới.

---

### Công việc 3: Xây dựng danh sách GitHub Issues chi tiết (docs/GITHUB_ISSUES.md)

#### Mục tiêu
Chuyển đổi 9 User Stories đã thống nhất thành danh sách GitHub Issues chi tiết ở trạng thái "Agent-Ready" để AI Agent có thể đọc hiểu và thực thi độc lập.

#### Hỗ trợ từ AI
AI đóng vai trò là Product Owner / Scrum Master:
* Chuyển đổi từng User Story thành một Issue độc lập trên GitHub.
* Điền đầy đủ metadata: Assignee, Milestone, Labels (ví dụ: `p1-must-have`, `scope:frontend`, `scope:backend`, `ai-feature`).
* Viết chi tiết kịch bản nghiệm thu BDD (Given-When-Then) cho từng trường hợp thành công (happy path) và lỗi/biên (error/edge case).
* Cung cấp chỉ dẫn kỹ thuật (Technical Guidelines) định hướng công nghệ Next.js/FastAPI cho từng issue.

#### Prompt đã sử dụng
> Create GITHUB_ISSUES.md to simulate the issues backlog for LegalLens AI project. Each issue must be agent-ready: containing clear titles, assignees, milestones, labels, story points, descriptions, detailed BDD acceptance criteria (Given-When-Then) for happy paths and edge cases, and technical implementation guidelines.

#### Tóm tắt phản hồi của AI
AI đã tạo ra tài liệu [GITHUB_ISSUES.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md) dài hơn 300 dòng, giả lập chi tiết 9 GitHub Issues tương ứng với các user stories của dự án. File trình bày rõ ràng, cấu trúc khoa học và các chỉ dẫn kỹ thuật có tính thực tiễn cao (như sử dụng React Dropzone, PyMuPDF, bọc class `<mark>` cho tô sáng).

#### Đánh giá của Con người
Tài liệu này giải quyết triệt để vấn đề mơ hồ khi giao việc cho AI Agent. Các kịch bản BDD cụ thể giúp việc chạy test tự động sau này dễ dàng hơn nhiều.

---

### Công việc 4: Soạn thảo thư viện và nhật ký Prompt dự án (docs/PROMPTS.md)

#### Mục tiêu
Lập tài liệu lưu trữ toàn bộ các prompts cốt lõi được sử dụng để điều phối AI Agent trong suốt dự án và các prompts hệ thống nhúng trong mã nguồn.

#### Hỗ trợ từ AI
AI đóng vai trò là Chuyên gia Kỹ nghệ Câu lệnh (Prompt Engineer):
* Tổng hợp các prompt điều phối theo chu kỳ phát triển phần mềm (đọc code, phân tích, viết code 2 bước, viết test, review code).
* Viết chi tiết prompts hệ thống (System Prompts) nhúng trong mã nguồn cho tính năng phân tích RAG hợp đồng (yêu cầu structured output dạng JSON) và trợ lý hỏi đáp (grounded AI).

#### Prompt đã sử dụng
> Create PROMPTS.md file documenting the AI prompts used in the LegalLens AI project. Cover both management/coordination prompts (role-based) and production/system prompts (RAG pipeline and QA chatbot system prompts).

#### Tóm tắt phản hồi của AI
AI đã viết tài liệu [PROMPTS.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/PROMPTS.md) bao gồm:
* Thư viện prompts theo vai trò: Codebase Reader, Product Analyst, Requirements Engineer, Implementation Agent (quy trình 2 bước Lập kế hoạch - Viết code), Test Engineer, Code Reviewer.
* Prompts nghiệp vụ hệ thống: Prompt RAG phân tích rủi ro hợp đồng (định dạng output JSON chặt chẽ và cơ chế gán nhãn rủi ro Cao/Trung bình/Thấp), Prompt chat hỏi đáp grounded.

#### Đánh giá của Con người
Các prompts hệ thống được định nghĩa có cấu trúc rất chặt chẽ, đặc biệt là phần định dạng đầu ra JSON của RAG. Điều này sẽ giúp ngăn ngừa tình trạng trích xuất sai cấu trúc hoặc AI trả về văn bản thừa khi gọi API.

---

## Các Quyết định Quan trọng

### Quyết định 1
**Giới hạn số lượng AI User Stories:** Nhóm quyết định gộp tính năng phát hiện rủi ro (US-05 cũ) và phân loại mức độ rủi ro (US-06 cũ) thành một câu chuyện duy nhất `US-05 [AI] Phân tích và phân loại mức độ rủi ro bằng AI`. Điều này giúp đảm bảo tuân thủ quy chuẩn của môn học là chỉ có 2 AI stories trên tổng số 9 stories, đồng thời đơn giản hóa pipeline phân tích của RAG.
* *Trạng thái:* Đã thông qua.

### Quyết định 2
**Tách biệt logic tô sáng (phi-AI):** Chuyển câu chuyện `Tự động cuộn và tô sáng văn bản gốc` thành câu chuyện phi-AI (`US-07`). Việc tô sáng hoàn toàn được giải quyết bằng thuật toán Javascript/CSS client-side dựa trên dữ liệu dòng (offset) do AI cung cấp, tránh lạm dụng gọi AI gây tăng chi phí và giảm tốc độ phản hồi.
* *Trạng thái:* Đã thông qua.

### Quyết định 3
**Giao việc 2 bước cho AI Agent:** Thống nhất quy trình làm việc với AI Agent trong file [PROMPTS.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/PROMPTS.md) theo nguyên tắc: Bước 1 - Lên kế hoạch (không viết code); Bước 2 - Viết code sau khi kế hoạch được con người phê duyệt. Quy trình này giúp nhóm kiểm soát chặt chẽ các file thay đổi, tránh AI Agent tự ý sửa đổi bừa bãi codebase.
* *Trạng thái:* Đã thông qua.

---

## Bài học Kinh nghiệm rút ra

### Bài học 1
Prompt chuyên biệt theo vai trò (Role-based prompt) hoạt động tốt hơn nhiều so với prompt chung chung. Khi gán vai trò rõ ràng như "Tech Lead", "QA Engineer", AI Agent đưa ra câu trả lời có chiều sâu chuyên môn và cấu trúc phù hợp hơn.

### Bài học 2
Nguyên tắc "Agent-Ready" đòi hỏi con người phải tư duy rõ ràng về các kịch bản biên (edge cases). Việc mô tả kịch bản biên bằng BDD (Given-When-Then) giúp lập trình viên/AI Agent lường trước các lỗi validate dữ liệu trước khi viết code.

---

## Các Công cụ AI đã sử dụng

| Công cụ | Mục đích sử dụng |
| ------- | ---------------------- |
| Google Antigravity | Phân tích và tối ưu hóa tài liệu REQUIREMENTS.md |
| Google Antigravity | Viết tệp .gitignore chuẩn DevOps |
| Google Antigravity | Mô phỏng 9 GitHub Issues chuẩn BDD và Technical Guidelines |
| Google Antigravity | Biên soạn thư viện prompt và Nhật ký sử dụng AI tuần 04 |

---

## Đóng góp của Thành viên trong Nhóm

* **Cả nhóm:** Họp bàn để gộp các user stories và thống nhất quy trình làm việc 2 bước với AI Agent.
* **Thành viên BA:** Chịu trách nhiệm chính kiểm duyệt tính logic của các kịch bản nghiệm thu BDD trong file GITHUB_ISSUES.md.
* **Thành viên Tech Lead:** Thiết lập tệp `.gitignore`, kiểm duyệt các hướng dẫn kỹ thuật trong tài liệu issues.

---

## Các tài liệu bàn giao Tuần 04

* [docs/REQUIREMENTS.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/REQUIREMENTS.md) (Tài liệu yêu cầu dự án cập nhật)
* [docs/GITHUB_ISSUES.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/GITHUB_ISSUES.md) (Danh sách 9 GitHub Issues ở trạng thái Agent-ready)
* [docs/PROMPTS.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/PROMPTS.md) (Thư viện prompt điều phối và prompt hệ thống)
* [docs/ai-logs/week-04.md](file:///c:/Users/Admin/Documents/CODE_WORKSPACE/LegalLens_ZenAI/docs/ai-logs/week-04.md) (Nhật ký sử dụng AI tuần này)
