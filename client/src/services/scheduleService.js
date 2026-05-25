import api from "../api/axios";
import { ENDPOINTS } from "../utils/constants";

export const scheduleService = {
  search: (params) => api.get(ENDPOINTS.SCHEDULE_SEARCH, { params }),
};
