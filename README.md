# PR Review System

A simple full-stack PR review app with Express backend and HTML/CSS/JS frontend.

## 📁 Structure
```
pr-review-system/
├── backend/
│   ├── server.js        ← Express API
│   └── package.json
├── frontend/
│   ├── index.html       ← Main UI
│   ├── css/style.css    ← Styles
│   └── js/app.js        ← API calls & logic
├── git-setup.sh         ← Run once to create all branches
└── README.md
```

## 🚀 Run Locally

### 1. Start Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:3000
```

### 2. Open Frontend
```bash
# Simply open in browser:
open frontend/index.html
# OR use Live Server in VS Code
```

## 🌿 Git Branch Setup

### Step 1 — Initialize with your repo
```bash
git init
git remote add origin https://github.com/Premkumar9799817360/PR_testing_repo.git
```

### Step 2 — Create main branch & push everything
```bash
git checkout -b main
git add .
git commit -m "chore: initial project structure"
git push -u origin main
```

### Step 3 — Create backend branch
```bash
git checkout -b backend
git add backend/
git commit -m "feat(backend): add Express API with PR endpoints"
git push -u origin backend
```

### Step 4 — Create frontend branch
```bash
git checkout -b frontend
git add frontend/
git commit -m "feat(frontend): add HTML/CSS/JS PR review UI"
git push -u origin frontend
```

### Step 5 — Create testing branch
```bash
git checkout -b testing
# make a small change, e.g. add health check
git add .
git commit -m "test: add health check and CI setup"
git push -u origin testing
```

### Step 6 — Switch between branches
```bash
git checkout main        # go to main
git checkout backend     # go to backend
git checkout frontend    # go to frontend
git checkout testing     # go to testing
```

### Step 7 — Create PR on GitHub
1. Go to: https://github.com/Premkumar9799817360/PR_testing_repo
2. Click **"Pull Requests"** → **"New Pull Request"**
3. Set: **base: main** ← **compare: backend** (or frontend/testing)
4. Click **"Create Pull Request"** ✅

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/prs | List all PRs |
| GET | /api/prs/:id | Get single PR |
| POST | /api/prs | Create new PR |
| PATCH | /api/prs/:id/status | Update status |
| POST | /api/prs/:id/comments | Add comment |
| GET | /api/health | Health check |
