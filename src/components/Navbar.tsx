
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTaxCalculationClick = () => {
    navigate('/tax-calculation');
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-tax-gray-dark/60 backdrop-blur-md py-4 sticky top-0 z-50 border-b border-tax-gray-medium/20">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-tax-blue">
            Akshay Sekhar
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-foreground hover:text-tax-blue text-sm font-medium">
              Home
            </Link>
            <Link to="/tax-updates" className="text-foreground hover:text-tax-blue text-sm font-medium">
              Tax Updates
            </Link>
            <Link to="/tax-laws" className="text-foreground hover:text-tax-blue text-sm font-medium">
              Tax Laws
            </Link>
            <button 
              onClick={handleTaxCalculationClick}
              className="text-foreground hover:text-tax-blue text-sm font-medium bg-transparent border-none cursor-pointer"
            >
              Tax Calculation
            </button>
            <Link to="/chatbot" className="text-foreground hover:text-tax-blue text-sm font-medium">
              Chatbot
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-tax-gray-dark rounded-md border border-tax-gray-medium/20">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-foreground hover:text-tax-blue text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/tax-updates" 
                className="text-foreground hover:text-tax-blue text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Tax Updates
              </Link>
              <Link 
                to="/tax-laws" 
                className="text-foreground hover:text-tax-blue text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Tax Laws
              </Link>
              <button
                onClick={handleTaxCalculationClick}
                className="text-foreground hover:text-tax-blue text-sm font-medium text-left bg-transparent border-none cursor-pointer"
              >
                Tax Calculation
              </button>
              <Link 
                to="/chatbot" 
                className="text-foreground hover:text-tax-blue text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Chatbot
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
