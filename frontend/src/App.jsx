import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Orgs from './components/Orgs';
import { AuthProvider, useAuth } from './services/auth';

function App() {
  const { user } = useAuth();
  // Infer role from user object, fallback to 'member' if not present
  const role = user?.role || 'member';
  return (
    <Router>
      <div style={{minHeight:'100vh'}}>
        <NavBar />
        <main style={{padding:24}}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequireAuth><Dashboard role={role} user={user}/></RequireAuth>} />
            <Route path="/orgs" element={<RequireAuth><Orgs/></RequireAuth>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavBar() {
  const { user, logout } = useAuth();
  return (
    <header style={{background:'#fff',boxShadow:'0 1px 2px rgba(0,0,0,0.05)'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'12px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontWeight:600}}>CampusOrg Dashboard</div>
        <nav style={{display:'flex',gap:12}}>
          <Link to='/'>Dashboard</Link>
          <Link to='/orgs'>Orgs</Link>
        </nav>
        <div>
          {user ? (
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <span>{user.email}</span>
              <button onClick={logout} className='btn'>Logout</button>
            </div>
          ) : (
            <Link to='/login' className='btn'>Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}

function RequireAuth({ children }){
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default App;
