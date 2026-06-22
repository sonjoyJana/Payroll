import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { payrollAPI } from '../services/api';

const PayslipModal = ({ slip, onClose }) => {
  return (
    <div style={modalOverlay} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 16, padding: '2rem', width: 520, maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #1a237e', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#1a237e', margin: 0 }}>PAYSLIP</h2>
          <p style={{ color: '#888', fontSize: '0.8rem', margin: '0.3rem 0 0' }}>Payroll Management System</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <div>
            <p><strong>Employee:</strong> {slip.employee?.firstName || 'N/A'} {slip.employee?.lastName || ''}</p>
            <p><strong>Department:</strong> {slip.employee?.department || 'N/A'}</p>
            <p><strong>Position:</strong> {slip.employee?.position || 'N/A'}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p><strong>Period:</strong> {slip.month} {slip.year}</p>
            <p><strong>Status:</strong> <span style={statusBadge(slip.status)}>{slip.status}</span></p>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
          <thead>
            <tr style={{ background: '#1a237e', color: '#fff' }}>
              <th style={{ padding: '0.6rem', textAlign: 'left', fontSize: '0.8rem' }}>Component</th>
              <th style={{ padding: '0.6rem', textAlign: 'right', fontSize: '0.8rem' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#fafafa' }}><td style={{ padding: '0.6rem', fontSize: '0.85rem' }}>Basic Salary</td><td style={{ padding: '0.6rem', fontSize: '0.85rem', textAlign: 'right' }}>{slip.basicSalary?.toLocaleString() || '0'}</td></tr>
            <tr><td style={{ padding: '0.6rem', fontSize: '0.85rem' }}>Allowances</td><td style={{ padding: '0.6rem', fontSize: '0.85rem', textAlign: 'right', color: '#2e7d32' }}>+{slip.allowances?.toLocaleString() || '0'}</td></tr>
            <tr style={{ background: '#fafafa' }}><td style={{ padding: '0.6rem', fontSize: '0.85rem' }}>Deductions</td><td style={{ padding: '0.6rem', fontSize: '0.85rem', textAlign: 'right', color: '#c62828' }}>-{slip.deductions?.toLocaleString() || '0'}</td></tr>
            <tr><td style={{ padding: '0.6rem', fontSize: '0.85rem' }}>Tax</td><td style={{ padding: '0.6rem', fontSize: '0.85rem', textAlign: 'right', color: '#c62828' }}>-{slip.tax?.toLocaleString() || '0'}</td></tr>
          </tbody>
          <tfoot>
            <tr style={{ background: '#e8eaf6' }}>
              <td style={{ padding: '0.8rem', fontSize: '1rem', fontWeight: 700 }}>Net Salary</td>
              <td style={{ padding: '0.8rem', fontSize: '1rem', fontWeight: 700, textAlign: 'right', color: '#1a237e' }}>₹{slip.netSalary?.toLocaleString() || '0'}</td>
            </tr>
          </tfoot>
        </table>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <span>Working Days: {slip.workingDays || 0}</span>
          <span>Present Days: {slip.presentDays || 0}</span>
        </div>
        <button onClick={onClose} style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>Close</button>
      </div>
    </div>
  );
};

const modalOverlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
  display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
};

const EmployeePayslips = () => {
  const { user } = useAuth();
  const empId = user?.employee?._id;
  const [payrolls, setPayrolls] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (empId) payrollAPI.getAll({ employeeId: empId }).then(({ data }) => setPayrolls(data)).catch(() => {});
  }, [empId]);

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>My Payslips</h2>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={thStyle}>Period</th><th style={thStyle}>Basic</th><th style={thStyle}>Net Salary</th><th style={thStyle}>Status</th><th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p, i) => (
              <tr key={p._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={tdStyle}>{p.month} {p.year}</td>
                <td style={tdStyle}>₹{p.basicSalary?.toLocaleString()}</td>
                <td style={tdStyle}><span style={{ fontWeight: 600 }}>₹{p.netSalary?.toLocaleString()}</span></td>
                <td style={tdStyle}><span style={statusBadge(p.status)}>{p.status}</span></td>
                <td style={tdStyle}>
                  <button onClick={() => setSelected(p)} style={{ background: '#6a1b9a', color: '#fff', border: 'none', padding: '0.3rem 0.7rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>View Slip</button>
                </td>
              </tr>
            ))}
            {payrolls.length === 0 && <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>No payslips available</td></tr>}
          </tbody>
        </table>
      </div>
      {selected && <PayslipModal slip={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

const thStyle = { padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #eee' };
const tdStyle = { padding: '0.8rem 1rem', fontSize: '0.85rem', borderBottom: '1px solid #f0f0f0' };
const statusBadge = (s) => ({
  display: 'inline-block', padding: '0.2rem 0.7rem', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500,
  background: s === 'paid' ? '#e8f5e9' : s === 'processed' ? '#e3f2fd' : '#fff3e0',
  color: s === 'paid' ? '#2e7d32' : s === 'processed' ? '#1565c0' : '#e65100',
});

export default EmployeePayslips;
