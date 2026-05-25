export const STORAGE_KEYS = {
  TOKEN: "bbs_token",
  USER: "bbs_user",
};

export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const SEAT_STATUS = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
  SELECTED: "SELECTED",
};

export const ENDPOINTS = {
  // Auth
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",

  // Buses
  BUS_SEARCH: "/buses/search",
  BUS_BY_ID: (id) => `/buses/${id}`,

  // Schedules
  SCHEDULE_SEARCH: "/schedules/search",
  SCHEDULE_BY_ID: (id) => `/schedules/${id}`,

  // Seats
  SEATS_FOR_SCHEDULE: (busId, scheduleId) =>
    `/seats/bus/${busId}/schedule/${scheduleId}`,

  // Bookings
  BOOKINGS: "/bookings",
  BOOKING_BY_ID: (id) => `/bookings/${id}`,
  USER_BOOKINGS: "/bookings/user",

  // Notifications
  NOTIFICATIONS: "/notifications",
  NOTIFICATION_READ: (id) => `/notifications/${id}/read`,

  // Admin
  ADMIN_ROUTES: "/admin/routes",
  ADMIN_BUSES: "/buses/admin",
  ADMIN_SCHEDULES: "/schedules/admin",
};