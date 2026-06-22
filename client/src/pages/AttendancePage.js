import React, { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../services/api';
import SearchableSelect from '../components/SearchableSelect';

const btn = { background: '#1a237e', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' };
const inputStyle = { display: 'block', padding: '0.5rem 0.8rem', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.85rem', outline: 'none', width: '100%', boxSizing: 'border-box' };
const labelStyle = { display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 500, color: '#555' };

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'present', checkIn: '09:00', checkOut: '18:00' });

  useEffect(() => {
    loadAttendance();
    employeeAPI.getAll().then(({ data }) => setEmployees(data.filter(e => e.status === 'active'))).catch(() => {});
  }, []);

  const loadAttendance = async () => {
    const { data } = await attendanceAPI.getAll({});
    setAttendance(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await attendanceAPI.mark(form);
      loadAttendance();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Attendance</h2>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Mark Attendance</h3>
        <form onSubmit={handleSubmit} className="flex-wrap">
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={labelStyle}>Employee</label>
            <SearchableSelect employees={employees} value={form.employeeId} onChange={(id) => setForm({ ...form, employeeId: id })} placeholder="Type employee name..." />
          </div>
          <div style={{ minWidth: 140 }}>
            <label style={labelStyle}>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} required />
          </div>
          <div style={{ minWidth: 120 }}>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
              <option value="half-day">Half Day</option>
              <option value="late">Late</option>
            </select>
          </div>
          <button type="submit" style={{ ...btn, marginTop: '1.2rem' }}>Mark</button>
        </form>
      </div>
      <div className="card table-wrapper" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>In</th>
              <th style={thStyle}>Out</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a, i) => (
              <tr key={a._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={tdStyle}><span style={{ fontWeight: 500 }}>{a.employee?.firstName || 'Unknown'} {a.employee?.lastName || ''}</span></td>
                <td style={tdStyle}>{new Date(a.date).toLocaleDateString()}</td>
                <td style={tdStyle}>{a.checkIn}</td>
                <td style={tdStyle}>{a.checkOut}</td>
                <td style={tdStyle}><span style={statusBadge(a.status)}>{a.status}</span></td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>No attendance records</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle = { padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' };
const tdStyle = { padding: '0.8rem 1rem', fontSize: '0.85rem', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' };
const statusBadge = (s) => ({
  display: 'inline-block', padding: '0.2rem 0.7rem', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500,
  background: s === 'present' ? '#e8f5e9' : s === 'leave' ? '#e3f2fd' : s === 'late' ? '#fff3e0' : s === 'half-day' ? '#f3e5f5' : '#ffebee',
  color: s === 'present' ? '#2e7d32' : s === 'leave' ? '#1565c0' : s === 'late' ? '#e65100' : s === 'half-day' ? '#6a1b9a' : '#c62828',
});

export default AttendancePage;
