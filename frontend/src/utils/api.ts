/**
 * API Fetch Utility with Production Safety
 * 
 * Development (Vite):
 * - Uses empty string → Vite proxy forwards `/api` → backend
 * - No VITE_API_URL needed for local development
 * 
 * Production:
 * - MUST have VITE_API_URL environment variable set
 * - Points to backend domain (e.g., https://your-backend.vercel.app)
 * - Set in Vercel Project Settings > Environment Variables
 */

const isProd = import.meta.env.PROD;

// Read API base URL from environment
const envApiUrl = import.meta.env.VITE_API_URL?.trim() || "";
const cleanUrl = (url: string) => url.replace(/\/+$/, "");
const API_BASE = isProd ? cleanUrl(envApiUrl) : "";

// ── STARTUP VALIDATION ────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  if (isProd) {
    if (!API_BASE) {
      const errorMsg =
        "🚨 CRITICAL: VITE_API_URL is not configured!\n" +
        "Frontend cannot communicate with backend in production.\n\n" +
        "FIX: Set VITE_API_URL in Vercel project:\n" +
        "1. Go to Vercel Dashboard\n" +
        "2. Select your Frontend project\n" +
        "3. Settings > Environment Variables\n" +
        "4. Add: VITE_API_URL=https://your-backend-url.vercel.app\n" +
        "5. Redeploy";

      console.error(errorMsg);

      // Show banner to users in production
      const banner = document.createElement("div");
      banner.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; background: #dc2626; color: white; padding: 20px; text-align: center; z-index: 99999; font-family: monospace; font-size: 14px;">
          <strong>⚠️ Server Configuration Error</strong><br>
          The frontend cannot reach the backend. Please contact support or refresh the page.
        </div>
      `;
      document.body.prepend(banner);
    } else {
      console.log(`✅ API Base URL: ${API_BASE}`);
    }
  }
}

// ── FETCH WITH TIMEOUT ────────────────────────────────────────────────────
const fetchWithTimeout = (
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> => {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...fetchOptions,
    signal: controller.signal,
  })
    .then((response) => {
      clearTimeout(timeoutId);
      return response;
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    });
};

// ── MAIN API FETCH FUNCTION ───────────────────────────────────────────────
export const apiFetch = async (
  path: string,
  options?: RequestInit & { timeout?: number; retries?: number }
): Promise<Response> => {
  const { timeout = 30000, retries = 1, ...fetchOptions } = options || {};

  // Production validation
  if (isProd && !API_BASE) {
    const error = new Error(
      "API_BASE is not configured. Check VITE_API_URL environment variable."
    );
    (error as any).isConfigError = true;
    throw error;
  }

  // Build full URL
  const fullUrl = API_BASE ? `${API_BASE}${path}` : path;

  // Default fetch options
  const defaultOptions: RequestInit = {
    credentials: "include", // Send/receive cookies
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Merge options
  const finalOptions: RequestInit = {
    ...defaultOptions,
    ...fetchOptions,
    headers: {
      ...defaultOptions.headers,
      ...(fetchOptions?.headers || {}),
    },
  };

  // Add authentication token if available
  const token = localStorage.getItem("token");
  if (token && token !== "null") {
    finalOptions.headers = {
      ...finalOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Retry logic with exponential backoff
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(
        `[API] ${fetchOptions.method || "GET"} ${fullUrl}${attempt > 0 ? ` (attempt ${attempt + 1})` : ""}`
      );

      const response = await fetchWithTimeout(fullUrl, {
        ...finalOptions,
        timeout,
      });

      // Check for successful response
      if (response.ok) {
        return response;
      }

      // Handle specific error codes
      if (response.status === 401) {
        // Unauthorized - clear token and retry once
        localStorage.removeItem("token");
        if (attempt === 0) {
          finalOptions.headers = { ...finalOptions.headers };
          delete (finalOptions.headers as any).Authorization;
          continue;
        }
      }

      if (response.status === 503 && attempt < retries) {
        // Service unavailable - retry after delay
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      if (attempt < retries) {
        // Retry with exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(
          `[API] Retry in ${delay}ms: ${(error as Error).message}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries exhausted
  if (lastError) {
    throw lastError;
  }

  throw new Error("API request failed after all retries");
};

// ── HELPER FUNCTIONS ──────────────────────────────────────────────────────
export const apiGet = (path: string, options?: RequestInit) =>
  apiFetch(path, { ...options, method: "GET" });

export const apiPost = (path: string, data?: any, options?: RequestInit) =>
  apiFetch(path, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiPut = (path: string, data?: any, options?: RequestInit) =>
  apiFetch(path, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiDelete = (path: string, options?: RequestInit) =>
  apiFetch(path, { ...options, method: "DELETE" });

// ── DEFAULT EXPORT FOR BACKWARDS COMPATIBILITY ────────────────────────────
export default {
  apiFetch,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
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
