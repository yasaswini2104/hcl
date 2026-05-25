import api from "../api/axios";
import { ENDPOINTS } from "../utils/constants";

export const notificationService = {
  list: () => api.get(ENDPOINTS.NOTIFICATIONS),
  markRead: (id) => api.put(ENDPOINTS.NOTIFICATION_READ(id)),
};
