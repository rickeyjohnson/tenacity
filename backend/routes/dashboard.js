import express from "express";
import pool from "../db.js";

const router = express.Router();

/* ------------------------- GLOBAL DASHBOARD METRICS ------------------------ */
router.get("/metrics", async (req, res) => {
  try {
    const orgCount = await pool.query(`SELECT COUNT(*) FROM Organization`);
    const eventCount = await pool.query(`
      SELECT COUNT(*) 
      FROM Event 
      WHERE event_date >= CURRENT_DATE
    `);
    const totalHours = await pool.query(`
      SELECT COALESCE(SUM(hours), 0) AS total
      FROM ServiceHour
    `);

    res.json({
      totalOrganizations: orgCount.rows[0].count,
      activeEvents: eventCount.rows[0].count,
      totalServiceHours: totalHours.rows[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard metrics error" });
  }
});

/* ----------------------------- UPCOMING EVENTS ----------------------------- */
router.get("/events/upcoming", async (req, res) => {
  try {
    const upcoming = await pool.query(`
      SELECT
        e.event_id,
        e.event_name,
        e.event_date,
        e.location,
        o.org_name,
        o.category
      FROM Event e
      JOIN Organization o ON e.org_id = o.org_id
      WHERE e.event_date >= CURRENT_DATE
      ORDER BY e.event_date
    `);

    res.json(upcoming.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to get upcoming events" });
  }
});

/* ------------------------- UNLOGGED PAST EVENTS ---------------------------- */
router.get("/events/unlogged", async (req, res) => {
  try {
    const missingHours = await pool.query(`
      SELECT
        e.event_id,
        e.event_name,
        e.event_date,
        e.location,
        o.org_name
      FROM Event e
      JOIN Organization o ON e.org_id = o.org_id
      WHERE e.event_date < CURRENT_DATE
        AND NOT EXISTS (
          SELECT 1
          FROM ServiceHour sh
          WHERE sh.event_id = e.event_id
        )
      ORDER BY e.event_date;
    `);

    res.json(missingHours.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch unlogged events" });
  }
});

/* ---------------------------- MEMBER HOURS PAGE --------------------------- */
router.get("/members/:id/hours", async (req, res) => {
  const { id } = req.params;

  try {
    const hours = await pool.query(`
      SELECT
        o.org_name,
        SUM(sh.hours) AS total_hours_for_org
      FROM Membership m
      JOIN Organization o ON m.org_id = o.org_id
      JOIN ServiceHour sh ON o.org_id = sh.org_id
      WHERE m.student_id = $1
      GROUP BY o.org_name
    `, [id]);

    res.json(hours.rows);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch service hours" });
  }
});

/* ------------------------------ ORG RANKINGS ------------------------------- */
router.get("/orgs/ranking", async (_req, res) => {
  try {
    const ranking = await pool.query(`
      SELECT
        o.org_id,
        o.org_name,
        SUM(sh.hours) AS total_service_hours,
        COUNT(sh.hour_id) AS num_hour_entries
      FROM Organization o
      LEFT JOIN ServiceHour sh ON o.org_id = sh.org_id
      GROUP BY o.org_id, o.org_name
      ORDER BY total_service_hours DESC
    `);

    res.json(ranking.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch org rankings" });
  }
});

export default router;
