import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Loader2, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/api';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all text-sm';

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

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.error("All fields are required");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Password reset successful! Please login.');
        navigate('/login');
      } else {
        toast.error(data.error || 'Reset failed.');
      }
    } catch (err) {
      toast.error('Cannot reach the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4 py-12 relative overflow-y-auto">
      {/* Animated Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl bg-indigo-500/20" 
      />
      
      {/* Animation Header */}
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
              <source src="/mvyAjr1fa934yTNv93.webm" type="video/webm" />
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
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-white/50 text-sm">Enter the OTP sent to <strong>{email}</strong> and your new password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="text"
                placeholder="6-Digit OTP"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all text-sm tracking-[0.5em] font-bold"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent text-slate-900 font-bold rounded-xl py-4 text-sm transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,184,0,0.2)] hover:shadow-[0_0_30px_rgba(255,184,0,0.4)]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Reset Password <CheckCircle2 className="w-4 h-4" /></>}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
