import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const name = searchParams.get('name');
    const id   = searchParams.get('id');

    if (!id) {
      toast.error('Login failed. Please try again.');
      window.location.href = '/login';
      return;
    }

    // Show welcome toast before redirect
    toast.success(`Welcome, ${name || 'User'}! 🎉`);

    // Full page reload so AuthContext re-mounts and reads the HttpOnly cookie
    // set by the backend in the redirect response
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
