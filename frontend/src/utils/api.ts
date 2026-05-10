/**
 * API base URL utility
 * 
 * - Local Dev: Uses '' so that Vite proxy forwards `/api` → `http://localhost:8000/api`
 * - Production: Uses VITE_API_URL or the hardcoded deployed backend URL
 */
const isProd = import.meta.env.PROD;
const FALLBACK_BACKEND_URL = 'https://rjdeveloper-jknj.vercel.app';

const API_BASE = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : (isProd ? FALLBACK_BACKEND_URL : '');

/**
 * apiFetch — wrapper around fetch that automatically prepends the backend URL.
 * Automatically catches network errors (e.g., when server is unreachable) 
 * and returns a standard error object instead of crashing the app.
 */
export const apiFetch = async (path: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE}${path}`, options);
    return response;
  } catch (error) {
    console.error("apiFetch Network Error:", error);
    // Return a mock Response object so the components' await res.json() doesn't break
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Cannot connect to the server. Please check your internet connection or try again later." 
      }), 
      { 
        status: 503, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

export default API_BASE;
