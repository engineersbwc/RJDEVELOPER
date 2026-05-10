import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const name  = searchParams.get('name');
    const id    = searchParams.get('id');

    if (!token || !id) {
      toast.error('Login failed. Please try again.');
      window.location.href = '/login';
      return;
    }

    // Save token to localStorage for production stability
    localStorage.setItem('token', token);

    // Also set cookie as fallback
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;

    toast.success(`Welcome, ${name || 'User'}! 🎉`);

    // Full page reload so AuthContext reads the token from localStorage
    window.location.href = '/';
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 text-white"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-accent" />
        </motion.div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg mb-1">Signing you in...</p>
          <p className="text-white/40 text-sm">Please wait a moment</p>
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthSuccess;
