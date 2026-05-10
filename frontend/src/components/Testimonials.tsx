import React from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../constants/data';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-[60px] md:py-[100px] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-[60px] md:mb-[80px]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-accent rounded-full"></span>
            <span className="text-accent font-semibold uppercase tracking-widest text-[12px] md:text-[14px]">Client Reviews</span>
            <span className="w-8 h-0.5 bg-accent rounded-full"></span>
          </div>
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-white">What Our Clients Say</h2>
        </div>

        <div className="flex items-stretch md:grid overflow-x-auto touch-pan-y snap-x snap-mandatory md:overflow-x-visible md:grid-cols-3 gap-[24px] md:gap-[32px] pb-6 -mx-6 px-6 md:pb-0 md:mx-0 md:px-0 hide-scrollbar">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="relative rounded-2xl p-8 flex flex-col h-auto touch-pan-y min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5" />
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, index) => (
                  <Star key={index} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-white/60 text-[15px] mb-8 leading-relaxed italic">"{t.feedback}"</p>
              <div>
                <h4 className="text-white font-bold text-[16px]">{t.name}</h4>
                <p className="text-accent text-[13px] font-semibold">{t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
