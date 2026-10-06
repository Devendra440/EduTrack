import API from './api';
export const getSchedules = (params) => API.get('/schedules', { params });
export const getScheduleById = (id) => API.get(`/schedules/${id}`);
export const createSchedule = (data) => API.post('/schedules', data);
export const updateSchedule = (id, data) => API.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => API.delete(`/schedules/${id}`);
export const getUpcomingSchedules = () => API.get('/schedules/upcoming');
export const getMarksPendingSchedules = () => API.get('/schedules/marks-pending');
