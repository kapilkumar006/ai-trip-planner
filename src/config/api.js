// ==========================================
// CENTRALIZED API BASE URL
// Uses environment variable in production,
// defaults to localhost:5000 in development
// ==========================================

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE_URL;
