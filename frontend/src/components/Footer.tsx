import React from 'react';
import { Building2, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden pt-[80px] md:pt-[120px] pb-[40px]" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-[40px] md:gap-[60px] mb-[80px]">

          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-[24px]">
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <span className="text-[24px] md:text-[28px] font-bold font-heading tracking-tight text-white">RJ Developer</span>
            </div>
            <p className="text-[16px] text-white/40 mb-[32px] leading-relaxed max-w-md">
              Constructing Trust, Delivering Excellence. We build the foundations of your future with unmatched quality and precision.
            </p>
            <div className="flex items-center gap-[12px]">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-[44px] h-[44px] rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 group"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-5 h-5 text-white/50 group-hover:text-accent transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[18px] font-bold mb-[28px] font-heading text-white">Quick Links</h4>
            <ul className="space-y-[14px]">
              {['Home', 'About Us', 'Services', 'Projects', 'Estimation Rates'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '')}`} className="flex items-center gap-2 text-[15px] text-white/40 hover:text-accent transition-colors group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-accent" />
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="text-[18px] font-bold mb-[28px] font-heading text-white">Our Services</h4>
            <ul className="space-y-[14px]">
              {['Residential Construction', 'Commercial Buildings', 'Industrial Facilities', '2D & 3D Design', 'Consultancy'].map((link) => (
                <li key={link}>
                  <a href="#services" className="flex items-center gap-2 text-[15px] text-white/40 hover:text-accent transition-colors group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-accent" />
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div className="lg:col-span-2">
            <h4 className="text-[18px] font-bold mb-[28px] font-heading text-white">Working Hours</h4>
            <ul className="space-y-[20px] text-[15px]">
              <li className="flex flex-col gap-1">
                <span className="text-white/30 uppercase tracking-wider text-[11px] font-medium">Mon - Fri</span>
                <span className="text-white font-medium">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-white/30 uppercase tracking-wider text-[11px] font-medium">Saturday</span>
                <span className="text-white font-medium">9:00 AM - 2:00 PM</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-white/30 uppercase tracking-wider text-[11px] font-medium">Sunday</span>
                <span className="text-red-400 font-medium">Closed</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-[32px] flex flex-col md:flex-row items-center justify-between text-white/30 text-[14px]" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p>&copy; {new Date().getFullYear()} RJ Developer. All rights reserved.</p>
          <div className="flex gap-[32px] mt-[24px] md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
