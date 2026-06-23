# Nhật ký AI - Tuần 7 (Sprint 2)

## Hoạt động
- Hoàn thiện cấu trúc Google ADK để định nghĩa Agent State Graph cho tính năng phân tích rủi ro hợp đồng.
- Xây dựng file SKILL `contract-auditor` cho Antigravity agent.
- Định nghĩa Schema cho Node trả về cấu trúc JSON chứa danh mục rủi ro, mức độ nghiêm trọng và trích dẫn gốc (`excerpt`).
- Cập nhật UI (`RiskSidebar`) và liên kết sự kiện click với `ContractViewer` để tô sáng văn bản tự động.

## Nhận xét
- **Điểm mạnh**: Google ADK cho phép kiểm soát luồng (flow) rất chặt chẽ, phù hợp với kiến trúc Agentic nhiều bước (ví dụ: Analyze -> Verify).
- **Thách thức**: Việc map chính xác `excerpt` với văn bản gốc có thể gặp rủi ro nếu quá trình bóc tách text PDF ban đầu bị lỗi font hoặc xuống dòng lộn xộn. Đã xử lý bằng giải pháp chia chuỗi đơn giản ở Client.
- **An toàn**: Prompt đã được tuning kĩ để không giải thích dài dòng và luôn trích dẫn 100% nguyên văn.
