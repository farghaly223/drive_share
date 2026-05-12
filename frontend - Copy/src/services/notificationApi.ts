import api from './api';
import type { NotificationItem } from '../types';

interface NotificationsResponse {
  extractedUserId: number;
  notificationsFound: number;
  data: NotificationItem[];
}

export const notificationApi = {
  getAll: () => api.get<NotificationsResponse>('/Notification'),
  markAsRead: () => api.patch('/Notification/read'),
};