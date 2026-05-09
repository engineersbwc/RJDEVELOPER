import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, Loader2, Clock, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', sector: 'Residential', address: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you for sharing your project details! We will get back to you soon.' });
        setFormData({ name: '', email: '', phone: '', sector: 'Residential', address: '', message: '' });
        setTimeout(() => setStatus({ type: null, message: '' }), 2000);
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const glassInput = "w-full px-5 py-3.5 rounded-xl outline-none text-[15px] text-white placeholder-white/30 transition-all focus:ring-1 focus:ring-accent/50";
  const glassInputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
  };

  return (
    <section id="contact" className="py-[40px] md:py-[60px] relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-[40px] md:mb-[50px]"
        >
          <div className="flex items-center justify-center gap-2 mb-[16px]">
            <span className="w-8 h-0.5 bg-accent rounded-full"></span>
            <span className="text-accent font-semibold uppercase tracking-widest text-[12px] md:text-[14px]">Get in Touch</span>
            <span className="w-8 h-0.5 bg-accent rounded-full"></span>
          </div>
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-white leading-tight mb-4">Contact Our Experts</h2>
          <p className="text-white/50 text-[16px] md:text-[18px] max-w-[600px] mx-auto">
            Ready to start your next construction project? Reach out to us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-[24px] md:gap-[32px]">

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-3xl p-[32px] md:p-[48px] relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)' }} />

            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-[26px] md:text-[32px] font-bold mb-[20px] leading-tight text-white">Let's build something great together.</h3>
              <p className="text-white/50 mb-[40px] text-[15px] leading-relaxed">
                Whether you need architectural design, structural construction, or quick consultation — we're here.
              </p>

              <div className="space-y-[28px] flex-1">
                {[
                  { icon: MapPin, label: 'Office Address', value: 'Rawalpindi, Pakistan' },
                  { icon: Phone, label: 'Phone Number', value: '+92 333 1660015' },
                  { icon: Mail, label: 'Email Address', value: 'm.rashidmehmood95@gmail.com' },
                  { icon: Clock, label: 'Working Hours', value: 'Mon - Sat: 9:00 AM - 6:00 PM' },
                ].map(({ icon: Icon, label, value }) => (
                  <motion.div key={label} whileHover={{ x: 5 }} className="flex items-start gap-[12px] sm:gap-[16px] group">
                    <div className="p-2.5 sm:p-3 rounded-xl transition-all duration-300 group-hover:scale-110 shrink-0" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <Icon className="text-accent w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[10px] sm:text-[12px] text-white/40 uppercase tracking-wider mb-[2px] sm:mb-[4px] font-medium">{label}</h4>
                      <p className="text-[12.5px] sm:text-[15px] font-medium text-white leading-snug whitespace-nowrap tracking-tight sm:tracking-normal">{value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 rounded-3xl p-[32px] md:p-[48px] relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />

            <h3 className="text-[22px] md:text-[26px] font-bold text-white mb-[8px]">Send us a message</h3>
            <p className="text-white/40 mb-[32px] text-[14px]">Fill out the form and we'll respond within 24 hours.</p>

            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-[24px] p-4 rounded-xl flex items-start gap-3 ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}
              >
                {status.type === 'success' && <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />}
                <p className="text-[14px] font-medium">{status.message}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-[20px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-white/50">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={glassInput} style={glassInputStyle} placeholder="e.g. Muhammad Ali" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-white/50">Email Address</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={glassInput} style={glassInputStyle} placeholder="e.g. yourname@email.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-white/50">Phone Number</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={glassInput} style={glassInputStyle} placeholder="e.g. +92 300 XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-white/50">Project Sector</label>
                  <div className="relative">
                    <select value={formData.sector} onChange={(e) => setFormData({ ...formData, sector: e.target.value })} className={`${glassInput} appearance-none`} style={glassInputStyle}>
                      <option value="Residential" className="bg-slate-900">Residential</option>
                      <option value="Commercial" className="bg-slate-900">Commercial</option>
                      <option value="Industrial" className="bg-slate-900">Industrial</option>
                      <option value="Design" className="bg-slate-900">2D & 3D Design</option>
                      <option value="Consultancy" className="bg-slate-900">Consultancy</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-white/50">Project Address</label>
                <input type="text" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={glassInput} style={glassInputStyle} placeholder="e.g. Plot #5, DHA Phase 2, Rawalpindi" />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-white/50">Your Message</label>
                <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={`${glassInput} resize-none py-3`} style={glassInputStyle} placeholder="Describe your project, estimated area (Marla/Sqft), budget, and preferred timeline..."></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 text-[16px] transition-all disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 25px rgba(245,158,11,0.3)' }}
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <>Send Message <Send className="w-5 h-5" /></>}
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
