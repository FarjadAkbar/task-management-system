import { API_URL } from "@/config";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Handle global response errors (e.g., token expiration)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Token is invalid or expired; handle logout or token refresh
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
