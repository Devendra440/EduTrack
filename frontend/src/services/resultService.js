import API from './api';
export const calculateResult = (data) => API.post('/results/calculate', data);
export const getResultsByStudent = (studentId) => API.get(`/results/student/${studentId}`);
export const getResultBySemester = (studentId, semester) => API.get(`/results/student/${studentId}/semester/${semester}`);
export const getAllResults = () => API.get('/results');
export const getTopPerformers = (limit = 10) => API.get(`/results/top-performers?limit=${limit}`);
