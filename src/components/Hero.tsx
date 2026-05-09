import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: '70vh', paddingTop: '80px', paddingBottom: '40px' }}>
      {/* Background Image Slider */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${BACKGROUND_IMAGES[currentImage]}')` }}
        />
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(2,6,23,0.88) 0%, rgba(15,23,42,0.75) 50%, rgba(30,27,75,0.85) 100%)' }} />
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(2,6,23,1) 0%, transparent 50%)' }} />

      {/* Content */}
      <div className="relative z-20 max-w-[900px] mx-auto px-6 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="w-10 h-px bg-accent/60"></span>
            <span className="section-label">Award Winning Construction Firm</span>
            <span className="w-10 h-px bg-accent/60"></span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white mb-4 drop-shadow-2xl"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}
          >
            Build The Future With{' '}
            <span className="text-accent">RJ Developer</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-white/65 mb-10 mx-auto leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', maxWidth: '650px', fontWeight: 400 }}
          >
            Constructing Trust, Delivering Excellence. We specialize in premium residential, commercial, and industrial construction across Pakistan.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 h-[52px] flex items-center justify-center gap-2 text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5"
              style={{
                fontSize: '0.9375rem',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                boxShadow: '0 0 30px rgba(245,158,11,0.4)',
              }}
            >
              Get a Free Quote <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#projects"
              className="w-full sm:w-auto px-8 h-[52px] flex items-center justify-center text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5"
              style={{
                fontSize: '0.9375rem',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              Explore Portfolio
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </motion.div>

      {/* Image Dots */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {BACKGROUND_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{ background: i === currentImage ? '#f59e0b' : 'rgba(255,255,255,0.2)' }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
