import React, { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';

const btnApprove = { background: '#2e7d32', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.75rem', marginRight: '0.3rem' };
const btnReject = { background: '#c62828', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: '0.75rem' };
const btnDisabled = { ...btnApprove, opacity: 0.5, cursor: 'not-allowed' };

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    const params = {};
    if (filter) params.status = filter;
    const { data } = await leaveAPI.getAll(params);
    setLeaves(data);
  };

  useEffect(() => { loadLeaves(); }, [filter]);

  const handleAction = async (id, status) => {
    await leaveAPI.updateStatus(id, { status });
    loadLeaves();
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Leave Requests</h2>
      <div style={{ marginBottom: '1rem' }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '0.5rem 0.8rem', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.85rem', outline: 'none' }}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Start</th>
              <th style={thStyle}>End</th>
              <th style={thStyle}>Reason</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l, i) => (
              <tr key={l._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={tdStyle}>{l.employee?.firstName} {l.employee?.lastName}</td>
                <td style={tdStyle}>{l.leaveType}</td>
                <td style={tdStyle}>{new Date(l.startDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{new Date(l.endDate).toLocaleDateString()}</td>
                <td style={tdStyle}>{l.reason}</td>
                <td style={tdStyle}><span style={statusBadge(l.status)}>{l.status}</span></td>
                <td style={tdStyle}>
                  {l.status === 'pending' ? (
                    <>
                      <button onClick={() => handleAction(l._id, 'approved')} style={btnApprove}>Approve</button>
                      <button onClick={() => handleAction(l._id, 'rejected')} style={btnReject}>Reject</button>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>No leave requests</td></tr>
            )}
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

export default LeavePage;
