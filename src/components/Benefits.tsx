
import { useEffect, useRef } from 'react';

export default function Benefits() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const benefits = [
    {
      title: "Save Time",
      description: "Reduce tax preparation time by up to 70% with automated data collection and processing.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Maximize Returns",
      description: "Our AI identifies deductions and credits you might miss, increasing your average refund by $1,250.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Reduce Errors",
      description: "Our AI-powered error detection reduces mistakes by 95% compared to manual filing methods.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Stay Compliant",
      description: "Real-time tax code updates ensure you're always filing according to the latest regulations.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <section id="benefits" className="py-20 md:py-24 bg-tax-gray-light relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div ref={sectionRef} className="section-animate">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-tax-blue text-tax-blue-dark text-xs font-semibold tracking-wide uppercase mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Benefits That Make a Difference
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Our AI-powered tax assistant goes beyond traditional tax preparation to deliver real value.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mr-4 mt-1 w-12 h-12 bg-tax-blue rounded-full flex items-center justify-center text-tax-blue-dark">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="glass-card p-8 rounded-xl max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready to Simplify Your Taxes?</h3>
              <p className="text-gray-600 mb-6">Join thousands of users who have transformed their tax experience.</p>
              <button className="px-8 py-3 rounded-lg bg-tax-blue-dark text-white font-medium shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                Start Your Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
