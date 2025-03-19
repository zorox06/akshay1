
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsSection from '@/components/tax-updates/NewsSection';
import OfficialUpdatesSection from '@/components/tax-updates/OfficialUpdatesSection';
import { useToast } from "@/components/ui/use-toast";

const TaxUpdates = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Regular tax updates loading toast
    toast({
      title: "Tax Updates Loaded",
      description: "Latest tax updates have been loaded successfully.",
      duration: 3000,
    });
    
    // Add animation observer for scroll animations
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
  }, [toast]);

  return (
    <div className="min-h-screen bg-background indian-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-tax-blue-dark/20 to-transparent opacity-30 mix-blend-overlay pointer-events-none"></div>
      <Navbar />
      
      <div className="container px-4 py-12 mx-auto">
        <div className="max-w-4xl mx-auto section-animate">
          <h1 className="text-3xl font-bold text-tax-blue mb-8">Latest Tax Updates</h1>
          <p className="text-muted-foreground mb-8">
            Stay informed with the latest changes in Indian tax laws, GST notifications, and compliance requirements.
            This page is updated regularly with the most recent tax updates from various government departments.
          </p>
          
          {/* Google News Articles Section */}
          <NewsSection />
          
          {/* Official Tax Updates Section */}
          <OfficialUpdatesSection />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TaxUpdates;
