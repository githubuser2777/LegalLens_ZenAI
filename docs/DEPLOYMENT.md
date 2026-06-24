# Hướng dẫn Triển khai (Deployment Guide) lên Vercel

Dự án LegalLens AI (Next.js) được thiết kế tối ưu nhất khi triển khai thông qua Vercel.

## Quy trình các bước

1. **Chuẩn bị Repository**
   - Đảm bảo mã nguồn mới nhất đã được push lên nhánh `main` trên GitHub.
   - Kho lưu trữ có thể để chế độ `Public` hoặc `Private`.

2. **Kết nối Vercel**
   - Đăng nhập vào [Vercel](https://vercel.com).
   - Chọn **Add New...** > **Project**.
   - Cấp quyền truy cập GitHub và chọn repository `LegalLens_ZenAI` (hoặc tên tương ứng).

3. **Cấu hình Environment Variables**
   - Tại mục **Environment Variables** trước khi bấm Deploy, bạn cần copy các biến từ file `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `GEMINI_API_KEY`

4. **Deploy**
   - Bấm **Deploy**. Vercel sẽ tự động phát hiện framework Next.js, cài đặt thư viện và chạy lệnh `npm run build`.
   - Nếu build thành công, bạn sẽ nhận được một đường link Production sẵn sàng chia sẻ.

## Lưu ý đối với Google Cloud Agent Runtime
- Đảm bảo biến môi trường trỏ đến đúng URL của Cloud Run endpoint (nếu bạn sử dụng API route riêng nối đến Agent Runtime).
