/**
 * API base URL utility
 * 
 * - Local Dev: Uses '' so that Vite proxy forwards `/api` → `http://localhost:8000/api`
 * - Production: Uses VITE_API_URL or the hardcoded deployed backend URL
 */
const isProd = import.meta.env.PROD;
const FALLBACK_BACKEND_URL = 'https://rjdeveloper-jknj.vercel.app';

// Read from env
let envUrl = import.meta.env.VITE_API_URL || '';

// If we are in production but the envUrl is accidentally set to localhost, ignore it
if (isProd && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
  envUrl = '';
}

const API_BASE = isProd 
  ? (envUrl || FALLBACK_BACKEND_URL) 
  : (envUrl || '');

/**
 * apiFetch — wrapper around fetch that automatically prepends the backend URL.
 * Automatically catches network errors (e.g., when server is unreachable) 
 * and returns a standard error object instead of crashing the app.
 */
export const apiFetch = async (path: string, options?: RequestInit) => {
  try {
    const token = localStorage.getItem('token');
    const fetchOptions: RequestInit = {
      ...options,
      credentials: options?.credentials || 'include',
      headers: {
        ...options?.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      }
    };
    const response = await fetch(`${API_BASE}${path}`, fetchOptions);
    return response;
  } catch (error) {
    console.error(`apiFetch Network Error for ${API_BASE}${path}:`, error);
    // Return a mock Response object so the components' await res.json() doesn't break
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Cannot connect to the server at ${API_BASE}. Please check your internet connection or Vercel environment variables.` 
      }), 
      { 
        status: 503, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

export default API_BASE;
