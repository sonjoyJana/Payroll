import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceAPI } from '../services/api';

const EmployeeAttendance = () => {
  const { user } = useAuth();
  const empId = user?.employee?._id;
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (empId) attendanceAPI.getAll({ employeeId: empId }).then(({ data }) => setRecords(data)).catch(() => {});
  }, [empId]);

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>My Attendance</h2>
      <div className="card table-wrapper" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={thStyle}>Date</th><th style={thStyle}>In</th><th style={thStyle}>Out</th><th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((a, i) => (
              <tr key={a._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={tdStyle}>{new Date(a.date).toLocaleDateString()}</td>
                <td style={tdStyle}>{a.checkIn}</td>
                <td style={tdStyle}>{a.checkOut}</td>
                <td style={tdStyle}><span style={statusBadge(a.status)}>{a.status}</span></td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>No records</td></tr>}
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

export default EmployeeAttendance;
