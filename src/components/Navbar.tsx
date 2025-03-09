
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
      scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "py-5"
    )}>
      <div className="container mx-auto px-5 md:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-tax-blue-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">ST</span>
              </div>
              <span className="font-medium text-lg text-gray-900">SmartTax</span>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-tax-blue-dark transition-colors">
              Features
            </a>
            <a href="#benefits" className="text-sm font-medium text-gray-700 hover:text-tax-blue-dark transition-colors">
              Benefits
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-tax-blue-dark transition-colors">
              Contact
            </a>
            <button className="bg-tax-blue-dark hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center"
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6 text-gray-700" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        <div className={cn(
          "md:hidden fixed inset-0 bg-white z-40 transform transition-transform ease-in-out duration-300",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex flex-col h-full pt-20 px-6">
            <div className="absolute top-5 right-5">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <svg 
                  className="w-6 h-6 text-gray-700" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col space-y-6 mt-8">
              <a 
                href="#features" 
                className="text-xl font-medium text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#benefits" 
                className="text-xl font-medium text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefits
              </a>
              <a 
                href="#contact" 
                className="text-xl font-medium text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <button className="bg-tax-blue-dark text-white py-3 px-5 rounded-lg font-medium shadow-sm mt-4">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
