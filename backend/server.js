const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const app = express();
let dashboardRoutes = require("./routes/dashboard.js");
if (dashboardRoutes && dashboardRoutes.default) dashboardRoutes = dashboardRoutes.default;
app.use(cors());
app.use(bodyParser.json());

app.use("/dashboard", dashboardRoutes);

// Simple auth (demo only)
const JWT_SECRET = 'supersecretstring';

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // demo: accept any password; in real app verify hashed password
  try {
    const user = { id: 1, email };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET top volunteers
app.get('/api/dashboard/top-volunteers', async (req, res) => {
  try {
    const q = `
      SELECT s.student_id, s.first_name, s.last_name, SUM(sh.hours) AS total_service_hours
      FROM Student s
      JOIN Membership m ON s.student_id = m.student_id
      JOIN Organization o ON m.org_id = o.org_id
      JOIN Event e ON o.org_id = e.org_id
      JOIN ServiceHour sh ON e.event_id = sh.event_id
      GROUP BY s.student_id, s.first_name, s.last_name
      ORDER BY total_service_hours DESC
      LIMIT 10;
    `;
    const result = await pool.query(q);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET most active org
app.get('/api/dashboard/most-active-org', async (req, res) => {
  try {
    const q = `
      SELECT o.org_id, o.org_name, SUM(sh.hours) AS total_org_hours
      FROM Organization o
      JOIN Event e ON o.org_id = e.org_id
      JOIN ServiceHour sh ON e.event_id = sh.event_id
      GROUP BY o.org_id, o.org_name
      ORDER BY total_org_hours DESC
      LIMIT 1;
    `;
    const result = await pool.query(q);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CRUD Organizations
app.get('/api/organizations', async (req, res) => {
  const result = await pool.query('SELECT * FROM Organization ORDER BY org_name');
  res.json(result.rows);
});
app.post('/api/organizations', async (req, res) => {
  const { org_name, category } = req.body;
  const result = await pool.query('INSERT INTO Organization(org_name, category) VALUES($1,$2) RETURNING *', [org_name, category]);
  res.json(result.rows[0]);
});
app.delete('/api/organizations/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM Organization WHERE org_id = $1', [id]);
  res.json({ success: true });
});

// Snapshot creation endpoint
app.post('/api/reports/snapshot', async (req, res) => {
  const { semester, year } = req.body;
  try {
    const q = `
      INSERT INTO SemesterEngagementSnapshot (semester, year, org_id, total_events, total_service_hours, total_members)
      SELECT $1 as semester, $2 as year, o.org_id,
        COUNT(DISTINCT e.event_id) as total_events,
        COALESCE(SUM(sh.hours),0) as total_service_hours,
        COUNT(DISTINCT m.student_id) as total_members
      FROM Organization o
      LEFT JOIN Event e ON o.org_id = e.org_id
      LEFT JOIN ServiceHour sh ON e.event_id = sh.event_id
      LEFT JOIN Membership m ON o.org_id = m.org_id
      GROUP BY o.org_id;
    `;
    await pool.query(q, [semester, year]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('Server running on', port));