
import { useEffect, useRef, useState } from 'react';
import TaxAssistant from './TaxAssistant';
import { useToast } from "@/components/ui/use-toast";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [showDemo, setShowDemo] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    }, {
      threshold: 0.1
    });
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  const handleGetStarted = () => {
    toast({
      title: "Welcome to the Tax Assistant!",
      description: "You can now start asking questions about your taxes.",
      duration: 5000,
    });
    
    // Scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleWatchDemo = () => {
    setShowDemo(true);
    toast({
      title: "Demo Mode Activated",
      description: "Try asking about tax deductions, GST, or home office expenses.",
      duration: 5000,
    });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden rangoli-decoration">
      {/* Background elements */}
      <div className="absolute inset-0 subtle-grid"></div>
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-tax-blue opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-tax-green opacity-10 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div ref={heroRef} className="section-animate flex flex-col items-center text-center">
          <div className="inline-block mb-4">
            <span className="px-3 py-1 rounded-full bg-tax-blue/20 text-tax-blue text-xs font-semibold tracking-wide uppercase">AI-POWERED TAX SOLUTION</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight max-w-4xl">
            Simplify Your <span className="text-tax-blue">Tax Filing</span> With Intelligent Automation
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Our AI tax assistant revolutionizes the way you prepare and file GST & income tax returns, saving time while maximizing returns through personalized recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-3 rounded-lg bg-tax-blue text-tax-gray-dark font-medium shadow-lg hover:shadow-xl hover:bg-tax-blue-light transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Free
            </button>
            <button 
              onClick={handleWatchDemo}
              className="px-8 py-3 rounded-lg border border-muted text-foreground font-medium hover:bg-muted/50 transition-all duration-300"
            >
              Try Demo
            </button>
          </div>
          
          <div className="glass-card rounded-2xl p-1 w-full max-w-4xl overflow-hidden shadow-2xl">
            <div className="relative w-full bg-tax-gray-dark rounded-xl overflow-hidden aspect-[16/9]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-xl bg-tax-gray-medium rounded-lg shadow-lg p-6 flex flex-col animate-float">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-tax-gray-dark rounded-md px-2 py-1 text-xs text-muted-foreground">
                      AI Recommendations
                    </div>
                  </div>
                  
                  {showDemo ? (
                    <TaxAssistant />
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-tax-gray-dark p-3 rounded-lg">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-tax-blue flex items-center justify-center text-tax-gray-dark font-medium text-sm shrink-0">
                            AI
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-foreground">Based on your consulting income, you could qualify for a home office deduction of approximately ₹1,80,000.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-tax-gray-dark p-3 rounded-lg">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-tax-blue flex items-center justify-center text-tax-gray-dark font-medium text-sm shrink-0">
                            AI
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-foreground">I've identified 3 Section 80C investment options, potentially saving you ₹46,800 in taxes.</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex">
                        <input 
                          type="text" 
                          placeholder="Ask about tax deductions..." 
                          className="flex-1 px-4 py-2 bg-tax-gray-dark rounded-l-lg text-sm border-0 focus:ring-0 focus:outline-none text-foreground"
                          onClick={handleWatchDemo}
                        />
                        <button 
                          className="bg-tax-blue text-tax-gray-dark px-4 py-2 rounded-r-lg text-sm font-medium"
                          onClick={handleWatchDemo}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
