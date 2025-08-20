// server/index.js - minimal API with SQLite or JSON fallback
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

let db = null;
let mode = 'sqlite';
try {
  const Database = require('better-sqlite3');
  db = new Database(path.join(__dirname, 'beep.sqlite'));
  db.exec(`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    event_code TEXT,
    answers TEXT NOT NULL
  )`);
} catch (err) {
  mode = 'json';
  console.warn('better-sqlite3 not available, falling back to JSON file store');
}

const jsonPath = path.join(__dirname, 'beep.json');
function readJson() {
  try { return JSON.parse(fs.readFileSync(jsonPath, 'utf8')); } catch { return []; }
}
function writeJson(rows) {
  fs.writeFileSync(jsonPath, JSON.stringify(rows));
}

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/sessions/upsert', (req, res) => {
  const { token, eventCode, answers } = req.body || {};
  if (!token || !answers) return res.status(400).json({ error: 'token and answers are required' });
  if (mode === 'sqlite') {
    const stmt = db.prepare(`
      INSERT INTO sessions (token, event_code, answers)
      VALUES (?, ?, ?)
      ON CONFLICT(token) DO UPDATE SET event_code=excluded.event_code, answers=excluded.answers
    `);
    stmt.run(token, eventCode ?? null, JSON.stringify(answers));
  } else {
    const rows = readJson().filter(r => r.token !== token);
    rows.push({ token, event_code: eventCode ?? null, answers: JSON.stringify(answers) });
    writeJson(rows);
  }
  res.json({ ok: true });
});

app.get('/api/sessions/:token', (req, res) => {
  let row;
  if (mode === 'sqlite') {
    row = db.prepare('SELECT answers FROM sessions WHERE token = ?').get(req.params.token);
  } else {
    row = readJson().find(r => r.token === req.params.token);
  }
  if (!row) return res.json(null);
  res.json({ answers: JSON.parse(row.answers) });
});

app.get('/api/stats', (_req, res) => {
  const rows = mode === 'sqlite' ? db.prepare('SELECT answers FROM sessions').all() : readJson();
  res.json({ participants: rows.length, avgScore: 0, colors: { green: 0, yellow: 0, red: 0 }});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Beep API (${mode}) running on http://localhost:${PORT}`));
