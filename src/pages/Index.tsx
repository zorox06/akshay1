
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Benefits from '@/components/Benefits';
import Footer from '@/components/Footer';

const Index = () => {
  // Add animation observer for scroll animations
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
    });
    
    document.querySelectorAll('.section-animate').forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
      <Footer />
    </div>
  );
};

export default Index;
