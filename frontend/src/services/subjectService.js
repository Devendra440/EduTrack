import API from './api';
export const getSubjects = (params) => API.get('/subjects', { params });
export const getSubjectById = (id) => API.get(`/subjects/${id}`);
export const createSubject = (data) => API.post('/subjects', data);
export const updateSubject = (id, data) => API.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => API.delete(`/subjects/${id}`);
