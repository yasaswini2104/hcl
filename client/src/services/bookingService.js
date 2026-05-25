import api from "../api/axios";
import { ENDPOINTS } from "../utils/constants";

export const bookingService = {
  create: (payload) => api.post(ENDPOINTS.BOOKINGS, payload),
  cancel: (id) => api.delete(ENDPOINTS.BOOKING_BY_ID(id)),
  getUserBookings: () => api.get(ENDPOINTS.USER_BOOKINGS),
};
