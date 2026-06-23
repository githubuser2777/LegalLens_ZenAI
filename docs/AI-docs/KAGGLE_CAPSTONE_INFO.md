# THÔNG TIN VỀ CUỘC THI KAGGLE CAPSTONE (AI AGENTS)

Tài liệu này tổng hợp toàn bộ ngữ cảnh, yêu cầu nộp bài, các track thi đấu và tiêu chí đánh giá của cuộc thi **AI Agents: Intensive Vibe Coding Capstone Project** trên Kaggle nhằm phục vụ định hướng phát triển dự án **LegalLens AI** làm bài thi Capstone.

---

## 📌 Tổng Quan Cuộc Thi

*   **Tên cuộc thi**: AI Agents: Intensive Vibe Coding Capstone Project
*   **Đơn vị tổ chức**: Google phối hợp với cộng đồng Kaggle.
*   **Bối cảnh**: Đây là dự án thực hành cuối khóa (Capstone Project) sau khóa học chuyên sâu **"5-Day AI Agents: Intensive Vibe Coding Course with Google"**.
*   **Đường dẫn cuộc thi**: [Kaggle Competition Page](https://www.kaggle.com/competitions/vibecoding-agents-capstone-project/overview)
*   **Mục tiêu**: Phát triển và triển khai một AI Agent (Tác nhân AI) tự chủ, giải quyết một bài toán thực tế, giúp đỡ mọi người hoặc cải thiện cuộc sống/công việc hàng ngày.

---

## 🏆 Các Track Thi Đấu (Tracks)

Người nộp bài cần lựa chọn một trong bốn track sau cho bài viết báo cáo (Kaggle Writeup) của mình:

1.  **Agents for Good (AI vì Cộng đồng)**:
    *   *Mô tả*: Các Tác nhân AI giải quyết vấn đề xã hội, hỗ trợ giáo dục, bảo vệ quyền lợi người yếu thế hoặc nâng cao đời sống dân cư.
    *   *Mức độ phù hợp với LegalLens AI*: **Rất cao**. Hỗ trợ học sinh, sinh viên, người đi thuê nhà rà soát các điều khoản bất lợi/predatory trong hợp đồng thuê nhà để tránh bị mất cọc hoặc lừa đảo.
2.  **Agents for Business (AI cho Doanh nghiệp)**:
    *   *Mô tả*: Hỗ trợ tự động hóa quy trình nghiệp vụ, tối ưu năng suất, giảm chi phí vận hành cho các doanh nghiệp (đặc biệt là vừa và nhỏ) hoặc freelancers.
    *   *Mức độ phù hợp với LegalLens AI*: **Cao**. Rà soát NDA, hợp đồng dịch vụ, hợp đồng cung ứng cho các freelancers và doanh nghiệp nhỏ để phòng tránh rủi ro pháp lý mà không mất chi phí thuê luật sư lớn.
3.  **Concierge Agents (AI Hỗ trợ & Trợ lý)**:
    *   *Mô tả*: Các trợ lý cá nhân thông minh, hỗ trợ lập kế hoạch, đặt lịch, quản lý thông tin hoặc chăm sóc khách hàng tự động.
4.  **Freestyle (Tự do)**:
    *   *Mô tả*: Các ý tưởng AI Agent đột phá ngoài phạm vi các track trên.

---

## 📋 Yêu Cầu Hồ Sơ Nộp Bài (Submission Requirements)

Mỗi bài thi hợp lệ cần cung cấp đầy đủ 4 thành phần bắt buộc sau:

| STT | Thành phần nộp bài | Chi tiết yêu cầu |
| :--- | :--- | :--- |
| **1** | **Kaggle Writeup** | Một bài viết báo cáo chi tiết trên diễn đàn Kaggle (tối đa 2.500 từ). Mô tả về ý tưởng, kiến trúc, và bài học rút ra. Phải chọn rõ 1 trong 4 track thi đấu. |
| **2** | **Public Codebase** | Đường dẫn tới kho mã nguồn (ví dụ: GitHub Repository) ở trạng thái **Public (Công khai)**. Mã nguồn cần sạch sẽ, có tài liệu hướng dẫn và tuyệt đối không rò rỉ API Keys. |
| **3** | **Video Demonstration** | Một video giới thiệu/demo sản phẩm thời lượng **tối đa 5 phút** (đăng công khai trên YouTube/Loom). Video cần làm nổi bật giá trị người dùng và luồng chạy thực tế của Agent. |
| **4** | **Project Link** | Link truy cập trực tiếp đến sản phẩm đã được triển khai chạy thực tế (ví dụ: host trên Vercel, Firebase hoặc Google Cloud). |

---

## 🔍 Tiêu Chí Đánh Giá Của Ban Giám Khảo

Hội đồng giám khảo đánh giá bài dự thi dựa trên các khía cạnh chủ chốt sau:

*   **Problem Definition (Xác định Vấn đề)**: Lý do bạn chọn bài toán này ("Why") và tầm quan trọng của nó trong cuộc sống thực tế.
*   **Solution Design (Thiết kế Giải pháp)**: Kiến trúc hệ thống thông minh, sự phân tách logic của Agent (ví dụ: thiết kế State Graph của Google ADK, sử dụng các công cụ/tools phù hợp).
*   **Implementation Quality (Chất lượng Triển khai)**:
    *   Mức độ áp dụng hiệu quả công nghệ Agentic (Sử dụng Model Context Protocol - MCP, Google GenAI SDK, Antigravity Skills).
    *   Cơ chế an toàn (Secure coding) và đối soát giảm thiểu ảo giác AI (Hallucination mitigation).
*   **Communication (Khả năng Truyền đạt)**: Cách trình bày ý tưởng, bài viết Writeup mạch lạc và video demo lôi cuốn, dễ hiểu.
*   **User Value (Giá trị Thực tế)**: Tác động thực tiễn của sản phẩm đối với đối tượng người dùng mục tiêu.

---

## 💡 Khái niệm cốt lõi: Vibe Coding & Agentic Engineering

*   **Vibe Coding**: Thuật ngữ (phổ biến bởi Andrej Karpathy) ám chỉ việc lập trình bằng ngôn ngữ tự nhiên thông qua việc điều phối các mô hình AI. Nhà phát triển đóng vai trò "Nhạc trưởng" (Orchestrator) định hướng kiến trúc, yêu cầu, và kiểm tra đánh giá, thay vì tự gõ từng dòng lệnh.
*   **Agentic Engineering**: Tiếp cận phát triển phần mềm bằng cách coi các AI Agent như các nhân tố tự chủ làm việc trong một hệ thống có giám sát (human-in-the-loop), được trang bị các Tools, bộ nhớ (Memory), và cơ chế tự kiểm tra/phản biện để đảm bảo độ tin cậy của sản phẩm.

---

## 📘 Hướng Dẫn Chi Tiết Từ Các Google Codelabs

Dưới đây là tóm tắt nghiệp vụ và cách áp dụng cụ thể của 5 tài liệu Codelabs đi kèm khóa học vào dự án **LegalLens AI**:

### 1. [Getting Started with Antigravity Skills](https://codelabs.developers.google.com/getting-started-with-antigravity-skills?hl=en#4)
*   **Mô tả**: Hướng dẫn cài đặt và sử dụng môi trường phát triển Antigravity (IDE & CLI) và cách xây dựng các **Skills** tùy chỉnh. Skills là các chỉ dẫn dạng `SKILL.md` (chứa metadata YAML và hướng dẫn markdown) giúp mở rộng năng lực của AI Agent khi pair-programming hoặc thực thi nhiệm vụ chuyên biệt.
*   **Cách áp dụng vào LegalLens AI**:
    *   Tạo một Custom Skill tại `.agents/skills/contract-auditor/SKILL.md`.
    *   Trong file `SKILL.md`, định nghĩa chi tiết các heuristics quét rủi ro hợp đồng (ví dụ: các mẫu điều khoản bẫy cọc, tự động gia hạn phạt tiền) và các ví dụ few-shot để AI Agent học theo cách phân tích của một chuyên gia pháp lý thực thụ.

### 2. [ADK Lifecycle & Multi-Agent Systems](https://codelabs.developers.google.com/agents-cli-adk-lifecycle)
*   **Mô tả**: Hướng dẫn vòng đời phát triển của một AI Agent bằng **Agent Development Kit (ADK)**. Tập trung vào cách thiết lập đồ thị trạng thái (**State Graph**), quản lý bộ nhớ hội thoại, định nghĩa các Tools (APIs, functions) để Agent tự gọi và thiết kế mô hình Đa tác nhân (Multi-Agent System) khi cần chia sẻ công việc cho các agent chuyên môn khác.
*   **Cách áp dụng vào LegalLens AI**:
    *   Sử dụng ADK để code sơ đồ State Graph cho Agent phân tích hợp đồng.
    *   Đăng ký các Tools cho Agent như: `extract_pdf_text`, `search_legal_dictionary`, `verify_citation_offsets`.
    *   Thiết kế luồng xử lý: Agent nhận PDF -> chạy Tool trích xuất text -> Node `AnalyzeNode` phân tích rủi ro -> Node `VerificationNode` (Evaluator) kiểm tra lại trích dẫn gốc trước khi xuất ra.

### 3. [Secure Agentic Coding](https://codelabs.developers.google.com/secure-agentic-coding)
*   **Mô tả**: Hướng dẫn xây dựng các AI Agent an toàn bảo mật sử dụng quy trình Test-Driven Development (TDD). Codelab dạy cách cấu hình file `CONTEXT.md` để quy định các biên giới an toàn, triển khai Threat Modeling (STRIDE) trực tiếp trong IDE, và sử dụng các Git hooks (như Semgrep) kèm Pytest để quét và ngăn chặn mã nguồn độc hại hoặc rò rỉ dữ liệu.
*   **Cách áp dụng vào LegalLens AI**:
    *   Xây dựng bộ lọc an toàn dữ liệu đầu vào (Input Sanitization) nhằm chặn đứng lỗ hổng **Prompt Injection** ẩn trong các file PDF hợp đồng do người dùng tải lên (ví dụ: các câu lệnh ẩn dụ đánh lừa AI bỏ qua lỗi hợp đồng).
    *   Thiết lập kiểm thử bảo mật tự động bằng Pytest để đảm bảo Agent không bao giờ trả về dữ liệu cá nhân ngoài phạm vi tài khoản của người dùng (RLS check).

### 4. [Deploying Agent to Agent Runtime on Google Cloud](https://codelabs.developers.google.com/enterprise-cloud-scale-deploying-the-expense-agent-to-agent-runtime-on-google-cloud)
*   **Mô tả**: Hướng dẫn đóng gói Agent (sử dụng Dockerfile) và triển khai lên hạ tầng đám mây **Google Cloud Agent Runtime** (chạy trên nền Cloud Run). Codelab cũng hướng dẫn xây dựng cơ chế **Human-in-the-loop** (con người phê duyệt trong luồng đi của Agent) thông qua Cloud Pub/Sub và Dashboard tương tác.
*   **Cách áp dụng vào LegalLens AI**:
    *   Viết Dockerfile đóng gói Agent viết bằng ADK.
    *   Sử dụng gcloud CLI để deploy Agent lên Google Cloud Agent Runtime.
    *   Next.js API route của bạn sẽ gọi sang endpoint của runtime này để thực hiện quét hợp đồng trên hạ tầng production đám mây mạnh mẽ và ổn định.

### 5. [Vibecode Frontend with Antigravity](https://codelabs.developers.google.com/vibecode-frontend-with-antigravity)
*   **Mô tả**: Hướng dẫn xây dựng giao diện người dùng tương tác thời gian thực với AI Agent (Agentic UI). Tập trung vào việc xử lý phản hồi dạng Stream (Streaming Responses), hiển thị trạng thái suy nghĩ (thought process) của Agent, các bước Agent gọi Tool, và phản hồi giao diện dạng sự kiện (event-driven UI).
*   **Cách áp dụng vào LegalLens AI**:
    *   Tối ưu hóa giao diện Next.js để stream kết quả phân tích rủi ro từ Agent.
    *   Khi Agent đang phân tích, giao diện hiển thị rõ Agent đang làm bước nào (ví dụ: *"Đang đọc hợp đồng..."*, *"Đang gọi Tool rà soát cọc..."*, *"Đang đối chiếu trích dẫn..."*) giúp tăng trải nghiệm người dùng (UX) và tạo cảm giác hệ thống đang hoạt động thông minh.

