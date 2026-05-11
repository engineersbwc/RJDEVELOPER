import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const CeoMessage = () => {
  return (
    <section className="py-[60px] md:py-[100px] relative overflow-hidden bg-slate-900/30 border-y border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] lg:gap-[80px] items-center">
          
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] w-full max-w-[260px] md:max-w-[320px] lg:max-w-[360px] mx-auto lg:ml-0" style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
              <img
                src="/ceo.jpg"
                alt="Engr Rashid Mehmood - CEO & Founder"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.85) 0%, transparent 40%)' }} />
              
              <div className="absolute bottom-0 left-0 w-full p-4 pb-6 text-center lg:hidden">
                <h3 className="text-white text-lg sm:text-xl font-heading font-bold whitespace-nowrap">Engr Rashid Mehmood</h3>
                <p className="text-accent text-sm font-medium">CEO & Founder</p>
              </div>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -top-6 -left-6 text-accent/20 z-[-1] hidden md:block">
              <Quote size={120} />
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-accent/60"></span>
              <span className="section-label">Message from the CEO</span>
            </div>
            
            <div className="space-y-4 text-white/75 font-medium leading-relaxed" style={{ fontSize: '1rem' }}>
              <p>
                Whether you need architectural design, structural construction, or quick consultation — we're here. At the heart of every structure we build is a commitment to precision, durability, and the vision of those we serve. Construction is more than just assembling materials; it is about creating the spaces where businesses grow, families thrive, and communities take root.
              </p>
              <p>
                As a civil engineer, I have always believed that technical expertise must be matched by absolute integrity. Our team doesn't just manage projects—we manage expectations, timelines, and the trust you place in us. Whether we are developing modern residential villas or high-impact commercial hubs, our goal remains the same: to deliver excellence that stands the test of time.
              </p>
              <p>
                We take pride in our "quality-first" approach, ensuring that every square foot we develop reflects the highest standards of safety and design. Thank you for choosing us as your partners in building the future.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 hidden lg:block">
               <h3 className="text-white text-2xl font-heading font-bold">Engr Rashid Mehmood</h3>
               <p className="text-accent font-medium mt-1">CEO & Founder, RJ Developer</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CeoMessage;
