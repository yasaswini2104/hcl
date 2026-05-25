import api from "../api/axios";
import { ENDPOINTS } from "../utils/constants";

export const busService = {
  search: (params) => api.get(ENDPOINTS.BUS_SEARCH, { params }),
  getById: (id) => api.get(ENDPOINTS.BUS_BY_ID(id)),
};
