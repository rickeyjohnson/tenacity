-- Views
CREATE VIEW MemberServiceSummary AS
SELECT s.student_id, s.first_name, s.last_name, SUM(sh.hours) AS total_service_hours
FROM Student s
JOIN Membership m ON s.student_id = m.student_id
JOIN Organization o ON m.org_id = o.org_id
JOIN Event e ON o.org_id = e.org_id
JOIN ServiceHour sh ON e.event_id = sh.event_id
GROUP BY s.student_id, s.first_name, s.last_name;

CREATE VIEW OrgEventActivitySummary AS
SELECT o.org_id, o.org_name, COUNT(DISTINCT e.event_id) AS total_events_hosted,
       COALESCE(SUM(sh.hours),0) AS total_service_hours
FROM Organization o
LEFT JOIN Event e ON o.org_id = e.org_id
LEFT JOIN ServiceHour sh ON e.event_id = sh.event_id
GROUP BY o.org_id, o.org_name;

-- Snapshot table
CREATE TABLE IF NOT EXISTS SemesterEngagementSnapshot (
  snapshot_id SERIAL PRIMARY KEY,
  semester VARCHAR(20),
  year INT,
  org_id INT,
  total_events INT,
  total_service_hours DECIMAL(10,2),
  total_members INT,
  date_recorded DATE DEFAULT CURRENT_DATE
);
