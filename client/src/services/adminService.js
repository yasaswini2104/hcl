import api from "../api/axios";
import { ENDPOINTS } from "../utils/constants";

export const adminService = {
  // Routes
  createRoute: (payload) => api.post(ENDPOINTS.ADMIN_ROUTES, payload),
  listRoutes: () => api.get(ENDPOINTS.ADMIN_ROUTES),

  // Buses
  createBus: (payload) => api.post(ENDPOINTS.ADMIN_BUSES, payload),
  listBuses: () => api.get(ENDPOINTS.ADMIN_BUSES),

  // Schedules
  createSchedule: (payload) => api.post(ENDPOINTS.ADMIN_SCHEDULES, payload),
  listSchedules: () => api.get(ENDPOINTS.ADMIN_SCHEDULES),
};
