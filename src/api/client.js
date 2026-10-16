/**
 * Central Axios client.
 * Base URL is read from the VITE_API_BASE_URL environment variable.
 * Every request that carries a JWT token automatically gets the
 * Authorization header attached by the request interceptor.
 * A 401 response clears auth state and redirects to /login.
 */
import axios from "axios";
import { TOKEN_KEY, USER_KEY } from "../context/authStorage";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081"
).replace(/\/+$/, "");

const client = axios.create({
  baseURL: API_BASE_URL,
});

// ─── Request interceptor: attach JWT if present ───────────────────────────────
client.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: global error handling ─────────────────────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Session expired — clear auth and redirect
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default client;

/**
 * Extract a meaningful error message from an Axios error.
 * Falls back through: backend message → HTTP status text → generic string.
 */
export function extractErrorMessage(error) {
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (data?.detail) return data.detail;
  if (typeof data === "string" && data.trim()) return data;
  if (error.response?.status === 503) {
    return "The AI service is temporarily unavailable. Please try again later.";
  }
  if (error.response?.status === 422) {
    return data?.message || "Prerequisite not met. Ensure previous steps are completed.";
  }
  if (error.response?.status === 403) {
    return "Access denied. You do not have permission to access this resource.";
  }
  if (error.response?.status === 404) {
    return "Resource not found.";
  }
  if (error.message) return error.message;
  return "An unexpected error occurred. Please try again.";
}
