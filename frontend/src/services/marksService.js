import API from './api';
export const getMarksByStudent = (studentId) => API.get(`/marks/student/${studentId}`);
export const getMarksBySchedule = (scheduleId) => API.get(`/marks/schedule/${scheduleId}`);
export const saveMarks = (data) => API.post('/marks', data);
export const updateMarks = (id, data) => API.put(`/marks/${id}`, data);
export const deleteMarks = (id) => API.delete(`/marks/${id}`);
export const submitMarks = (id) => API.post(`/marks/${id}/submit`);
