
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChatProvider } from '@/contexts/ChatContext';
import TaxAssistant from '@/components/TaxAssistant';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chatbot = () => {
  // Add animation observer for scroll animations (reusing from Index.tsx)
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
    <ChatProvider>
      <div className="min-h-screen bg-background indian-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-tax-blue-dark/20 to-transparent opacity-30 mix-blend-overlay pointer-events-none"></div>
        <Navbar />
        
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-4xl mx-auto section-animate">
            <h1 className="text-3xl font-bold text-tax-blue mb-8">Tax Chatbot</h1>
            <p className="text-muted-foreground mb-8">
              Get instant answers to your tax-related questions with our AI-powered tax assistant.
              Upload your financial documents for personalized tax advice and calculations.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Ask Your Tax Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <TaxAssistant />
              </CardContent>
            </Card>
            
            <div className="mt-8 grid gap-6 md:grid-cols-2 section-animate">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Ask any tax-related question in the chat box</li>
                    <li>Upload your financial CSV file for personalized analysis</li>
                    <li>Enable location detection for state-specific tax information</li>
                    <li>Get instant answers and tax-saving recommendations</li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What You Can Ask</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Tax deduction eligibility under various sections</li>
                    <li>GST filing requirements and due dates</li>
                    <li>Income tax calculations and comparisons between tax regimes</li>
                    <li>State-specific tax benefits and regulations</li>
                    <li>TDS rates and filing procedures</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </ChatProvider>
  );
};

export default Chatbot;
