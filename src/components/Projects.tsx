import React from 'react';
import { motion } from 'motion/react';
import { PROJECTS } from '../constants/data';

const Projects = () => {
  return (
    <section id="projects" className="py-[60px] md:py-[100px] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full opacity-8 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-[50px] md:mb-[70px]"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-accent/60"></span>
            <span className="section-label">Our Portfolio</span>
            <span className="w-8 h-px bg-accent/60"></span>
          </div>
          <h2 className="section-title">Featured Projects</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] md:gap-[28px]">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl overflow-hidden group cursor-pointer relative"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px z-20 opacity-50" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />

              <div className="relative aspect-[16/10] overflow-hidden w-full">
                <img
                  src={p.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={p.title}
                />
                <div className="absolute inset-0 transition-opacity duration-400 opacity-0 group-hover:opacity-100" style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.5) 0%, transparent 60%)' }} />
              </div>
              <div className="p-5">
                <h3 className="text-white font-heading font-semibold group-hover:text-accent transition-colors duration-300" style={{ fontSize: '1.0625rem', letterSpacing: '-0.01em' }}>
                  {p.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
