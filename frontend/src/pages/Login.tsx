import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API_BASE, { apiFetch } from '../utils/api';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all text-sm';



const CircularText = ({ text }: { text: string }) => {
  return (
    <div className="absolute inset-0 -m-8 md:-m-10 pointer-events-none">
      <motion.svg 
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="w-full h-full" 
        viewBox="0 0 100 100"
      >
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -43, 0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
          />
        </defs>
        {[0, 33, 66].map((offset) => (
          <text 
            key={offset}
            className="font-bold uppercase tracking-[0.1em]" 
            style={{ fontSize: '6px', fill: 'var(--color-accent)' }}
          >
            <textPath xlinkHref="#circlePath" startOffset={`${offset + 16}%`} textAnchor="middle">
              {text}
            </textPath>
          </text>
        ))}
      </motion.svg>
    </div>
  );
};

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        login(data.user);
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error(data.error || 'Login failed.');
        if (data.unverified && data.email) {
          navigate('/verify-otp', { state: { email: data.email } });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Cannot reach the server. Is the dev server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4 py-12 relative overflow-y-auto">
      {/* Animated Orbs */}
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

      {/* Animated Video & Circular Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        className="z-10 flex flex-col items-center mb-12"
      >
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
          <CircularText text="RJ DEVELOPER" />
          <div className="w-full h-full relative rounded-full overflow-hidden border-2 border-accent/20 shadow-[0_0_30px_rgba(255,184,0,0.15)] bg-black/20">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-cover scale-110"
            >
              <source src="/irWr97ORN24Nu0029f.webm" type="video/webm" />
            </video>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div
          className="rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6)',
          }}
        >
          {/* Subtle shine effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/50 text-sm mb-8">Sign in to your account</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={set('email')}
                className={inputClass}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Password"
                required
                value={form.password}
                onChange={set('password')}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </motion.div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-accent/60 hover:text-accent hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-accent text-slate-900 font-bold rounded-xl py-4 text-sm transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,184,0,0.2)] hover:shadow-[0_0_30px_rgba(255,184,0,0.4)]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign in <LogIn className="w-4 h-4" /></>}
              </motion.button>
            </motion.div>
          </form>

          <div className="mt-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f172a] px-4 text-white/30">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.a
                whileHover={{ scale: 1.02, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                whileTap={{ scale: 0.98 }}
                href={`${API_BASE}/auth/google`}
                className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-3.5 transition-all shadow-lg shadow-black/20"
              >
                <svg className="w-5 h-5 drop-shadow-sm" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs font-bold text-white/90">Google</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                whileTap={{ scale: 0.98 }}
                href={`${API_BASE}/auth/facebook`}
                className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-3.5 transition-all shadow-lg shadow-black/20"
              >
                <svg className="w-5 h-5 fill-[#1877F2] drop-shadow-sm" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-xs font-bold text-white/90">Facebook</span>
              </motion.a>
            </div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center text-white/50 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:text-accent/80 hover:underline font-medium transition-colors">
              Create one
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

