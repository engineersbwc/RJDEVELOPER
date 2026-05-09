import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all text-sm';

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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl bg-amber-400" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-15 blur-3xl bg-indigo-500" />

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8 z-10">
        <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
          <Building2 className="w-5 h-5 text-amber-400" />
        </div>
        <span className="text-white font-bold text-xl">RJ Developer</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div
          className="rounded-3xl p-6 sm:p-8 md:p-10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6)',
          }}
        >
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-white/40 text-xs md:text-sm mb-7">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={set('email')}
                className={inputClass}
              />
            </div>

            <div className="relative">
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
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 text-slate-900 font-bold rounded-xl py-3.5 text-sm transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <LogIn className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-400 hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
