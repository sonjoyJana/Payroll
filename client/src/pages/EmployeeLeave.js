import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaveAPI } from '../services/api';
import SearchableSelect from '../components/SearchableSelect';

const btn = { background: '#1a237e', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' };
const inputStyle = { display: 'block', width: '100%', padding: '0.5rem 0.8rem', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 500, color: '#555' };

const EmployeeLeave = () => {
  const { user } = useAuth();
  const emp = user?.employee;
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ leaveType: 'sick', startDate: '', endDate: '', reason: '' });

  useEffect(() => {
    if (emp?._id) leaveAPI.getAll({ employeeId: emp._id }).then(({ data }) => setLeaves(data)).catch(() => {});
  }, [emp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await leaveAPI.apply({ employee: emp._id, ...form });
    setForm({ leaveType: 'sick', startDate: '', endDate: '', reason: '' });
    leaveAPI.getAll({ employeeId: emp._id }).then(({ data }) => setLeaves(data)).catch(() => {});
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Apply Leave</h2>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div><label style={labelStyle}>Leave Type</label>
            <select value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })} style={inputStyle}>
              <option value="sick">Sick</option><option value="casual">Casual</option><option value="annual">Annual</option><option value="personal">Personal</option>
            </select>
          </div>
          <div><label style={labelStyle}>Start Date</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={inputStyle} required /></div>
          <div><label style={labelStyle}>End Date</label><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={inputStyle} required /></div>
          <div><label style={labelStyle}>Reason</label><input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} style={inputStyle} required /></div>
          <button type="submit" style={{ ...btn, alignSelf: 'end', marginTop: '1.2rem' }}>Apply</button>
        </form>
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>My Leave Requests</h3>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={thStyle}>Type</th><th style={thStyle}>Start</th><th style={thStyle}>End</th><th style={thStyle}>Reason</th><th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l, i) => (
              <tr key={l._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={tdStyle}>{l.leaveType}</td>
                <td style={tdStyle}>{new Date(l.startDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{new Date(l.endDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{l.reason}</td>
                <td style={tdStyle}><span style={statusBadge(l.status)}>{l.status}</span></td>
              </tr>
            ))}
            {leaves.length === 0 && <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>No leave requests</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle = { padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #eee' };
const tdStyle = { padding: '0.8rem 1rem', fontSize: '0.85rem', borderBottom: '1px solid #f0f0f0' };
const statusBadge = (s) => ({
  display: 'inline-block', padding: '0.2rem 0.7rem', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500,
  background: s === 'approved' ? '#e8f5e9' : s === 'rejected' ? '#ffebee' : '#fff3e0',
  color: s === 'approved' ? '#2e7d32' : s === 'rejected' ? '#c62828' : '#e65100',
});

export default EmployeeLeave;
