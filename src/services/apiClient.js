// HotelPro — Axios API Client
// Reads VITE_API_BASE_URL from environment.
// Set VITE_USE_MOCK=true to use mock data adapters during development.

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send HttpOnly cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired — redirect to login
      window.location.href = '/login?expired=1';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
