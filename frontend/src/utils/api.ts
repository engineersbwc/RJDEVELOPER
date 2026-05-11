/**
 * API base URL utility
 * 
 * - Local Dev: Uses '' so that Vite proxy forwards `/api` → `http://localhost:8000/api`
 * - Production: Uses VITE_API_URL from env variables
 */
const isProd = import.meta.env.PROD;

// Read from env
let envUrl = import.meta.env.VITE_API_URL || '';

// If we are in production but the envUrl is accidentally set to localhost, ignore it
if (isProd && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
  envUrl = '';
}

// Clean URL: Remove trailing slashes to prevent double slashes in paths
const cleanUrl = (url: string) => url.replace(/\/+$/, '');

const API_BASE = isProd ? cleanUrl(envUrl) : ''; // Use proxy in dev

if (isProd && !API_BASE) {
  console.warn('VITE_API_URL is not set. Production API calls will use relative paths.');
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
