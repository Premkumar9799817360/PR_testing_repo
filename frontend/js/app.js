const API = 'http://localhost:3000/api';
let activePRId = null;

async function checkAPI() {
  try {
    await fetch(`${API}/prs`);
    document.getElementById('api-status').className = 'status-dot online';
    document.getElementById('api-status').textContent = '● API Online';
  } catch {
    document.getElementById('api-status').className = 'status-dot offline';
    document.getElementById('api-status').textContent = '● API Offline';
  }
}

async function loadPRs() {
  const list = document.getElementById('pr-list');
  list.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const res = await fetch(`${API}/prs`);
    const { data } = await res.json();
    if (!data.length) { list.innerHTML = '<p class="loading">No PRs yet. Create one above!</p>'; return; }
    list.innerHTML = data.map(pr => `
      <div class="pr-item" onclick="viewPR(${pr.id})">
        <div class="pr-info">
          <div class="pr-title">#${pr.id} ${pr.title}</div>
          <div class="pr-meta">branch: ${pr.branch} &nbsp;·&nbsp; by ${pr.author} &nbsp;·&nbsp; ${pr.comments.length} comment(s)</div>
        </div>
        <span class="badge ${pr.status}">${pr.status}</span>
        <div class="pr-actions" onclick="event.stopPropagation()">
          <button class="approve-btn" onclick="updateStatus(${pr.id},'approved')">✓ Approve</button>
          <button class="merge-btn"   onclick="updateStatus(${pr.id},'merged')">⤶ Merge</button>
          <button class="close-btn"   onclick="updateStatus(${pr.id},'closed')">✕ Close</button>
        </div>
      </div>`).join('');
  } catch {
    list.innerHTML = '<p class="loading" style="color:#f87171">❌ Cannot reach backend. Run: cd backend && npm start</p>';
  }
}

async function createPR() {
  const title  = document.getElementById('pr-title').value.trim();
  const branch = document.getElementById('pr-branch').value.trim();
  const author = document.getElementById('pr-author').value.trim();
  const msg    = document.getElementById('create-msg');
  if (!title || !branch || !author) { msg.className='msg error'; msg.textContent='All fields required.'; return; }
  try {
    const res = await fetch(`${API}/prs`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ title, branch, author })
    });
    const { data } = await res.json();
    msg.className = 'msg success';
    msg.textContent = `✓ PR #${data.id} created!`;
    document.getElementById('pr-title').value = '';
    document.getElementById('pr-branch').value = '';
    document.getElementById('pr-author').value = '';
    loadPRs();
  } catch { msg.className='msg error'; msg.textContent='Backend not reachable.'; }
}

async function updateStatus(id, status) {
  try {
    await fetch(`${API}/prs/${id}/status`, {
      method: 'PATCH', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ status })
    });
    loadPRs();
    if (activePRId === id) viewPR(id);
  } catch { alert('Backend not reachable.'); }
}

async function viewPR(id) {
  activePRId = id;
  document.getElementById('detail-section').style.display = 'block';
  document.getElementById('detail-section').scrollIntoView({ behavior: 'smooth' });
  try {
    const res = await fetch(`${API}/prs/${id}`);
    const { data: pr } = await res.json();
    document.getElementById('pr-detail').innerHTML = `
      <div class="detail-box">
        <h3>${pr.title}</h3>
        <div class="detail-row">
          <span class="detail-chip"><span>Branch: </span>${pr.branch}</span>
          <span class="detail-chip"><span>Author: </span>${pr.author}</span>
          <span class="badge ${pr.status}">${pr.status}</span>
        </div>
        <div class="comments-list">
          ${pr.comments.length ? pr.comments.map(c => `
            <div class="comment-item">
              <div class="comment-author">${c.author}</div>
              <div class="comment-text">${c.text}</div>
              <div class="comment-time">${new Date(c.time).toLocaleString()}</div>
            </div>`).join('') : '<p class="loading">No comments yet.</p>'}
        </div>
      </div>`;
  } catch { document.getElementById('pr-detail').innerHTML = '<p class="loading" style="color:#f87171">Error loading PR.</p>'; }
}

async function addComment() {
  const author = document.getElementById('comment-author').value.trim();
  const text   = document.getElementById('comment-text').value.trim();
  if (!author || !text || !activePRId) return;
  try {
    await fetch(`${API}/prs/${activePRId}/comments`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ author, text })
    });
    document.getElementById('comment-text').value = '';
    viewPR(activePRId);
    loadPRs();
  } catch { alert('Backend not reachable.'); }
}

function closeDetail() {
  activePRId = null;
  document.getElementById('detail-section').style.display = 'none';
}

checkAPI();
loadPRs();
setInterval(checkAPI, 5000);
