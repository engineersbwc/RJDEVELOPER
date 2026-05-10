import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-[60px] md:py-[100px] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] lg:gap-[100px] items-center">

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] w-full" style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80"
                alt="RJ Developer Construction Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.5) 0%, transparent 60%)' }} />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-6 -right-4 md:-right-6 px-6 py-4 rounded-2xl text-center"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div className="section-label mb-1">Experience Since</div>
              <div className="text-accent font-heading font-bold" style={{ fontSize: '2.25rem' }}>2023</div>
            </motion.div>
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-accent/60"></span>
              <span className="section-label">About RJ Developer</span>
            </div>
            <h2 className="section-title mb-5">
              We Build The <span className="text-accent">Foundation</span> Of Your Dreams.
            </h2>
            <p className="section-subtitle mb-8">
              RJ Developer is a premier construction firm dedicated to transforming ideas into concrete reality. We specialize in luxury residential, robust commercial, and state-of-the-art industrial projects across Pakistan.
            </p>

            <ul className="space-y-4">
              {['Premium Quality Materials', 'Highly Qualified Architects & Engineers', 'On-Time Project Delivery', 'Transparent Pricing & Estimations'].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                  className="flex items-center gap-3 text-white/75 font-medium"
                  style={{ fontSize: '0.9375rem' }}
                >
                  <CheckCircle2 className="text-accent w-5 h-5 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
