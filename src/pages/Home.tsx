import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import EstimationRates from '../components/EstimationRates';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <EstimationRates />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
