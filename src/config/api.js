// ==========================================
// CENTRALIZED API BASE URL
// In production on the same host (e.g. Railway),
// uses relative URLs "" so requests hit the same origin.
// In local development, points to localhost:5000.
// ==========================================

const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

export const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : isLocalhost
    ? "http://localhost:5000"
    : "";

export default API_BASE_URL;
