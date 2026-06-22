import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';

const btnPrimary = { background: '#1a237e', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem' };
const btnDanger = { background: '#fff', color: '#c62828', border: '1px solid #c62828', padding: '0.3rem 0.7rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 };
const btnSuccess = { background: '#2e7d32', color: '#fff', border: 'none', padding: '0.3rem 0.7rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 };
const inputStyle = { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.85rem', outline: 'none' };

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employeeId: '', firstName: '', lastName: '', email: '', phone: '', department: '', position: '', salary: '', bankName: '', accountNumber: '', ifscCode: '' });
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    const { data } = await employeeAPI.getAll();
    setEmployees(data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await employeeAPI.create(form);
    setShowForm(false);
    setForm({ employeeId: '', firstName: '', lastName: '', email: '', phone: '', department: '', position: '', salary: '', bankName: '', accountNumber: '', ifscCode: '' });
    loadEmployees();
    setMsg({ type: 'success', text: 'Employee added successfully' });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleDeactivate = async (emp) => {
    if (window.confirm(`Move ${emp.firstName} ${emp.lastName} to inactive?`)) {
      await employeeAPI.update(emp._id, { status: 'inactive' });
      loadEmployees();
      setMsg({ type: 'info', text: `${emp.firstName} ${emp.lastName} moved to inactive` });
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleReactivate = async (emp) => {
    await employeeAPI.update(emp._id, { status: 'active' });
    loadEmployees();
    setMsg({ type: 'success', text: `${emp.firstName} ${emp.lastName} reactivated` });
    setTimeout(() => setMsg(null), 3000);
  };

  const activeEmps = employees.filter((e) => e.status === 'active');
  const inactiveEmps = employees.filter((e) => e.status !== 'active');

  return (
    <div style={{ padding: '2rem 0' }}>
      {msg && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.85rem',
          background: msg.type === 'info' ? '#fff3e0' : '#e8f5e9',
          color: msg.type === 'info' ? '#e65100' : '#2e7d32',
          border: `1px solid ${msg.type === 'info' ? '#ffe0b2' : '#c8e6c9'}`,
        }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Employees</h2>
        <button onClick={() => setShowForm(!showForm)} style={btnPrimary}>
          {showForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </div>

      <input placeholder="Search by name, ID, email or department..." value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ ...inputStyle, maxWidth: 360, marginBottom: '1rem', width: '100%' }} />

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="form-grid-3">
            <div><label style={labelStyle}>Employee ID</label><input name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="EMP011" style={inputStyle} /></div>
            <div><label style={labelStyle}>First Name</label><input name="firstName" value={form.firstName} onChange={handleChange} style={inputStyle} required /></div>
            <div><label style={labelStyle}>Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} style={inputStyle} required /></div>
            <div><label style={labelStyle}>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} required /></div>
            <div><label style={labelStyle}>Phone (10 digits)</label><input name="phone" value={form.phone} onChange={handleChange} pattern="[0-9]{10}" maxLength={10} title="Enter exactly 10 digits" style={inputStyle} required /></div>
            <div><label style={labelStyle}>Department</label><input name="department" value={form.department} onChange={handleChange} style={inputStyle} required /></div>
            <div><label style={labelStyle}>Position</label><input name="position" value={form.position} onChange={handleChange} style={inputStyle} required /></div>
            <div><label style={labelStyle}>Salary</label><input name="salary" type="number" value={form.salary} onChange={handleChange} style={inputStyle} required /></div>
            <div><label style={labelStyle}>Bank Name</label><input name="bankName" value={form.bankName} onChange={handleChange} placeholder="SBI, HDFC..." style={inputStyle} /></div>
            <div><label style={labelStyle}>Account Number</label><input name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="SBIN0001234" style={inputStyle} /></div>
            <div><label style={labelStyle}>IFSC Code</label><input name="ifscCode" value={form.ifscCode} onChange={handleChange} placeholder="SBIN0000123" style={inputStyle} /></div>
            <button type="submit" style={{ ...btnPrimary, alignSelf: 'end', background: '#2e7d32', marginTop: '1.2rem' }}>Save Employee</button>
          </div>
        </form>
      )}

      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Active Employees ({activeEmps.length})</h3>
      <div className="card table-wrapper" style={{ marginBottom: '2rem', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={thStyle}>Emp ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Dept</th>
              <th style={thStyle}>Position</th>
              <th style={thStyle}>Salary</th>
              <th style={thStyle}>Bank</th>
              <th style={thStyle}>Account</th>
              <th style={thStyle}>IFSC</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeEmps.filter((e) => `${e.firstName} ${e.lastName} ${e.email} ${e.department} ${e.employeeId || ''}`.toLowerCase().includes(search.toLowerCase())).map((emp, i) => (
              <tr key={emp._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={tdStyle}><span style={{ fontWeight: 600, color: '#1a237e', fontSize: '0.8rem' }}>{emp.employeeId || emp._id.slice(-5).toUpperCase()}</span></td>
                <td style={tdStyle}><span style={{ fontWeight: 500 }}>{emp.firstName} {emp.lastName}</span></td>
                <td style={tdStyle}>{emp.department}</td>
                <td style={tdStyle}>{emp.position}</td>
                <td style={tdStyle}>₹{emp.salary.toLocaleString()}</td>
                <td style={tdStyle}>{emp.bankName || '-'}</td>
                <td style={tdStyle}><span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{emp.accountNumber || '-'}</span></td>
                <td style={tdStyle}><span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{emp.ifscCode || '-'}</span></td>
                <td style={tdStyle}>
                  <button onClick={() => handleDeactivate(emp)} style={btnDanger}>Deactivate</button>
                </td>
              </tr>
            ))}
            {activeEmps.length === 0 && (
              <tr><td colSpan={9} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>No active employees</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {inactiveEmps.length > 0 && (
        <>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Inactive Employees ({inactiveEmps.length})</h3>
          <div className="card table-wrapper" style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={thStyle}>Emp ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Dept</th>
                  <th style={thStyle}>Position</th>
                  <th style={thStyle}>Salary</th>
                  <th style={thStyle}>Bank</th>
                  <th style={thStyle}>Account</th>
                  <th style={thStyle}>IFSC</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {inactiveEmps.map((emp, i) => (
                  <tr key={emp._id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={tdStyle}><span style={{ fontWeight: 600, color: '#888', fontSize: '0.8rem' }}>{emp.employeeId || emp._id.slice(-5).toUpperCase()}</span></td>
                    <td style={tdStyle}><span style={{ fontWeight: 500 }}>{emp.firstName} {emp.lastName}</span></td>
                    <td style={tdStyle}>{emp.department}</td>
                    <td style={tdStyle}>{emp.position}</td>
                    <td style={tdStyle}>₹{emp.salary.toLocaleString()}</td>
                    <td style={tdStyle}>{emp.bankName || '-'}</td>
                    <td style={tdStyle}><span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{emp.accountNumber || '-'}</span></td>
                    <td style={tdStyle}><span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{emp.ifscCode || '-'}</span></td>
                    <td style={tdStyle}>
                      <button onClick={() => handleReactivate(emp)} style={btnSuccess}>Reactivate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const labelStyle = { display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', fontWeight: 500, color: '#555' };
const thStyle = { padding: '0.8rem 1rem', textAlign: 'left', fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' };
const tdStyle = { padding: '0.8rem 1rem', fontSize: '0.85rem', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' };

export default EmployeePage;
