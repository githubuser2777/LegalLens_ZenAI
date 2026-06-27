git add -u src/components/ui/ docs/ agent/ phase.md src/styles/ test_ai_validator.ts supabase_setup.sql
git commit -m "refactor: ponytail audit, remove bloat and old drafts"

git add agent/contract_auditor_agent/
git commit -m "feat(agent): implement Python ADK backend with Gemini SDK"

git add CONTEXT.md SECURITY.md .github/workflows/ supabase/migrations/003_auto_delete_contracts.sql
git commit -m "feat(security): add prompt injection defense, auto-delete cronjob, and CI tests"

git add src/components/ src/app/ src/styles/theme.css package.json package-lock.json
git commit -m "feat(ui): implement Vibecode SSE streaming and minimalist UI"

git add docs/ README.md LICENSE .eslintignore
git commit -m "docs: finalize Kaggle Capstone documentation and deployment guide"

git add .
git commit -m "chore: final adjustments for Kaggle Capstone"
