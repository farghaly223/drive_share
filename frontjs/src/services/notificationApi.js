import api from './api';
export const notificationApi = {
  getAll: () => api.get('/Notification'),
  markAsRead: () => api.patch('/Notification/read'),
};