/**
 * API base URL utility
 * 
 * - Local Dev: Uses '' so that Vite proxy forwards `/api` → backend
 * - Production: Uses VITE_API_URL from env variables only
 */
const isProd = import.meta.env.PROD;

// Read from env
const envUrl = import.meta.env.VITE_API_URL || '';

// Clean URL: Remove trailing slashes to prevent double slashes in paths
const cleanUrl = (url: string) => url.replace(/\/+$/, '');

const API_BASE = isProd ? cleanUrl(envUrl) : '';

if (isProd && !API_BASE) {
  throw new Error('VITE_API_URL must be set for production builds. Please configure it in your Vercel environment variables.');
}

export const apiFetch = async (path: string, options?: RequestInit) => {
  try {
    const token = localStorage.getItem('token');
    const fetchOptions: RequestInit = {
      ...options,
      credentials: options?.credentials || 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      }
    };
    
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const response = await fetch(`${API_BASE}${normalizedPath}`, fetchOptions);
    return response;
  } catch (error) {
    // Only log error in console, don't crash or return scary messages to user for background checks
    console.error(`Connection failed for ${path}:`, error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Server connection failed. Please try again later." 
      }), 
      { 
        status: 503, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

export default API_BASE;
