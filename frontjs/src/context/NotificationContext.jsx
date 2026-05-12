import { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { notificationApi } from '../services/notificationApi';

export const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) { setNotifications([]); setUnreadCount(0); return; }
    try {
      const res = await notificationApi.getAll();
      const items = res.data.data || [];
      setNotifications(items);
      setUnreadCount(items.filter(n => !n.isRead).length);
    } catch (e) { console.error(e); }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) { console.error(e); }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};