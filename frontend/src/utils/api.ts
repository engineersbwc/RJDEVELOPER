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

// Production validation and logging
if (isProd) {
  if (!API_BASE) {
    console.error(
      '❌ VITE_API_URL is not configured!\n' +
      'Please set it in your Vercel project Settings > Environment Variables\n' +
      'Example: VITE_API_URL=https://your-backend.vercel.app'
    );
  } else {
    console.log(`✅ API Base URL configured: ${API_BASE}`);
  }
}

export const apiFetch = async (path: string, options?: RequestInit) => {
  try {
    // Validate API_BASE in production
    if (isProd && !API_BASE) {
      throw new Error(
        'VITE_API_URL environment variable is not set. ' +
        'Configure it in Vercel project settings.'
      );
    }

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
    const fullUrl = `${API_BASE}${normalizedPath}`;
    
    if (isProd) {
      console.debug(`📡 API Request: ${fullUrl}`);
    }

    const response = await fetch(fullUrl, fetchOptions);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Connection failed for ${path}:`, message);
    
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
