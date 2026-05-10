import React, { useState, useEffect } from 'react';
import { Building2, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Estimation Rates', href: '#estimation' },
    { name: 'Projects', href: '#projects' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-[10px]' : 'py-[20px] md:py-[24px]'}`}
      style={isScrolled ? {
        background: 'rgba(2,6,23,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      } : {}}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            </div>
            <span className="text-[20px] md:text-[24px] font-bold font-heading leading-tight text-white drop-shadow-md">
              RJ Developer
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-[32px]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[14px] md:text-[16px] font-medium text-white/70 hover:text-accent transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/80 font-medium bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <UserIcon className="w-4 h-4 text-accent" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <a
                href="#contact"
                className="px-6 min-h-[44px] flex items-center rounded-xl font-semibold text-[14px] md:text-[16px] transition-all text-white"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.4)',
                }}
              >
                Get a Quote
              </a>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full border-t"
            style={{
              background: 'rgba(2,6,23,0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex flex-col p-6 gap-[16px]">
              {user && (
                <div className="flex items-center gap-3 text-white font-semibold mb-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  <UserIcon className="w-5 h-5 text-accent" />
                  <span>{user.name}</span>
                </div>
              )}
              
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[16px] text-white/70 font-medium hover:text-accent py-2 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-white text-center min-h-[44px] flex items-center justify-center rounded-xl font-semibold text-[16px] mt-[8px] bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all"
                >
                  <LogOut className="w-5 h-5 mr-2" /> Logout
                </button>
              ) : (
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white text-center min-h-[44px] flex items-center justify-center rounded-xl font-semibold text-[16px] mt-[8px]"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                >
                  Contact Us
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
