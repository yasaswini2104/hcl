import api from "../api/axios";
import { ENDPOINTS } from "../utils/constants";

export const scheduleService = {
  search: ({ source, destination, date }) =>
    api.get(ENDPOINTS.SCHEDULE_SEARCH, {
      params: {
        sourceCity: source,
        destinationCity: destination,
        travelDate: date,
      },
    }),
  getById: (id) => api.get(ENDPOINTS.SCHEDULE_BY_ID(id)),
  getSeats: (busId, scheduleId) =>
    api.get(ENDPOINTS.SEATS_FOR_SCHEDULE(busId, scheduleId)),
};