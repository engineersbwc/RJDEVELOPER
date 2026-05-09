import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Loader2, RefreshCw, Building2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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
      const res = await fetch('/api/auth/verify-otp', {
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
      const res = await fetch('/api/auth/resend-otp', {
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl bg-amber-400" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-15 blur-3xl bg-indigo-500" />

      <div className="flex items-center gap-2 mb-8 z-10">
        <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
          <Building2 className="w-5 h-5 text-amber-400" />
        </div>
        <span className="text-white font-bold text-xl">RJ Developer</span>
      </div>

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
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Verify your email</h1>
          <p className="text-white/40 text-xs md:text-sm mb-7">
            We sent a 6-digit code to{' '}
            <span className="text-white/70 font-medium">{email}</span>
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            {/* 6 individual boxes */}
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
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
                  className="w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all caret-transparent"
                />
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 text-slate-900 font-bold rounded-xl py-3.5 text-sm transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & continue <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          {/* Timer / Resend */}
          <div className="text-center mt-6 text-sm">
            {canResend ? (
              <button
                onClick={handleResend}
                className="flex items-center justify-center gap-2 mx-auto text-amber-400 hover:underline"
              >
                <RefreshCw className="w-4 h-4" /> Resend OTP
              </button>
            ) : (
              <p className="text-white/40">
                Resend in{' '}
                <span className="text-amber-400 font-semibold tabular-nums">{timeLeft}s</span>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
