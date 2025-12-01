import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Calendar, Clock, Award, Settings, LogOut, Plus, Edit, Trash2, Search, Download, FileText } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Mock API functions (replace with actual API calls later)
const mockAPI = {
  login: async (username, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (username === 'admin' && password === 'admin') return { token: 'admin-token', role: 'DBA' };
    if (username === 'manager' && password === 'manager') return { token: 'manager-token', role: 'Manager' };
    if (username === 'member' && password === 'member') return { token: 'member-token', role: 'Member' };
    throw new Error('Invalid credentials');
  },
  getDashboardMetrics: async (role) => {
    return {
      totalOrganizations: 12,
      activeEvents: 8,
      totalServiceHours: 1240,
      activeMembers: 156
    };
  },
  getOrganizations: async () => {
    return [
      { id: 1, name: 'Computer Science Club', category: 'Academic', members: 45, active: true },
      { id: 2, name: 'Student Government', category: 'Leadership', members: 30, active: true },
      { id: 3, name: 'Engineering Society', category: 'Academic', members: 38, active: true }
    ];
  },
  getMembers: async () => {
    return [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@hbcu.edu', major: 'Computer Science', year: 'Junior' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@hbcu.edu', major: 'Engineering', year: 'Senior' },
      { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.j@hbcu.edu', major: 'Business', year: 'Sophomore' }
    ];
  },
  getEvents: async () => {
    return [
      { id: 1, name: 'Community Cleanup', date: '2024-12-15', organization: 'Computer Science Club', type: 'Service', attendees: 25 },
      { id: 2, name: 'Tech Workshop', date: '2024-12-20', organization: 'Engineering Society', type: 'Educational', attendees: 40 },
      { id: 3, name: 'Fundraiser Gala', date: '2025-01-10', organization: 'Student Government', type: 'Fundraising', attendees: 100 }
    ];
  },
  getServiceHours: async () => {
    return [
      { id: 1, member: 'John Doe', event: 'Community Cleanup', hours: 4, date: '2024-12-15', status: 'Approved' },
      { id: 2, member: 'Jane Smith', event: 'Tech Workshop', hours: 3, date: '2024-12-20', status: 'Pending' },
      { id: 3, member: 'Mike Johnson', event: 'Community Cleanup', hours: 4, date: '2024-12-15', status: 'Approved' }
    ];
  },
  getAnalytics: async (type) => {
    if (type === 'hours') {
      return [
        { name: 'John Doe', hours: 24 },
        { name: 'Jane Smith', hours: 18 },
        { name: 'Mike Johnson', hours: 15 },
        { name: 'Sarah Wilson', hours: 21 }
      ];
    }
    if (type === 'organizations') {
      return [
        { name: 'CS Club', value: 45 },
        { name: 'Student Gov', value: 30 },
        { name: 'Engineering', value: 38 }
      ];
    }
    return [];
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');

  // Login Component
  const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
      try {
        const result = await mockAPI.login(username, password);
        setUser(result);
        loadDashboardData(result.role);
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">HBCU Tracker</h1>
            <p className="text-gray-600">Student Organization Management System</p>
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Sign In
            </button>
          </div>
          <div className="mt-6 text-sm text-gray-600">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Admin: admin/admin</p>
            <p>Manager: manager/manager</p>
            <p>Member: member/member</p>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [analytics, setAnalytics] = useState({ hours: [], orgs: [] });

    useEffect(() => {
      loadDashboardData(user.role);
    }, []);

    const loadDashboardData = async (role) => {
      const m = await mockAPI.getDashboardMetrics(role);
      const hours = await mockAPI.getAnalytics('hours');
      const orgs = await mockAPI.getAnalytics('organizations');
      setMetrics(m);
      setAnalytics({ hours, orgs });
    };

    if (!metrics) return <div className="p-8">Loading...</div>;

    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard icon={<Users />} title="Total Organizations" value={metrics.totalOrganizations} color="bg-blue-500" />
          <MetricCard icon={<Calendar />} title="Active Events" value={metrics.activeEvents} color="bg-green-500" />
          <MetricCard icon={<Clock />} title="Service Hours" value={metrics.totalServiceHours} color="bg-purple-500" />
          <MetricCard icon={<Award />} title="Active Members" value={metrics.activeMembers} color="bg-orange-500" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Service Hours by Member</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.hours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Organization Membership</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={analytics.orgs} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {analytics.orgs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        {user.role !== 'Member' && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionButton onClick={() => { setCurrentView('organizations'); setModalMode('create'); setShowModal(true); }} label="Add Organization" />
              <QuickActionButton onClick={() => { setCurrentView('events'); setModalMode('create'); setShowModal(true); }} label="Create Event" />
              <QuickActionButton onClick={() => { setCurrentView('members'); setModalMode('create'); setShowModal(true); }} label="Add Member" />
              <QuickActionButton onClick={() => setCurrentView('reports')} label="Generate Report" />
            </div>
          </div>
        )}
      </div>
    );
  };

  // CRUD Views
  const CRUDView = ({ entity }) => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
      loadData();
    }, [entity]);

    useEffect(() => {
      if (searchTerm) {
        const filtered = items.filter(item => 
          JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
      } else {
        setFilteredItems(items);
      }
    }, [searchTerm, items]);

    const loadData = async () => {
      setLoading(true);
      let result = [];
      switch (entity) {
        case 'organizations': result = await mockAPI.getOrganizations(); break;
        case 'members': result = await mockAPI.getMembers(); break;
        case 'events': result = await mockAPI.getEvents(); break;
        case 'servicehours': result = await mockAPI.getServiceHours(); break;
      }
      setItems(result);
      setFilteredItems(result);
      setLoading(false);
    };

    const handleEdit = (item) => {
      setSelectedItem(item);
      setModalMode('edit');
      setShowModal(true);
    };

    const handleDelete = (item) => {
      if (window.confirm(`Are you sure you want to delete this ${entity.slice(0, -1)}?`)) {
        const updated = items.filter(i => i.id !== item.id);
        setItems(updated);
      }
    };

    const canCreate = user.role === 'DBA' || (user.role === 'Manager' && entity !== 'organizations');
    const canEdit = user.role !== 'Member';
    const canDelete = user.role !== 'Member';

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 capitalize">{entity}</h2>
          {canCreate && (
            <button
              onClick={() => { setSelectedItem(null); setModalMode('create'); setShowModal(true); }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} /> Add New
            </button>
          )}
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <DataTable 
              items={filteredItems} 
              entity={entity} 
              onEdit={canEdit ? handleEdit : null}
              onDelete={canDelete ? handleDelete : null}
            />
          )}
        </div>
      </div>
    );
  };

  // Reports View
  const ReportsView = () => {
    const [reportType, setReportType] = useState('members');
    const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateFakeReport = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let data = {};
      
      if (reportType === 'members') {
        data = {
          title: 'Member Participation Summary',
          summary: 'This report shows individual member engagement and service hour contributions.',
          details: [
            { member: 'John Doe', organization: 'Computer Science Club', events: 8, hours: 24, status: 'Active' },
            { member: 'Jane Smith', organization: 'Engineering Society', events: 6, hours: 18, status: 'Active' },
            { member: 'Mike Johnson', organization: 'Student Government', events: 5, hours: 15, status: 'Active' },
            { member: 'Sarah Wilson', organization: 'Computer Science Club', events: 7, hours: 21, status: 'Active' },
            { member: 'David Lee', organization: 'Engineering Society', events: 4, hours: 12, status: 'Inactive' }
          ],
          totals: { totalMembers: 5, totalEvents: 30, totalHours: 90, avgHours: 18 }
        };
      } else if (reportType === 'organizations') {
        data = {
          title: 'Service Hours by Organization',
          summary: 'Breakdown of service hours contributed by each organization.',
          details: [
            { organization: 'Computer Science Club', members: 45, events: 12, hours: 180, avgPerMember: 4.0 },
            { organization: 'Engineering Society', members: 38, events: 10, hours: 152, avgPerMember: 4.0 },
            { organization: 'Student Government', members: 30, events: 8, hours: 120, avgPerMember: 4.0 },
            { organization: 'Business Club', members: 25, events: 6, hours: 90, avgPerMember: 3.6 }
          ],
          totals: { totalOrgs: 4, totalMembers: 138, totalHours: 542, avgHoursPerOrg: 135.5 }
        };
      } else if (reportType === 'events') {
        data = {
          title: 'Event Attendance Report',
          summary: 'Detailed attendance and impact metrics for all events.',
          details: [
            { event: 'Community Cleanup', date: '2024-12-15', organization: 'CS Club', attendees: 25, hours: 100, type: 'Service' },
            { event: 'Tech Workshop', date: '2024-12-20', organization: 'Engineering', attendees: 40, hours: 120, type: 'Educational' },
            { event: 'Fundraiser Gala', date: '2025-01-10', organization: 'Student Gov', attendees: 100, hours: 200, type: 'Fundraising' },
            { event: 'Career Fair', date: '2024-11-05', organization: 'Business Club', attendees: 75, hours: 150, type: 'Professional' },
            { event: 'Coding Competition', date: '2024-10-12', organization: 'CS Club', attendees: 30, hours: 90, type: 'Academic' }
          ],
          totals: { totalEvents: 5, totalAttendees: 270, totalHours: 660, avgAttendance: 54 }
        };
      } else {
        data = {
          title: 'Semester Engagement Overview',
          summary: 'Comprehensive overview of all activities for Fall 2024 semester.',
          details: [
            { month: 'August', events: 4, attendees: 120, hours: 180, newMembers: 25 },
            { month: 'September', events: 6, attendees: 180, hours: 270, newMembers: 15 },
            { month: 'October', events: 8, attendees: 240, hours: 360, newMembers: 10 },
            { month: 'November', events: 7, attendees: 210, hours: 315, newMembers: 8 },
            { month: 'December', events: 5, attendees: 150, hours: 225, newMembers: 5 }
          ],
          totals: { totalEvents: 30, totalAttendees: 900, totalHours: 1350, totalNewMembers: 63 }
        };
      }
      
      setReportData(data);
      setLoading(false);
    };

    const exportPDF = () => {
      alert('Exporting report as PDF...\n\nIn a real implementation, this would generate a formatted PDF document.');
    };

    const exportCSV = () => {
      if (!reportData) return;
      
      const headers = Object.keys(reportData.details[0]).join(',');
      const rows = reportData.details.map(row => Object.values(row).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Report Generation</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="members">Member Participation</option>
                <option value="organizations">Service Hours by Organization</option>
                <option value="events">Event Attendance</option>
                <option value="semester">Semester Overview</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={generateFakeReport}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText size={20} /> {loading ? 'Generating...' : 'Generate Report'}
            </button>
            <button
              onClick={exportPDF}
              disabled={!reportData}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} /> Export PDF
            </button>
            <button
              onClick={exportCSV}
              disabled={!reportData}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} /> Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Report Preview</h3>
          
          {!reportData ? (
            <p className="text-gray-600">Select report parameters and click "Generate Report" to preview.</p>
          ) : (
            <div>
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">{reportData.title}</h4>
                <p className="text-gray-600 mb-2">{reportData.summary}</p>
                <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()} | Period: {dateRange.start} to {dateRange.end}</p>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(reportData.details[0]).map(key => (
                        <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.details.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h5 className="font-semibold text-gray-800 mb-3">Summary Statistics</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(reportData.totals).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-gray-600">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-2xl font-bold text-blue-600">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper Components
  const MetricCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickActionButton = ({ onClick, label }) => (
    <button
      onClick={onClick}
      className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors font-medium"
    >
      {label}
    </button>
  );

  const DataTable = ({ items, entity, onEdit, onDelete }) => {
    if (items.length === 0) return <div className="p-8 text-center text-gray-600">No data found</div>;

    const columns = Object.keys(items[0]);

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {String(item[col])}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {onEdit && (
                      <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const Sidebar = () => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <Award />, roles: ['Member', 'Manager', 'DBA'] },
      { id: 'organizations', label: 'Organizations', icon: <Users />, roles: ['Member', 'Manager', 'DBA'] },
      { id: 'members', label: 'Members', icon: <Users />, roles: ['Manager', 'DBA'] },
      { id: 'events', label: 'Events', icon: <Calendar />, roles: ['Member', 'Manager', 'DBA'] },
      { id: 'servicehours', label: 'Service Hours', icon: <Clock />, roles: ['Member', 'Manager', 'DBA'] },
      { id: 'reports', label: 'Reports', icon: <FileText />, roles: ['Manager', 'DBA'] },
      { id: 'settings', label: 'Settings', icon: <Settings />, roles: ['DBA'] },
    ];

    return (
      <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
        <div className="mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">HBCU Tracker</h1>
          <p className="text-sm text-gray-400 mt-1">{user.role}</p>
        </div>

        <nav>
          {menuItems.filter(item => item.roles.includes(user.role)).map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                currentView === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={() => setUser(null)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mt-8 hover:bg-red-600 transition-colors"
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    );
  };

  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold">
              {modalMode === 'create' ? 'Add New' : 'Edit'} {currentView.slice(0, -1)}
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">Form fields would go here based on the entity type.</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`${modalMode === 'create' ? 'Creating' : 'Updating'} ${currentView.slice(0, -1)}`);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {modalMode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const loadDashboardData = async (role) => {
    // Initial data load
  };

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'organizations' && <CRUDView entity="organizations" />}
        {currentView === 'members' && <CRUDView entity="members" />}
        {currentView === 'events' && <CRUDView entity="events" />}
        {currentView === 'servicehours' && <CRUDView entity="servicehours" />}
        {currentView === 'reports' && <ReportsView />}
        {currentView === 'settings' && (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800">System Settings</h2>
            <p className="text-gray-600 mt-4">Database administration and user management controls.</p>
          </div>
        )}
      </div>
      <Modal />
    </div>
  );
}

export default App;