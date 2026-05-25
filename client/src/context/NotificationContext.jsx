import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { notificationService } from "../services/notificationService";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

// Backend wraps in ApiResponse { success, message, data: [...] }
const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload)) return payload;
  return payload?.content || [];
};

// Backend returns `isRead`; UI reads `read` — normalize once here.
const normalize = (notification) => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  notificationType: notification.notificationType,
  read: notification.isRead ?? notification.read ?? false,
  createdAt: notification.createdAt,
});

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await notificationService.list();
      setNotifications(unwrapList(response).map(normalize));
    } catch {
      // Silent — global interceptor handles toast
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // handled by interceptor
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchNotifications();
    else setNotifications([]);
  }, [isAuthenticated, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        unreadCount,
        fetchNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
};