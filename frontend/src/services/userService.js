import api from './api';

export const getUsers = (role) => api.get(`/users${role ? `?role=${role}` : ''}`);
export const createTeacherCredential = (data, operator) => api.post('/users/teacher', data, {
  headers: {
    'X-Operator-Email': operator?.email || 'manager@gmail.com',
    'X-Operator-Role': operator?.role || 'CREDENTIAL_MANAGER'
  }
});
export const createStudentCredential = (data, operator) => api.post('/users/student', data, {
  headers: {
    'X-Operator-Email': operator?.email || 'manager@gmail.com',
    'X-Operator-Role': operator?.role || 'CREDENTIAL_MANAGER'
  }
});
export const updateUserCredential = (id, data, operator) => api.put(`/users/${id}`, data, {
  headers: {
    'X-Operator-Email': operator?.email || 'manager@gmail.com',
    'X-Operator-Role': operator?.role || 'CREDENTIAL_MANAGER'
  }
});
export const deleteUserCredential = (id, operator) => api.delete(`/users/${id}`, {
  headers: {
    'X-Operator-Email': operator?.email || 'manager@gmail.com',
    'X-Operator-Role': operator?.role || 'CREDENTIAL_MANAGER'
  }
});
export const changeUserPassword = (id, newPassword, operator) => api.post(`/users/${id}/change-password`, { newPassword }, {
  headers: {
    'X-Operator-Email': operator?.email || 'manager@gmail.com',
    'X-Operator-Role': operator?.role || 'CREDENTIAL_MANAGER'
  }
});
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const requestForgotPassword = (data) => api.post('/auth/forgot-password', data);
export const getMonitoringStats = () => api.get('/users/monitoring/stats');
export const getAuditLogs = () => api.get('/users/monitoring/audit-logs');
export const getResetRequests = () => api.get('/users/reset-requests');
export const fulfillResetRequest = (id, newPassword, operator) => api.post(`/users/reset-requests/${id}/fulfill`, { newPassword }, {
  headers: {
    'X-Operator-Email': operator?.email || 'manager@gmail.com',
    'X-Operator-Role': operator?.role || 'CREDENTIAL_MANAGER'
  }
});
