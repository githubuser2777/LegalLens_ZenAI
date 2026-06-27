# Setup & Deployment Guide

This guide walks you through setting up LegalLens AI for local development and deploying it to production.

## Prerequisites
- **Node.js**: v18 or newer
- **Supabase Account**: For PostgreSQL, pgvector, Auth, and Storage.
- **Google Cloud Platform**: Gemini API Key and Cloud Run (Agent Runtime).

---

## 1. Local Development Setup

### 1.1 Clone the Repository
```bash
git clone https://github.com/your-org/LegalLens_ZenAI.git
cd LegalLens_ZenAI
npm install
```

### 1.2 Configure Supabase
1. Create a new Supabase project.
2. Run the SQL schema found in `docs/DATA_MODEL.md` in the Supabase SQL Editor to create tables and RLS policies.
3. Create a new Storage Bucket named `contracts` and set it to **Private**.

### 1.3 Environment Variables
Copy the template and fill in your keys:
```bash
cp .env.example .env.local
```
Update `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-google-gemini-key
```

### 1.4 Start the Server
```bash
npm run dev
```
Visit `http://localhost:3000` to view the application.

---

## 2. Production Deployment

### 2.1 Next.js Frontend (Vercel)
LegalLens AI is optimized for Vercel.
1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Add the environment variables from your `.env.local`.
4. Click **Deploy**.

### 2.2 Agent Runtime (Google Cloud Run)
The AI Agent is designed to run asynchronously on Google Cloud Agent Runtime.
1. Ensure Docker is running.
2. Build and push the image:
```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/legallens-agent
```
3. Deploy to Cloud Run:
```bash
gcloud run deploy legallens-agent \
  --image gcr.io/[PROJECT_ID]/legallens-agent \
  --platform managed \
  --set-env-vars="GEMINI_API_KEY=your-key"
```
4. Update your Next.js `.env.production` to point the Agent API calls to this new Cloud Run endpoint.
