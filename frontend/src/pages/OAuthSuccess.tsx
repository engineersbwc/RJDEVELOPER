import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your login...');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!token || !id) {
      setStatus('error');
      setMessage('Authentication failed. Redirecting to login...');
      toast.error('Login failed. Please try again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Save token for persistence
    localStorage.setItem('token', token);
    
    // Set cookie for mobile compatibility
    const maxAge = 7 * 24 * 60 * 60;
    const isSecure = window.location.protocol === 'https:';
    document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=None; ${isSecure ? 'Secure;' : ''}`;

    // Update global auth state immediately
    login({ id, name: name || 'User', email: email || '' });
    setUserName(name || 'User');
    
    // Show success state
    setTimeout(() => {
      setStatus('success');
      setMessage('Welcome back!');
      
      // Final redirect
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1200);
    }, 800);

  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Orbs (Matching Login Page) */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl bg-accent/20" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl bg-indigo-500" 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm z-10"
      >
        <div className="glass rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle shine */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-16 h-16 text-accent" />
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 blur-xl bg-accent/30 rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 font-heading">Verifying Login</h2>
                  <p className="text-white/40 text-sm">{message}</p>
                </div>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,184,0,0.4)]"
                >
                  <CheckCircle2 className="w-10 h-10 text-slate-900" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 font-heading">
                    Welcome, <span className="text-accent">{userName.split(' ')[0]}</span>!
                  </h2>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 font-heading">Login Failed</h2>
                  <p className="text-red-400/80 text-sm">{message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthSuccess;
