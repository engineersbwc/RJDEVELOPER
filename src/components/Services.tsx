import React from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../constants/data';
import { ArrowRight } from 'lucide-react';

const Services = () => {
  return (
    <section id="services" className="py-[60px] md:py-[100px] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)' }}>
      {/* Glow Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-[50px] md:mb-[70px]"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-accent/60"></span>
            <span className="section-label">What We Do</span>
            <span className="w-8 h-px bg-accent/60"></span>
          </div>
          <h2 className="section-title">Our Professional Services</h2>
        </motion.div>

        <div className="flex items-stretch md:grid overflow-x-auto touch-pan-y snap-x snap-mandatory md:overflow-x-visible md:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[28px] pb-6 -mx-6 px-6 md:pb-0 md:mx-0 md:px-0 hide-scrollbar">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl p-7 flex flex-col h-auto z-10 overflow-hidden cursor-pointer touch-pan-y min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(99,102,241,0.06) 100%)' }} />
              {/* Top Border Shine */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.7), transparent)' }} />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon */}
                <div
                  className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-400 group-hover:scale-110"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                >
                  <span className="text-accent">{service.icon}</span>
                </div>

                <h3 className="card-title mb-3 group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="body-text mb-6 flex-grow" style={{ fontSize: '0.875rem' }}>
                  {service.description}
                </p>

                <div className="mt-auto flex items-center gap-2 text-accent font-semibold" style={{ fontSize: '0.8125rem', letterSpacing: '0.08em' }}>
                  <span className="uppercase tracking-wider">Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
