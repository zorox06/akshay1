
import { useEffect, useRef } from 'react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 subtle-grid"></div>
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-tax-blue opacity-30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-tax-blue-light opacity-30 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div ref={heroRef} className="section-animate flex flex-col items-center text-center">
          <div className="inline-block mb-4">
            <span className="px-3 py-1 rounded-full bg-tax-blue text-tax-blue-dark text-xs font-semibold tracking-wide uppercase">
              AI-Powered Tax Solution
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl">
            Simplify Your Tax Filing With Intelligent Automation
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
            Our AI tax assistant revolutionizes the way you prepare and file taxes, saving time while maximizing returns through personalized recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <button className="px-8 py-3 rounded-lg bg-tax-blue-dark text-white font-medium shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1">
              Get Started Free
            </button>
            <button className="px-8 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300">
              Watch Demo
            </button>
          </div>
          
          <div className="glass-card rounded-2xl p-1 w-full max-w-4xl overflow-hidden shadow-2xl">
            <div className="relative w-full bg-tax-gray-light rounded-xl overflow-hidden aspect-[16/9]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 flex flex-col animate-float">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-tax-gray-medium rounded-md px-2 py-1 text-xs text-gray-600">
                      AI Recommendations
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-tax-gray-light p-3 rounded-lg">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-tax-blue-dark flex items-center justify-center text-white font-medium text-sm shrink-0">
                          AI
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-700">Based on your freelance income, you could qualify for a home office deduction of approximately $2,400.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-tax-gray-light p-3 rounded-lg">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-tax-blue-dark flex items-center justify-center text-white font-medium text-sm shrink-0">
                          AI
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-700">I've identified 3 education expenses that qualify for tax credits, potentially saving you $1,500.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex">
                    <input 
                      type="text" 
                      placeholder="Ask about tax deductions..." 
                      className="flex-1 px-4 py-2 bg-tax-gray-light rounded-l-lg text-sm border-0 focus:ring-0 focus:outline-none"
                    />
                    <button className="bg-tax-blue-dark text-white px-4 py-2 rounded-r-lg text-sm font-medium">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
