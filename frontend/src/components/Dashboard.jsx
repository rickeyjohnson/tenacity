import { useEffect, useState } from "react";

export default function Dashboard({ role, user }) {
  const [metrics, setMetrics] = useState(null);
  const [metricsError, setMetricsError] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [upcomingError, setUpcomingError] = useState(null);
  const [memberHours, setMemberHours] = useState([]);
  const [memberHoursError, setMemberHoursError] = useState(null);
  const [orgRanking, setOrgRanking] = useState([]);
  const [orgRankingError, setOrgRankingError] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch metrics");
        return res.json();
      })
      .then(setMetrics)
      .catch(err => setMetricsError(err.message));

    fetch("/api/dashboard/events/upcoming")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch upcoming events");
        return res.json();
      })
      .then(setUpcoming)
      .catch(err => setUpcomingError(err.message));

    if (role === "member" && user && user.student_id) {
      fetch(`/api/dashboard/members/${user.student_id}/hours`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch member hours");
          return res.json();
        })
        .then(setMemberHours)
        .catch(err => setMemberHoursError(err.message));
    }

    if (role === "dba") {
      fetch("/api/dashboard/orgs/ranking")
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch org ranking");
          return res.json();
        })
        .then(setOrgRanking)
        .catch(err => setOrgRankingError(err.message));
    }
  }, [role, user]);

  if (!metrics) return <p>Loading dashboard...</p>;
  if (metricsError) return <p className="text-red-500">Error: {metricsError}</p>;
  if (!metrics) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* -------------------- METRICS PANEL -------------------- */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-blue-100 rounded shadow">
          <h2>Total Organizations</h2>
          <p className="text-2xl">{metrics?.totalOrganizations ?? 0}</p>
        </div>

        <div className="p-4 bg-green-100 rounded shadow">
          <h2>Active Events</h2>
          <p className="text-2xl">{metrics?.activeEvents ?? 0}</p>
        </div>

        <div className="p-4 bg-purple-100 rounded shadow">
          <h2>Total Service Hours</h2>
          <p className="text-2xl">{metrics?.totalServiceHours ?? 0}</p>
        </div>
      </div>

      {/* -------------------- MEMBER DASHBOARD -------------------- */}
      {role === "member" && (
        <>
          <h2 className="text-xl font-semibold mt-8">Your Service Hours</h2>
          {memberHoursError && <p className="text-red-500">Error: {memberHoursError}</p>}
          <ul className="mt-2">
            {memberHours?.length > 0 ? memberHours.map(h => (
              <li key={h.org_name}>
                {h.org_name}: {h.total_hours_for_org} hrs
              </li>
            )) : <li>No service hours found.</li>}
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
          {orgRankingError && <p className="text-red-500">Error: {orgRankingError}</p>}
          <ul className="mt-2">
            {orgRanking?.length > 0 ? orgRanking.map(o => (
              <li key={o.org_id}>
                {o.org_name} — {o.total_service_hours} hrs
              </li>
            )) : <li>No rankings found.</li>}
          </ul>

          <h2 className="text-xl font-semibold mt-8">DBA Tools</h2>
          <p>• Manage Users</p>
          <p>• Trigger Snapshots</p>
          <p>• View DB Health</p>
        </>
      )}

      {/* -------------------- UPCOMING EVENTS (All Roles) -------------------- */}
      <h2 className="text-xl font-semibold mt-8">Upcoming Events</h2>
      {upcomingError && <p className="text-red-500">Error: {upcomingError}</p>}
      <ul className="mt-2">
        {upcoming?.length > 0 ? upcoming.map(ev => (
          <li key={ev.event_id}>
            {ev.event_name} — {ev.event_date} ({ev.org_name})
          </li>
        )) : <li>No upcoming events.</li>}
      </ul>
    </div>
  );
}
