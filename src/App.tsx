import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import EstimationRates from './components/EstimationRates';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div
      className="min-h-screen selection:bg-accent selection:text-white font-sans"
      style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 70%, #020617 100%)' }}
    >
      {/* Global Floating Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
        <div className="absolute top-[30%] right-[-200px] w-[600px] h-[600px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-200px] left-[30%] w-[800px] h-[800px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <EstimationRates />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
