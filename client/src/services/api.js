import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (e) {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  mark: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
};

export const leaveAPI = {
  getAll: (params) => api.get('/leaves', { params }),
  apply: (data) => api.post('/leaves', data),
  updateStatus: (id, data) => api.put(`/leaves/${id}`, data),
};

export const payrollAPI = {
  getAll: (params) => api.get('/payroll', { params }),
  generate: (data) => api.post('/payroll', data),
  updateStatus: (id, data) => api.put(`/payroll/${id}`, data),
  getDashboard: () => api.get('/payroll/dashboard'),
};

export default api;
