import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceAPI, payrollAPI, leaveAPI } from '../services/api';

const cardStyle = {
  background: '#fff', padding: '1.5rem', borderRadius: 12, border: '1px solid #eee', flex: 1, minWidth: 180,
};

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const emp = user?.employee;
  const [attendance, setAttendance] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (!emp?._id) return;
    attendanceAPI.getAll({ employeeId: emp._id }).then(({ data }) => setAttendance(data)).catch(() => {});
    payrollAPI.getAll({ employeeId: emp._id }).then(({ data }) => setPayrolls(data)).catch(() => {});
    leaveAPI.getAll({ employeeId: emp._id }).then(({ data }) => setLeaves(data)).catch(() => {});
  }, [emp]);

  if (!emp) return <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading...</div>;

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const lastPayroll = payrolls[payrolls.length - 1];
  const pendingLeaves = leaves.filter((l) => l.status === 'pending').length;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Welcome, {emp.firstName}!</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>{emp.department} · {emp.position} · {emp.employeeId}</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>Attendance (Total)</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a237e' }}>{attendance.length}</h3>
        </div>
        <div style={cardStyle}>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>Present Days</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2e7d32' }}>{presentCount}</h3>
        </div>
        <div style={cardStyle}>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>Pending Leaves</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#e65100' }}>{pendingLeaves}</h3>
        </div>
        <div style={cardStyle}>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>Last Salary</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1565c0' }}>₹{lastPayroll?.netSalary?.toLocaleString() || '0'}</h3>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Attendance</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={thStyle}>Date</th><th style={thStyle}>Status</th></tr>
            </thead>
            <tbody>
              {attendance.slice(-5).reverse().map((a, i) => (
                <tr key={a._id} style={{ background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                  <td style={tdStyle}>{new Date(a.date).toLocaleDateString()}</td>
                  <td style={tdStyle}><span style={statusBadge(a.status)}>{a.status}</span></td>
                </tr>
              ))}
              {attendance.length === 0 && <tr><td colSpan={2} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>No attendance records</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Leave Status</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={thStyle}>Type</th><th style={thStyle}>Dates</th><th style={thStyle}>Status</th></tr>
            </thead>
            <tbody>
              {leaves.slice(-5).reverse().map((l, i) => (
                <tr key={l._id} style={{ background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                  <td style={tdStyle}>{l.leaveType}</td>
                  <td style={tdStyle}>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</td>
                  <td style={tdStyle}><span style={statusBadge(l.status)}>{l.status}</span></td>
                </tr>
              ))}
              {leaves.length === 0 && <tr><td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>No leave records</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const thStyle = { padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #eee', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' };
const tdStyle = { padding: '0.75rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.85rem' };
const statusBadge = (s) => ({
  display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500,
  background: s === 'present' || s === 'approved' ? '#e8f5e9' : s === 'pending' ? '#fff3e0' : s === 'absent' || s === 'rejected' ? '#ffebee' : s === 'leave' ? '#e3f2fd' : '#f3e5f5',
  color: s === 'present' || s === 'approved' ? '#2e7d32' : s === 'pending' ? '#e65100' : s === 'absent' || s === 'rejected' ? '#c62828' : s === 'leave' ? '#1565c0' : '#6a1b9a',
});

export default EmployeeDashboard;
