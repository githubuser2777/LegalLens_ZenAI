# Hướng dẫn Deploy Agent Runtime lên Google Cloud Run

Tài liệu này hướng dẫn cách deploy phần backend Agent (nằm trong thư mục `agent/`) lên **Google Cloud Run**. Bạn có thể thực hiện thông qua **GitHub Actions** (CI/CD tự động) hoặc **Manual Deploy** (Triển khai thủ công bằng dòng lệnh).

## Phương án 1: Triển khai tự động bằng GitHub Actions (Khuyến nghị)
Hệ thống đã được thiết lập sẵn file workflow tại `.github/workflows/deploy-agent.yml`. Mỗi khi có code mới được merge/push vào branch `main` tại thư mục `agent/`, quá trình deploy sẽ tự động diễn ra.

**Yêu cầu thiết lập:**
Bạn cần cấu hình các Secrets sau trong repository GitHub của dự án (`Settings` > `Secrets and variables` > `Actions`):

1. `GCP_PROJECT_ID`: ID dự án Google Cloud của bạn.
2. `GCP_CREDENTIALS`: Nội dung file JSON chứa Service Account Key có quyền (Cloud Run Admin, Artifact Registry Writer, Service Account User).

**Quản lý Biến môi trường (Secrets) trên Google Cloud:**
Agent yêu cầu các biến môi trường để hoạt động. Bạn cần vào **Google Cloud Secret Manager** và tạo các secret sau:
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Phương án 2: Triển khai thủ công (Manual Deploy qua CLI)
Nếu bạn muốn tự deploy từ máy tính cá nhân để kiểm thử, hãy cài đặt **Google Cloud CLI** và làm theo các bước sau:

**Bước 1: Xác thực tài khoản Google Cloud**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

**Bước 2: Cấp quyền gọi dịch vụ (nếu cần)**
```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

**Bước 3: Deploy mã nguồn lên Cloud Run**
Chạy lệnh sau ngay tại thư mục root của dự án (hoặc thư mục `agent/`). Lệnh này sẽ tự động build image bằng Cloud Build và đẩy lên Cloud Run:

```bash
cd agent
gcloud run deploy legallens-adk-agent \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars=AGENT_PORT=8080 \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,NEXT_PUBLIC_SUPABASE_URL=NEXT_PUBLIC_SUPABASE_URL:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest"
```

*Lưu ý: Đối số `--set-secrets` yêu cầu bạn đã tạo các secret tương ứng trên Google Cloud Secret Manager.*

**Bước 4: Cập nhật biến môi trường cho Frontend**
Sau khi lệnh hoàn tất, Terminal sẽ hiển thị một đường dẫn URL (ví dụ: `https://legallens-adk-agent-xxx.a.run.app`).
Hãy copy URL này và gán vào file `.env.local` ở phía Next.js (thư mục root):

```env
AGENT_URL=https://legallens-adk-agent-xxx.a.run.app
```

Restart lại Next.js dev server để hệ thống bắt đầu gọi đến Agent vừa deploy.
