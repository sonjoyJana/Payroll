import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const isAdmin = user?.role === 'admin';

  const linkStyle = (path) => ({
    color: isActive(path) ? '#1a237e' : '#666',
    background: isActive(path) ? '#e8eaf6' : 'transparent',
  });

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand">Payroll</span>
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className={`nav-links${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)}>
          {isAdmin ? (
            <>
              <Link to="/" className="nav-link" style={linkStyle('/')}>Dashboard</Link>
              <Link to="/employees" className="nav-link" style={linkStyle('/employees')}>Employees</Link>
              <Link to="/attendance" className="nav-link" style={linkStyle('/attendance')}>Attendance</Link>
              <Link to="/leaves" className="nav-link" style={linkStyle('/leaves')}>Leaves</Link>
              <Link to="/payroll" className="nav-link" style={linkStyle('/payroll')}>Payroll</Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link" style={linkStyle('/')}>My Dashboard</Link>
              <Link to="/attendance" className="nav-link" style={linkStyle('/attendance')}>My Attendance</Link>
              <Link to="/leaves" className="nav-link" style={linkStyle('/leaves')}>My Leaves</Link>
              <Link to="/payslips" className="nav-link" style={linkStyle('/payslips')}>My Payslips</Link>
            </>
          )}
        </div>
      </div>
      <div className="navbar-right">
        <span className="nav-email">{user?.email}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
