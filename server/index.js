// server/index.js - minimal, reliable API using SQLite
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const db = new Database('./beep.sqlite');
db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  event_code TEXT,
  answers TEXT NOT NULL
)`);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/sessions/upsert', (req, res) => {
  const { token, eventCode, answers } = req.body || {};
  if (!token || !answers) return res.status(400).json({ error: 'token and answers are required' });
  const stmt = db.prepare(`
    INSERT INTO sessions (token, event_code, answers)
    VALUES (?, ?, ?)
    ON CONFLICT(token) DO UPDATE SET event_code=excluded.event_code, answers=excluded.answers
  `);
  stmt.run(token, eventCode ?? null, JSON.stringify(answers));
  res.json({ ok: true });
});

app.get('/api/sessions/:token', (req, res) => {
  const row = db.prepare('SELECT answers FROM sessions WHERE token = ?').get(req.params.token);
  if (!row) return res.json(null);
  res.json({ answers: JSON.parse(row.answers) });
});

app.get('/api/stats', (_req, res) => {
  const rows = db.prepare('SELECT answers FROM sessions').all();
  // Frontend computes more detailed stats; keep API simple for now
  res.json({ participants: rows.length, avgScore: 0, colors: { green: 0, yellow: 0, red: 0 }});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Beep API running on http://localhost:${PORT}`));
