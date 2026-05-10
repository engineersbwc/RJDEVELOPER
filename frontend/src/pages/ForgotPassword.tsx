import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/api';

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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Reset OTP sent to your email!');
        navigate('/reset-password', { state: { email } });
      } else {
        toast.error(data.error || 'Something went wrong.');
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
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl bg-accent/20" 
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
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          
          <div className="mb-8">
            <Link to="/login" className="inline-flex items-center gap-2 text-accent/60 hover:text-accent text-xs font-medium transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Forgot Password</h1>
            <p className="text-white/50 text-sm">Enter your email and we'll send you an OTP to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent text-slate-900 font-bold rounded-xl py-4 text-sm transition-opacity disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,184,0,0.2)] hover:shadow-[0_0_30px_rgba(255,184,0,0.4)]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <Send className="w-4 h-4" /></>}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
