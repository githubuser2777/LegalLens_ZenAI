# Kiến trúc Bảo mật (Security Architecture)

Dự án LegalLens ZenAI được thiết kế với tư duy "Security by Design". Mọi dữ liệu pháp lý của người dùng đều được coi là dữ liệu nhạy cảm và cần được bảo vệ ở cả cấp độ ứng dụng lẫn cơ sở dữ liệu.

## 1. Authentication (Xác thực người dùng)
Hệ thống sử dụng **Supabase Auth** để quản lý danh tính người dùng.
- Giao diện đăng nhập/đăng ký (`/login`, `/signup`) giao tiếp với Supabase thông qua thư viện `@supabase/ssr`.
- Phiên đăng nhập (Session) được cấp phát thông qua **JWT (JSON Web Token)** và lưu trữ an toàn dưới dạng HTTP-only Cookies trên trình duyệt.
- Mọi yêu cầu tới API (Next.js Route Handlers) đều trải qua bước kiểm tra Session `await supabase.auth.getUser()`. Nếu thiếu JWT hợp lệ, hệ thống trả về HTTP 401 Unauthorized.

## 2. Row Level Security (RLS)
Tất cả các bảng chứa dữ liệu nhạy cảm (`contracts`, `contract_chunks`, `risks`) đều được áp dụng chính sách **RLS (Row Level Security)** tại tầng Database (PostgreSQL).

**Cơ chế hoạt động:**
- Mọi bản ghi trong cơ sở dữ liệu đều có trường `user_id`.
- Policy được định nghĩa như sau: `USING (auth.uid() = user_id)`.
- **Kết quả:** Khi một truy vấn SQL được thực thi (bất kể từ client hay server dùng authenticated client), PostgreSQL sẽ tự động thêm màng lọc ngầm. Người dùng chỉ có thể thực hiện thao tác Thêm/Đọc/Sửa/Xóa (CRUD) trên những bản ghi khớp với `uid` của chính họ. Ngay cả khi xảy ra lỗi bảo mật Insecure Direct Object Reference (IDOR) ở tầng ứng dụng, Database vẫn từ chối trả về dữ liệu của người khác.

## 3. Storage Security
File hợp đồng (PDF, DOCX) được upload lên **Supabase Storage**.
- Tên file được sanitize lại bằng Regex (`/[^a-zA-Z0-9.-]/g`) để tránh các lỗi chèn mã thông qua tên tệp (Path Traversal hoặc Unicode issues).
- Nội dung tệp trước khi lưu vào PostgreSQL bị vô hiệu hóa các ký tự `\0` (Null bytes) gây sập Database.

## 4. Bảo vệ Middleware (AI Validator)
Trước khi dữ liệu được chuyển đến cho LLM phân tích, nó phải đi qua chốt chặn `AIValidator`:
- Vô hiệu hóa và xóa bỏ các token hệ thống nhạy cảm (`<|system|>`, `<|user|>`).
- Sử dụng công cụ giới hạn kích thước input (Max Length 100,000 ký tự) để chống tấn công cạn kiệt tài nguyên / quá tải Context Window.
