import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, background: '#1a237e', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>P</div>
          <h2 style={{ color: '#1a1a2e', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Payroll Management</h2>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.3rem' }}>Sign in to your account</p>
        </div>
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 500, color: '#555' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.95rem', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 500, color: '#555' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.95rem', outline: 'none' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '0.8rem', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
