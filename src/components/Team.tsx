import React from 'react';
import { motion } from 'motion/react';
import { TEAM_MEMBERS } from '../constants/data';

const Team = () => {
  return (
    <section id="team" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-1 bg-accent rounded-full"></span>
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Leadership</span>
            <span className="w-8 h-1 bg-accent rounded-full"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Meet Our Experts</h2>
          <p className="text-gray-soft max-w-2xl mx-auto text-lg">
            The dedicated professionals driving innovation and excellence at RJ Developer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-8 text-center relative bg-white">
                <h3 className="text-2xl font-bold text-primary mb-1">{member.name}</h3>
                <p className="text-accent font-semibold mb-4">{member.role}</p>
                <p className="text-gray-soft">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
