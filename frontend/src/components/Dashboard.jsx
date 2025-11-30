import { useEffect, useState } from "react";

export default function Dashboard({ role, user }) {
  const [metrics, setMetrics] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [memberHours, setMemberHours] = useState([]);
  const [orgRanking, setOrgRanking] = useState([]);

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then(res => res.json())
      .then(setMetrics);

    fetch("/api/dashboard/events/upcoming")
      .then(res => res.json())
      .then(setUpcoming);

    if (role === "member") {
      fetch(`/api/dashboard/members/${user.student_id}/hours`)
        .then(res => res.json())
        .then(setMemberHours);
    }

    if (role === "dba") {
      fetch("/api/dashboard/orgs/ranking")
        .then(res => res.json())
        .then(setOrgRanking);
    }
  }, []);

  if (!metrics) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* -------------------- METRICS PANEL -------------------- */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-blue-100 rounded shadow">
          <h2>Total Organizations</h2>
          <p className="text-2xl">{metrics.totalOrganizations}</p>
        </div>

        <div className="p-4 bg-green-100 rounded shadow">
          <h2>Active Events</h2>
          <p className="text-2xl">{metrics.activeEvents}</p>
        </div>

        <div className="p-4 bg-purple-100 rounded shadow">
          <h2>Total Service Hours</h2>
          <p className="text-2xl">{metrics.totalServiceHours}</p>
        </div>
      </div>

      {/* -------------------- MEMBER DASHBOARD -------------------- */}
      {role === "member" && (
        <>
          <h2 className="text-xl font-semibold mt-8">Your Service Hours</h2>
          <ul className="mt-2">
            {memberHours.map(h => (
              <li key={h.org_name}>
                {h.org_name}: {h.total_hours_for_org} hrs
              </li>
            ))}
          </ul>
        </>
      )}

      {/* -------------------- MANAGER DASHBOARD -------------------- */}
      {role === "manager" && (
        <>
          <h2 className="text-xl font-semibold mt-8">Manager Tools</h2>
          <p>• Approve service hours</p>
          <p>• View roster</p>
          <p>• Attendance summaries</p>
        </>
      )}

      {/* -------------------- DBA DASHBOARD -------------------- */}
      {role === "dba" && (
        <>
          <h2 className="text-xl font-semibold mt-8">Organization Rankings</h2>
          <ul className="mt-2">
            {orgRanking.map(o => (
              <li key={o.org_id}>
                {o.org_name} — {o.total_service_hours} hrs
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-8">DBA Tools</h2>
          <p>• Manage Users</p>
          <p>• Trigger Snapshots</p>
          <p>• View DB Health</p>
        </>
      )}

      {/* -------------------- UPCOMING EVENTS (All Roles) -------------------- */}
      <h2 className="text-xl font-semibold mt-8">Upcoming Events</h2>
      <ul className="mt-2">
        {upcoming.map(ev => (
          <li key={ev.event_id}>
            {ev.event_name} — {ev.event_date} ({ev.org_name})
          </li>
        ))}
      </ul>
    </div>
  );
}
