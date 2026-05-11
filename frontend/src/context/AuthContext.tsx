import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: () => {},
  logout: () => {},
  checkAuth: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ── AUTH CHECK WITH RETRY LOGIC ─────────────────────────────────────────
  const checkAuth = useCallback(async (retries = 2) => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        setError(null);

        // Retry with exponential backoff
        if (attempt > 0) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`[Auth] Retry in ${delay}ms`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        const res = await apiFetch('/api/auth/me', {
          credentials: 'include',
          timeout: 10000,
          retries: 0, // Handle retries here instead
        });

        if (!res.ok) {
          // 401/403 means not authenticated
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            setUser(null);
            setError(null); // Not an error state, just not logged in
            return;
          }

          // Other errors might be temporary
          if (attempt < retries) {
            continue;
          }

          throw new Error(`Auth check failed: ${res.statusText}`);
        }

        const data = await res.json();

        if (data.success && data.data) {
          setUser({
            id: data.data._id,
            name: data.data.name,
            email: data.data.email,
          });
          setError(null);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }

        return; // Success
      } catch (err) {
        lastError = err as Error;
        console.warn(`[Auth] Check attempt ${attempt + 1} failed:`, lastError.message);

        // Only show error after all retries exhausted
        if (attempt === retries) {
          console.error('[Auth] All retry attempts exhausted');
          setError(lastError.message);
        }
      }
    }

    // All retries failed
    if (lastError) {
      localStorage.removeItem('token');
      setUser(null);
      setError(lastError.message);
    }
  }, []);

  // ── CHECK AUTH ON MOUNT ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        await checkAuth();
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Cleanup
    return () => {
      cancelled = true;
    };
  }, [checkAuth]);

  // ── SETUP PERIODIC AUTH CHECKS ──────────────────────────────────────────
  useEffect(() => {
    // Check auth every 5 minutes to detect session expiration
    const interval = setInterval(() => {
      checkAuth(1); // Quick retry (1 attempt) for periodic checks
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAuth]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        timeout: 5000,
      });
    } catch (err) {
      console.warn('Logout API call failed:', (err as Error).message);
    }

    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    toast.success('Logged out successfully.');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
