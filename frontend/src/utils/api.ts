/**
 * API base URL utility
 * 
 * - Local Dev: Vite proxy `/api` → `http://localhost:8000/api` (no prefix needed)
 * - Production: VITE_API_URL set in Vercel frontend environment variables
 *               e.g. https://rj-developer-api.vercel.app
 */
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}`
  : '';

/**
 * apiFetch — wrapper around fetch that automatically prepends the backend URL.
 * Usage: apiFetch('/api/auth/me', { credentials: 'include' })
 */
export const apiFetch = (path: string, options?: RequestInit) => {
  return fetch(`${API_BASE}${path}`, options);
};

export default API_BASE;
