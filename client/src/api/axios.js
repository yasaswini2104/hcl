import axios from "axios";
import { toast } from "react-toastify";
import { STORAGE_KEYS } from "../utils/constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const method = (error.config?.method || "get").toLowerCase();
    const isReadRequest = method === "get";

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (window.location.pathname !== "/login") {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    } else if (status === 403 && !isReadRequest) {
      // Only complain about 403 on user actions, not background loads
      toast.error("You don't have permission to do that.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject({ ...error, message });
  }
);

export default api;