import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Loader2, RefreshCw, Building2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

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

const VerifyOTP = () => {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email: string | undefined = location.state?.email;

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) { setCanResend(true); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  if (!email) return <Navigate to="/register" replace />;

  // ── OTP input helpers ──────────────────────────────────────────────────────
  const handleDigitChange = (index: number, value: string) => {
    const v = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    if (v && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...digits];
    text.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const otp = digits.join('');

  // ── Verify ─────────────────────────────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error('Please enter all 6 digits.'); return; }

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (data.success) {
        login(data.user);
        toast.success('Email verified! Welcome 🎉');
        navigate('/');
      } else {
        toast.error(data.error || 'Verification failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Cannot reach the server.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend ─────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setCanResend(false);
    setTimeLeft(30);
    setDigits(Array(6).fill(''));

    try {
      const res = await apiFetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('New OTP sent!');
      } else {
        toast.error(data.error || 'Failed to resend OTP.');
      }
    } catch (err) {
      toast.error('Cannot reach the server.');
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
          {/* Subtle shine effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Verify your email</h1>
            <p className="text-white/50 text-sm mb-8">
              We sent a 6-digit code to{' '}
              <span className="text-white/80 font-medium">{email}</span>
            </p>
          </motion.div>

          <form onSubmit={handleVerify} className="space-y-8">
            {/* 6 individual boxes */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-11 h-14 md:w-12 md:h-16 text-center text-xl md:text-2xl font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all caret-transparent"
                />
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-accent text-slate-900 font-bold rounded-xl py-4 text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,184,0,0.2)] hover:shadow-[0_0_30px_rgba(255,184,0,0.4)]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & continue <ArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </motion.div>
          </form>

          {/* Timer / Resend */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center mt-8 text-sm">
            {canResend ? (
              <button
                onClick={handleResend}
                className="flex items-center justify-center gap-2 mx-auto text-accent hover:text-accent/80 hover:underline transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Resend OTP
              </button>
            ) : (
              <p className="text-white/40">
                Resend in{' '}
                <span className="text-accent font-semibold tabular-nums">{timeLeft}s</span>
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
