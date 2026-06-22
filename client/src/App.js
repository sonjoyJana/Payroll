import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/PayrollPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeAttendance from './pages/EmployeeAttendance';
import EmployeeLeave from './pages/EmployeeLeave';
import EmployeePayslips from './pages/EmployeePayslips';

const AdminRoutes = () => (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/employees" element={<EmployeePage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/leaves" element={<LeavePage />} />
      <Route path="/payroll" element={<PayrollPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </div>
);

const EmployeeRoutes = () => (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
    <Routes>
      <Route path="/" element={<EmployeeDashboard />} />
      <Route path="/attendance" element={<EmployeeAttendance />} />
      <Route path="/leaves" element={<EmployeeLeave />} />
      <Route path="/payslips" element={<EmployeePayslips />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  return (
    <PrivateRoute>
      <Navbar />
      {isAdmin ? <AdminRoutes /> : <EmployeeRoutes />}
    </PrivateRoute>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
