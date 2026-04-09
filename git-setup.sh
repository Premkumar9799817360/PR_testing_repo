#!/bin/bash
# ================================================
# PR Review System - Git Branch Setup Script
# ================================================
# USAGE: Replace YOUR_REPO_URL with your GitHub repo URL

REPO_URL="https://github.com/Premkumar9799817360/PR_testing_repo.git"

echo "=== Initializing Git Repo ==="
git init
git remote add origin $REPO_URL

# ── MAIN branch ──────────────────────────────
echo "=== Setting up main branch ==="
git checkout -b main
git add .
git commit -m "chore: initial project structure - PR Review System"
git push -u origin main

# ── BACKEND branch ───────────────────────────
echo "=== Setting up backend branch ==="
git checkout -b backend
echo "# Backend Branch" >> backend/BRANCH.md
git add backend/
git commit -m "feat(backend): add Express API server with PR endpoints"
git push -u origin backend

# ── FRONTEND branch ──────────────────────────
echo "=== Setting up frontend branch ==="
git checkout -b frontend
echo "# Frontend Branch" >> frontend/BRANCH.md
git add frontend/
git commit -m "feat(frontend): add HTML/CSS/JS PR review UI"
git push -u origin frontend

# ── TESTING branch ───────────────────────────
echo "=== Setting up testing branch ==="
git checkout -b testing
cat >> backend/server.js << 'TESTEOF'

// Health check for testing
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
TESTEOF
git add .
git commit -m "test: add health check endpoint for CI/CD testing"
git push -u origin testing

# ── Back to main ─────────────────────────────
git checkout main
echo ""
echo "✅ Done! Branches created: main, backend, frontend, testing"
echo "👉 Go to GitHub > Pull Requests > New Pull Request to test PR reviews"
