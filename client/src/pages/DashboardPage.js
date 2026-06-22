import React, { useState, useEffect } from 'react';
import { payrollAPI, attendanceAPI, employeeAPI } from '../services/api';

const cardStyle = {
  background: '#fff', padding: '1.5rem', borderRadius: 12, border: '1px solid #eee',
  flex: 1, minWidth: 180,
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [onLeave, setOnLeave] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    payrollAPI.getDashboard()
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));

    const today = new Date().toISOString().split('T')[0];
    attendanceAPI.getAll({ date: today, status: 'leave' }).then(({ data }) => {
      setOnLeave(data);
    }).catch(() => {});
  }, []);

  if (error) return <div style={{ padding: '2rem', color: '#c62828' }}>Error: {error}</div>;
  if (!stats) return <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading dashboard...</div>;

  const cards = [
    { label: 'Total Employees', value: stats.totalEmployees, color: '#1a237e' },
    { label: 'Present Today', value: stats.totalPresentToday, color: '#2e7d32' },
    { label: 'Monthly Payroll', value: `₹${(stats.monthlyPayrollTotal || 0).toLocaleString()}`, color: '#1565c0' },
  ];

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Dashboard</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {cards.map((c, i) => (
          <div key={i} style={cardStyle}>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.3rem' }}>{c.label}</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: c.color }}>{c.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Payrolls</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Employee</th>
                <th style={thStyle}>Period</th>
                <th style={thStyle}>Net Salary</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPayrolls?.length === 0 && (
                <tr><td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>No payroll records yet</td></tr>
              )}
              {stats.recentPayrolls?.map((p, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                  <td style={tdStyle}>{p.employee?.firstName || 'Unknown'} {p.employee?.lastName || ''}</td>
                  <td style={tdStyle}>{p.month} {p.year}</td>
                  <td style={tdStyle}>₹{p.netSalary?.toLocaleString()}</td>
                  <td style={tdStyle}><span style={statusStyle(p.status)}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ width: 280, background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: '1.5rem', alignSelf: 'start' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>On Leave Today</h3>
          {onLeave.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.85rem' }}>No employees on leave</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {onLeave.map((a) => (
                <div key={a._id} style={{ padding: '0.5rem 0.7rem', background: '#e3f2fd', borderRadius: 8, fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 500 }}>{a.employee?.firstName || 'Unknown'} {a.employee?.lastName || ''}</span>
                  <span style={{ color: '#555', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>
                    {new Date(a.date).toLocaleDateString()} · {a.checkIn || 'Full Day'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const thStyle = { padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #eee', fontSize: '0.8rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' };
const tdStyle = { padding: '0.75rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' };
const statusStyle = (s) => ({
  display: 'inline-block', padding: '0.2rem 0.7rem', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500,
  background: s === 'paid' ? '#e8f5e9' : s === 'processed' ? '#e3f2fd' : '#fff3e0',
  color: s === 'paid' ? '#2e7d32' : s === 'processed' ? '#1565c0' : '#e65100',
});

export default DashboardPage;
