const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const prs = [
  { id: 1, title: 'Fix login bug', branch: 'feature/login-fix', status: 'open', author: 'alice', reviewers: [], comments: [] },
  { id: 2, title: 'Add dashboard UI', branch: 'feature/dashboard', status: 'open', author: 'bob', reviewers: [], comments: [] },
  { id: 1, title: 'Fix login bug', branch: 'feature/login-fix', status: 'open', author: 'alice', reviewers: [], comments: [] },
  { id: 2, title: 'Add dashboard UI', branch: 'feature/dashboard', status: 'open', author: 'bob', reviewers: [], comments: [] },
];

// GET all PRs
app.get('/api/prs', (req, res) => {
  res.json({ success: true, data: prs });
});
let ram = 2;
// GET single PR
app.get('/api/prs/:id', (req, res) => {
  const pr = prs.find(p => p.id === parseInt(req.params.id));
  if (!pr) return res.status(404).json({ success: false, message: 'PR not found' });
  res.json({ success: true, data: pr });
});

// POST create PR
app.post('/api/prs', (req, res) => {
  const { title, branch, author } = req.body;
  if (!title || !branch || !author) {
    return res.status(400).json({ success: false, message: 'title, branch, author required' });
  }
  const newPR = { id: prs.length + 1, title, branch, author, status: 'open', reviewers: [], comments: [] };
  prs.push(newPR);
  res.status(201).json({ success: true, data: newPR });
});

// PATCH update PR status
app.patch('/api/prs/:id/status', (req, res) => {
  const pr = prs.find(p => p.id === parseInt(req.params.id));
  if (!pr) return res.status(404).json({ success: false, message: 'PR not found' });
  pr.status = req.body.status;
  res.json({ success: true, data: pr });
});

// update for PR with naem 
app.patch('/api/prs/:names/status', (req, res) => {
  const pr = prs.find(p => p.names === parseInt(req.params.names));
  if (!pr) return res.status(404).json({ success: false, message: 'PR not found' });
  pr.status = req.body.status;
  res.json({ success: true, flag:"ok", data: pr });
});

// POST add comment
app.post('/api/prs/:id/comments', (req, res) => {
  const pr = prs.find(p => p.id === parseInt(req.params.id));
  if (!pr) return res.status(404).json({ success: false, message: 'PR not found' });
  const comment = { id: Date.now(), text: req.body.text, author: req.body.author, time: new Date().toISOString() };
  pr.comments.push(comment);
  res.status(201).json({ success: true, data: comment });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));


i love to criket 
