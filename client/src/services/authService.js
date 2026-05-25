import api from "../api/axios";
import { ENDPOINTS } from "../utils/constants";

export const authService = {
  login: (credentials) => api.post(ENDPOINTS.LOGIN, credentials),
  register: (data) => api.post(ENDPOINTS.REGISTER, data),
};
