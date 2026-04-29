import React, { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  Construction, 
  HardHat, 
  Ruler, 
  PaintBucket, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  Twitter, 
  MessageSquare,
  Linkedin,
  Clock,
  Award,
  Users2,
  CheckCircle2,
  Wrench,
  ArrowRight,
  DraftingCompass,
  Calculator,
  Users,
  ClipboardList,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Constants & Types ---

const COLORS = {
  primary: "#0F766E", // Teal
  secondary: "#1F2937", // Dark
  accent: "#14B8A6", // Light Teal
  light: "#ffffff",
  card: "#ffffff",
};

const SERVICES = [
  {
    title: "2D & 3D DESIGN",
    description: "Conceptual Planning, Layouts, Walkthroughs & Renders",
    icon: <div className="flex gap-1"><DraftingCompass className="w-8 h-8" /><Layers className="w-8 h-8 opacity-50" /></div>,
  },
  {
    title: "BUILDING ESTIMATIONS",
    description: "Detailed Cost Calculation, Material Quantities, and Budget Planning",
    icon: <div className="flex gap-1"><Calculator className="w-8 h-8" /><ClipboardList className="w-8 h-8 opacity-50" /></div>,
  },
  {
    title: "CONSULTANCY SERVICES",
    description: "Project Guidance, Expert Advice, Site Supervision & Management",
    icon: <div className="flex gap-1"><Users className="w-8 h-8" /><HardHat className="w-8 h-8 opacity-50" /></div>,
  },
];

const PROJECTS = [
  { id: 1, title: "06 Marla Signature Villas (2x)", category: "Residential", image: "/6marla.jpg" },
  { id: 2, title: "07 Marla Modern Villas (3x)", category: "Residential", image: "/7marla.jpg" },
  { id: 3, title: "08 Marla Villas", category: "Residential", image: "/8marla.jpg" },
  { id: 4, title: "10 Marla Villas (2x)", category: "Residential", image: "/10marla_1.jpg" },
  { id: 5, title: "10 Marla Premium Villas", category: "Residential", image: "/10marla_2.jpg" },
  { id: 6, title: "1 Kanal Eco Villas (2x)", category: "Residential", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" },
  { id: 7, title: "Commercial Shops 1 Marla Double Heighted (16x)", category: "Commercial", image: "https://images.unsplash.com/photo-1555633514-abcee6ad93e1?auto=format&fit=crop&q=80&w=800" },
];

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg">
            <HardHat className="text-secondary w-5 h-5" />
          </div>
          <span className={`text-xl font-black tracking-tight uppercase ${scrolled ? "text-secondary" : "text-white"}`}>
            RJ <span className="text-primary">Developer</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`font-bold text-sm transition-colors ${scrolled ? "text-secondary/70 hover:text-primary" : "text-white/80 hover:text-white"}`}
            >
              {link.name}
            </a>
          ))}
          <div className={`flex items-center gap-2 font-black text-xs ${scrolled ? "text-secondary" : "text-white"}`}>
            <Phone className="w-4 h-4 text-primary" />
            <a href="tel:+923331660015">+92 333 1660015</a>
          </div>
          <a href="#contact" className="bg-primary hover:bg-secondary hover:text-white text-secondary px-5 py-2 rounded-lg font-bold text-sm transition-all">
            Contact Us
          </a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 ${scrolled ? "text-secondary" : "text-white"}`}>
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-2xl absolute top-full left-0 w-full"
          >
            <div className="p-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-secondary text-xl font-bold hover:text-primary transition-colors border-b border-slate-100 pb-2"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact" 
                onClick={() => setIsOpen(false)}
                className="bg-primary text-secondary text-center py-4 rounded-xl font-black uppercase"
              >
                Inquire Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative h-[75vh] min-h-[450px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000" 
          alt="Construction" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-primary font-bold uppercase tracking-[0.2em] mb-4 block text-sm">Expert Construction & Civil Engineering</span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
            Building Your Future With <br/>
            <span className="text-primary tracking-tight">Strength & Trust</span>
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8 font-medium">
            Leading the industry with precision engineering and high-quality construction solutions for over 8 years.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="bg-primary hover:bg-white text-secondary px-8 py-3 rounded-xl font-black text-base transition-all shadow-xl">
              Get Started
            </a>
            <a href="#services" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-xl font-black text-base transition-all">
              Our Services
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SectionTitle = ({ subtitle, title, centered = false }: { subtitle: string; title: string, centered?: boolean }) => (
  <div className={`mb-4 ${centered ? "text-center" : "text-left"}`}>
    <span className="text-primary font-bold uppercase tracking-widest block mb-1 text-[10px]">{subtitle}</span>
    <h2 className="text-xl md:text-2xl font-extrabold text-secondary leading-tight">
      {title}
    </h2>
  </div>
);

const About = () => {
  return (
    <section id="about" className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000" 
              alt="About Us"
              className="rounded-3xl shadow-xl w-full h-[350px] object-cover"
            />
            <div className="absolute -bottom-4 -right-4 bg-primary p-4 rounded-2xl shadow-xl hidden md:block">
              <div className="text-2xl font-black text-secondary">8+</div>
              <div className="text-secondary font-bold uppercase text-[10px]">Years Experience</div>
            </div>
          </div>
          <div>
            <SectionTitle subtitle="About RJ Developer" title="Constructing Legacies Since 2009" />
            <p className="text-slate-600 text-base mb-4 leading-relaxed">
              At RJ Developer, we don't just build structures; we build trust. Our journey started with a small team of passionate engineers, and today we are one of the most reliable names in civil engineering and infrastructure development.
            </p>
            <div className="space-y-2">
              {["Certified structural specialists", "Innovative planning & design", "Strict adherence to timelines"].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-4 h-4" />
                  <span className="text-secondary font-bold text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-6 bg-muted relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-5 left-5 opacity-10 pointer-events-none">
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-0.5 h-0.5 bg-secondary rounded-full"></div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-5 right-[40%] text-primary opacity-20 pointer-events-none">
        <div className="w-32 h-32 border-4 border-current rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="flex-1 lg:max-w-[50%]">
            <SectionTitle subtitle="What We Do" title="Our Professional Services" />
            
            <div className="space-y-3">
              {SERVICES.map((service, index) => (
                <motion.div 
                  key={service.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-muted p-2.5 rounded-xl group-hover:bg-primary transition-colors text-primary group-hover:text-secondary">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-secondary mb-0.5 group-hover:text-primary transition-colors">{service.title}</h3>
                      <p className="text-slate-500 leading-relaxed font-semibold text-[10px]">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative group">
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-lg border border-white">
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200" 
                alt="Modern House Design" 
                className="w-full h-full min-h-[300px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/20">
                  <div className="text-[8px] font-black uppercase text-primary tracking-widest mb-0.5">Modern Living</div>
                  <h4 className="text-base font-bold text-secondary uppercase leading-none">Architectural Excellence</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle subtitle="Our Portfolio" title="Featured Projects" centered />
      </div>
      <div className="mt-8 relative w-full flex overflow-hidden">
        <motion.div 
          className="flex gap-4 w-max px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {[...PROJECTS, ...PROJECTS].map((p, i) => (
            <motion.div 
              key={`${p.id}-${i}`}
              whileHover={{ y: -10 }}
              className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/5] bg-secondary group w-64 sm:w-72 flex-shrink-0"
            >
              <img src={p.image} className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" alt={p.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent p-5 flex flex-col justify-end">
                <span className="text-primary font-bold text-[10px] mb-0.5">{p.category}</span>
                <h3 className="text-lg font-bold text-white uppercase">{p.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    sector: "Building", 
    address: "", 
    message: "" 
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null; message: string }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: "Sending your message..." });
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await resp.json();
      if (resp.ok) {
        setStatus({ type: 'success', message: data.message });
        setFormData({ name: "", email: "", phone: "", sector: "Building", address: "", message: "" });
      } else {
        setStatus({ type: 'error', message: data.error });
      }
    } catch {
      setStatus({ type: 'error', message: "Error sending message." });
    }
  };

  return (
    <section id="contact" className="py-6 bg-muted">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl border border-slate-100">
          <SectionTitle subtitle="Inquiry" title="Start a Discussion" centered />
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-muted border border-slate-200 rounded-xl p-3.5 text-xs text-secondary focus:border-primary outline-none" 
                placeholder="Your Name"
              />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-muted border border-slate-200 rounded-xl p-3.5 text-xs text-secondary focus:border-primary outline-none" 
                placeholder="Email Address"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input 
                type="tel" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-muted border border-slate-200 rounded-xl p-3.5 text-xs text-secondary focus:border-primary outline-none" 
                placeholder="Phone Number"
              />
              <select
                required
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full bg-muted border border-slate-200 rounded-xl p-3.5 text-xs text-secondary focus:border-primary outline-none appearance-none cursor-pointer"
              >
                <option value="Building">Building</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>

            <input 
              type="text" 
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-muted border border-slate-200 rounded-xl p-3.5 text-xs text-secondary focus:border-primary outline-none" 
              placeholder="Project Address / Location"
            />

            <textarea 
              rows={2} 
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-muted border border-slate-200 rounded-xl p-3.5 text-xs text-secondary focus:border-primary outline-none resize-none" 
              placeholder="About Project (Tell us more...)"
            ></textarea>
            <button className="w-full bg-primary hover:bg-secondary hover:text-white text-secondary py-3.5 rounded-xl font-black text-base transition-all">
              Send Message
            </button>
            {status.type && (
              <p className={`text-center font-bold mt-1 text-[10px] ${status.type ==='success' ? 'text-green-500' : 'text-red-500'}`}>{status.message}</p>
            )}
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <Phone className="w-4 h-4 text-primary mx-auto mb-0.5" />
              <p className="font-bold text-[10px]">+92 333 1660015</p>
            </div>
            <div>
              <Mail className="w-4 h-4 text-primary mx-auto mb-0.5" />
              <p className="font-bold text-[10px]">m.rashidmehmood95@gmail.com</p>
            </div>
            <div>
              <MapPin className="w-4 h-4 text-primary mx-auto mb-0.5" />
              <p className="font-bold text-[10px] uppercase">Rawalpindi, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h4 className="text-lg font-black text-primary mb-0.5">RJ DEVELOPER</h4>
          <p className="text-white/50 text-[10px] text-center md:text-left">© 2026 Engineering The Future. All rights reserved.</p>
        </div>
        <div className="flex gap-5 font-bold text-[10px] uppercase tracking-wider">
          <a href="#home" className="hover:text-primary transition-colors">Home</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#services" className="hover:text-primary transition-colors">Services</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
        <div className="flex gap-3">
           <a href="https://www.linkedin.com/in/engrtrashid95" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors">
             <Linkedin className="w-3.5 h-3.5 text-white" />
           </a>
           <a href={`https://wa.me/923331660015`} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-accent transition-colors">
             <MessageSquare className="w-3.5 h-3.5 text-white" />
           </a>
           <a href="tel:+923331660015" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors">
             <Phone className="w-3.5 h-3.5 text-white" />
           </a>
        </div>
      </div>
    </footer>
  );
};

const FloatingActions = () => {
  const message = encodeURIComponent("Hello RJ Developer, I want to discuss a project.");
  const phone = "923331660015";

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-center gap-4 z-[100]">
      <a 
        href={`tel:+${phone}`}
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-2 border-white hover:scale-110 active:scale-95 transition-all text-secondary"
        title="Call Us Now"
      >
        <Phone className="w-7 h-7" />
      </a>
      <a 
        href={`https://wa.me/${phone}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer border-2 border-white/20 hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
        title="WhatsApp Chat"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <MessageSquare className="w-8 h-8 text-white relative z-10" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        </span>
      </a>
    </div>
  );
};

export default function App() {
  return (
    <div className="bg-white font-sans selection:bg-primary selection:text-secondary">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Contact />
      <Footer />
      <FloatingActions />
    </div>
  );
}
