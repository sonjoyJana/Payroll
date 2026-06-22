import React, { useState, useEffect } from 'react';
import { payrollAPI, employeeAPI } from '../services/api';
import SearchableSelect from '../components/SearchableSelect';

const btn = { background: '#1a237e', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' };
const inputStyle = { display: 'block', padding: '0.5rem 0.8rem', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.85rem', outline: 'none', width: '100%', boxSizing: 'border-box' };
const labelStyle = { display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 500, color: '#555' };

const PayslipModal = ({ payroll, onClose }) => {
  const slip = payroll;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #1a237e', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#1a237e', margin: 0 }}>PAYSLIP</h2>
          <p style={{ color: '#888', fontSize: '0.8rem', margin: '0.3rem 0 0' }}>Payroll Management System</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ margin: '0.2rem 0' }}><strong>Employee:</strong> {slip.employee?.firstName || 'N/A'} {slip.employee?.lastName || ''}</p>
            <p style={{ margin: '0.2rem 0' }}><strong>Department:</strong> {slip.employee?.department || 'N/A'}</p>
            <p style={{ margin: '0.2rem 0' }}><strong>Position:</strong> {slip.employee?.position || 'N/A'}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0.2rem 0' }}><strong>Period:</strong> {slip.month} {slip.year}</p>
            <p style={{ margin: '0.2rem 0' }}><strong>Status:</strong> <span style={statusBadge(slip.status)}>{slip.status}</span></p>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', borderTop: '1px solid #eee', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Working Days: {slip.workingDays || 0}</span>
          <span>Present Days: {slip.presentDays || 0}</span>
        </div>
        <button onClick={onClose} style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>Close</button>
      </div>
    </div>
  );
};

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employeeId: '', month: new Date().toLocaleString('default', { month: 'long' }), year: new Date().getFullYear().toString() });
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    loadPayrolls();
    employeeAPI.getAll().then(({ data }) => setEmployees(data.filter(e => e.status === 'active'))).catch(() => {});
  }, []);

  const loadPayrolls = async () => {
    const { data } = await payrollAPI.getAll({});
    setPayrolls(data);
  };

  const handleGenerate = async () => {
    try {
      await payrollAPI.generate(form);
      loadPayrolls();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleStatus = async (id, status) => {
    await payrollAPI.updateStatus(id, { status });
    loadPayrolls();
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Payroll</h2>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Generate Payroll</h3>
        <div className="flex-wrap">
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={labelStyle}>Employee</label>
            <SearchableSelect employees={employees} value={form.employeeId} onChange={(id) => setForm({ ...form, employeeId: id })} placeholder="Type employee name..." />
          </div>
          <div style={{ minWidth: 140 }}>
            <label style={labelStyle}>Month</label>
            <select value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} style={inputStyle}>
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: 100 }}>
            <label style={labelStyle}>Year</label>
            <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={inputStyle} />
          </div>
          <button onClick={handleGenerate} style={{ ...btn, marginTop: '1.2rem' }}>Generate</button>
        </div>
      </div>

      <div className="card table-wrapper" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Period</th>
              <th style={thStyle}>Basic</th>
              <th style={thStyle}>Allow</th>
              <th style={thStyle}>Deduct</th>
              <th style={thStyle}>Tax</th>
              <th style={thStyle}>Net</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p, i) => (
              <tr key={p._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={tdStyle}><span style={{ fontWeight: 500 }}>{p.employee?.firstName || 'Unknown'} {p.employee?.lastName || ''}</span></td>
                <td style={tdStyle}>{p.month} {p.year}</td>
                <td style={tdStyle}>₹{p.basicSalary?.toLocaleString()}</td>
                <td style={tdStyle}>₹{p.allowances?.toLocaleString()}</td>
                <td style={tdStyle}>₹{p.deductions?.toLocaleString()}</td>
                <td style={tdStyle}>₹{p.tax?.toLocaleString()}</td>
                <td style={tdStyle}><span style={{ fontWeight: 600 }}>₹{p.netSalary?.toLocaleString()}</span></td>
                <td style={tdStyle}><span style={statusBadge(p.status)}>{p.status}</span></td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => setSelectedSlip(p)} style={{ background: '#6a1b9a', color: '#fff', border: 'none', padding: '0.3rem 0.7rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>Slip</button>
                    {p.status === 'pending' && (
                      <button onClick={() => handleStatus(p._id, 'processed')} style={{ background: '#1565c0', color: '#fff', border: 'none', padding: '0.3rem 0.7rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>Process</button>
                    )}
                    {p.status === 'processed' && (
                      <button onClick={() => handleStatus(p._id, 'paid')} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '0.3rem 0.7rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>Pay</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {payrolls.length === 0 && (
              <tr><td colSpan={9} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>No payroll records</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedSlip && <PayslipModal payroll={selectedSlip} onClose={() => setSelectedSlip(null)} />}
    </div>
  );
};

const thStyle = { padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' };
const tdStyle = { padding: '0.8rem 1rem', fontSize: '0.85rem', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' };
const statusBadge = (s) => ({
  display: 'inline-block', padding: '0.2rem 0.7rem', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500,
  background: s === 'paid' ? '#e8f5e9' : s === 'processed' ? '#e3f2fd' : '#fff3e0',
  color: s === 'paid' ? '#2e7d32' : s === 'processed' ? '#1565c0' : '#e65100',
});

export default PayrollPage;
