
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TaxAssistant from '@/components/TaxAssistant';
import TaxCalculatorForm from '@/components/tax-calculation/TaxCalculatorForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TaxCalculation = () => {
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
    <div className="min-h-screen bg-background indian-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-tax-blue-dark/20 to-transparent opacity-30 mix-blend-overlay pointer-events-none"></div>
      <Navbar />
      
      <div className="container px-4 py-12 mx-auto">
        <div className="max-w-4xl mx-auto section-animate">
          <h1 className="text-3xl font-bold text-tax-blue mb-8">Tax Calculation</h1>
          <p className="text-muted-foreground mb-8">
            Calculate your tax liability under both old and new tax regimes. 
            Get personalized recommendations based on your income, deductions, and location.
          </p>
          
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-8">
              <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
              <TabsTrigger value="assistant">Tax Assistant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator">
              <Card>
                <CardHeader>
                  <CardTitle>Indian Income Tax Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxCalculatorForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="assistant">
              <Card>
                <CardHeader>
                  <CardTitle>AI Tax Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxAssistant />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TaxCalculation;
