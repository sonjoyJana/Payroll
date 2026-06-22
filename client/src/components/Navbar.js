import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navStyle = {
  background: '#fff',
  borderBottom: '1px solid #e0e0e0',
  padding: '0 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 64,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const linkBase = {
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: 6,
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'all 0.2s',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const isAdmin = user?.role === 'admin';

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a237e', marginRight: '1.5rem' }}>Payroll</span>
        {isAdmin ? (
          <>
            <Link to="/" style={{ ...linkBase, color: isActive('/') ? '#1a237e' : '#666', background: isActive('/') ? '#e8eaf6' : 'transparent' }}>Dashboard</Link>
            <Link to="/employees" style={{ ...linkBase, color: isActive('/employees') ? '#1a237e' : '#666', background: isActive('/employees') ? '#e8eaf6' : 'transparent' }}>Employees</Link>
            <Link to="/attendance" style={{ ...linkBase, color: isActive('/attendance') ? '#1a237e' : '#666', background: isActive('/attendance') ? '#e8eaf6' : 'transparent' }}>Attendance</Link>
            <Link to="/leaves" style={{ ...linkBase, color: isActive('/leaves') ? '#1a237e' : '#666', background: isActive('/leaves') ? '#e8eaf6' : 'transparent' }}>Leaves</Link>
            <Link to="/payroll" style={{ ...linkBase, color: isActive('/payroll') ? '#1a237e' : '#666', background: isActive('/payroll') ? '#e8eaf6' : 'transparent' }}>Payroll</Link>
          </>
        ) : (
          <>
            <Link to="/" style={{ ...linkBase, color: isActive('/') ? '#1a237e' : '#666', background: isActive('/') ? '#e8eaf6' : 'transparent' }}>My Dashboard</Link>
            <Link to="/attendance" style={{ ...linkBase, color: isActive('/attendance') ? '#1a237e' : '#666', background: isActive('/attendance') ? '#e8eaf6' : 'transparent' }}>My Attendance</Link>
            <Link to="/leaves" style={{ ...linkBase, color: isActive('/leaves') ? '#1a237e' : '#666', background: isActive('/leaves') ? '#e8eaf6' : 'transparent' }}>My Leaves</Link>
            <Link to="/payslips" style={{ ...linkBase, color: isActive('/payslips') ? '#1a237e' : '#666', background: isActive('/payslips') ? '#e8eaf6' : 'transparent' }}>My Payslips</Link>
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#888' }}>{user?.email}</span>
        <button onClick={handleLogout} style={{ background: '#fff', color: '#c62828', border: '1px solid #c62828', padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
