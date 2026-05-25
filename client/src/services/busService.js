import api from "../api/axios";
import { ENDPOINTS } from "../utils/constants";

export const busService = {
  search: ({ source, destination }) =>
    api.get(ENDPOINTS.BUS_SEARCH, {
      params: {
        sourceCity: source,
        destinationCity: destination,
      },
    }),
  getById: (id) => api.get(ENDPOINTS.BUS_BY_ID(id)),
};