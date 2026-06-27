# Deployment Guide cho LegalLens AI (Kaggle Capstone)

Tài liệu này hướng dẫn cách deploy phần Backend (AI Agent) lên Render.com (miễn phí, không cần thẻ) và phần Frontend (Next.js) lên Vercel để lấy link nộp bài.

## 1. Deploy Agent lên Render.com (Backend)

Phần Backend Agent đã được đóng gói sẵn file `Dockerfile` trong thư mục `agent/contract_auditor_agent`.

### Bước 1: Đẩy code lên GitHub
Đảm bảo toàn bộ dự án đã được commit và push lên GitHub.

### Bước 2: Tạo Web Service trên Render
1. Truy cập [Render.com](https://render.com/) và đăng nhập bằng tài khoản GitHub của bạn.
2. Nhấn nút **New** -> **Web Service**.
3. Chọn repo GitHub chứa dự án này.
4. Ở màn hình cấu hình, điền các thông tin sau:
   - **Name**: `contract-auditor-agent` (hoặc tên tùy thích).
   - **Environment**: Chọn `Docker`.
   - **Root Directory**: Gõ chính xác `agent/contract_auditor_agent` (QUAN TRỌNG: để Render biết đường tìm Dockerfile).
   - **Instance Type**: Chọn gói Free.
5. Thêm các biến môi trường (Environment Variables) cần thiết nếu có (VD: `GEMINI_API_KEY`).
6. Nhấn **Create Web Service**. 

Render sẽ tự động build và cung cấp cho bạn một URL dạng `https://contract-auditor-agent-xxx.onrender.com`.

---

## 2. Deploy Frontend lên Vercel

### Bước 1: Cấu hình Vercel
1. Truy cập [Vercel](https://vercel.com/) và import project từ GitHub.
2. Ở mục **Root Directory**, BỎ TRỐNG (để mặc định là `/`).
3. Trong phần **Environment Variables**, thêm các biến sau:
  - `NEXT_PUBLIC_SUPABASE_URL`: (Lấy từ Supabase Project của bạn)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Lấy từ Supabase Project)
  - `AGENT_URL`: **URL của Web Service bạn vừa lấy ở Render** (Ví dụ: `https://contract-auditor-agent-xxx.onrender.com`)

### Bước 2: Deploy
Nhấn nút **Deploy** và chờ Vercel build Next.js App của bạn. Khi thành công, bạn sẽ có Live URL của dự án.

## 3. Hoàn tất nộp bài
Lấy Live URL từ Vercel điền vào phần **Project Link** của bài thi Kaggle, kết hợp với Video Demo và Writeup.
