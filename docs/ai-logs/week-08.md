# Nhật ký tương tác AI - Tuần 8 (Sprint 3)

## Mục tiêu Sprint
Tập trung vào trải nghiệm tìm kiếm, bảo mật dữ liệu người dùng (Auth & RLS), triển khai chống Prompt Injection và đưa Agent Runtime lên Google Cloud.

## Tóm tắt công việc AI hỗ trợ
1. **UX Tìm kiếm & Mục lục:** AI đã thiết kế thuật toán RegExp `/^(Điều \d+|Article \d+|Chương \d+)[:.]?\s*(.*)$/gmi` để phân tách tiêu đề, sau đó dùng hàm chẻ chuỗi để highlight từ khóa tìm kiếm mà không ghi đè lên thẻ highlight rủi ro hiện tại. Thêm tính năng cuộn mượt đến từng element.
2. **Bảo mật RLS & Authentication:** AI đã tích hợp Supabase Auth, thiết kế giao diện `/login` và `/signup` tách biệt (theo phong cách Glassmorphism). Khởi tạo migration SQL số 002 để cấu hình Row Level Security cho database.
3. **AI Security (Chống thao túng prompt):** Xây dựng module `AIValidator` độc lập dùng Heuristics ngăn chặn Injection và gọi hàm này ngay trước khi cho phép Next.js proxy request tới Agent. Tích hợp thanh lọc token hệ thống (System tokens strip).
4. **DevOps:** Đóng gói Agent bằng Docker và tạo file `deploy-agent.yml` để thiết lập quy trình tự động triển khai (CI/CD) thông qua GitHub Actions đẩy thẳng lên Google Cloud Run.
5. **Văn bản báo cáo:** Tự động hóa quá trình sinh báo cáo Test Plan, Security Review và AI Safety Review.

## Đánh giá
Tuần này tốc độ thực thi rất tốt. Sự phối hợp giữa lập trình viên và AI trong việc quyết định cấu trúc bảo mật (sử dụng Heuristics kết hợp RLS) đã giúp tiết kiệm đáng kể thời gian mà vẫn đảm bảo tiêu chuẩn bảo mật khắt khe. Các tính năng cốt lõi của Sprint 3 đã hoàn thiện 100%.
