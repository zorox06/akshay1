
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const taxUpdates = [
  {
    id: 1,
    title: "New Budget 2023-24 Tax Implications",
    date: "February 1, 2023",
    description: "The Union Budget 2023-24 introduces significant changes to income tax rates and slabs under the new tax regime.",
    category: "Budget",
    content: "The Finance Minister announced in the Union Budget 2023-24 that the new tax regime will now be the default option. Income tax rebate limit increased from ₹5 lakh to ₹7 lakh under the new tax regime. Standard deduction of ₹50,000 has been introduced in the new tax regime. The number of tax slabs reduced from 6 to 5, with significant increase in tax exemption limits."
  },
  {
    id: 2,
    title: "Updated GST Filing Dates for 2023",
    date: "January 15, 2023",
    description: "The GST Council has released the updated filing schedule for GSTR-1, GSTR-3B, and other GST returns.",
    category: "GST",
    content: "The due date for filing GSTR-1 for monthly filers is the 11th day of the subsequent month. For GSTR-3B, the due date for monthly filers is the 20th day of the subsequent month. For quarterly filers (under QRMP scheme), the due date for filing GSTR-1 is the 13th day of the month following the quarter."
  },
  {
    id: 3,
    title: "Changes in TDS Rates for FY 2023-24",
    date: "April 5, 2023",
    description: "The government has revised TDS rates for various income sources effective April 1, 2023.",
    category: "TDS",
    content: "TDS rate on rent payment for plant, machinery, or equipment reduced from 2% to 1%. TDS rate on transfer of immovable property (other than agricultural land) reduced from 1% to 0.5% if the consideration value doesn't exceed ₹50 lakhs. Enhanced TDS rate of 5% for non-filers of income tax returns continues to apply for specified payments."
  },
  {
    id: 4,
    title: "Extension of Due Dates for Tax Audit Reports",
    date: "August 10, 2023",
    description: "CBDT extends the due date for filing tax audit reports for AY 2023-24.",
    category: "Compliance",
    content: "The Central Board of Direct Taxes (CBDT) has extended the due date for filing tax audit reports under various sections of the Income Tax Act for Assessment Year 2023-24 from September 30, 2023, to October 15, 2023. This extension applies to tax audit reports under Section 44AB, 92E, and other relevant sections."
  },
  {
    id: 5,
    title: "Expansion of Faceless Assessment Scheme",
    date: "July 25, 2023",
    description: "Income Tax Department announces expansion of the faceless assessment and appeal scheme.",
    category: "Administration",
    content: "The Income Tax Department has expanded the scope of its faceless assessment and appeal scheme to include more types of cases and assessments. The scheme now covers assessment proceedings under sections 147 (income escaping assessment), 153A (search cases), and 153C (other person's possession of documents). The expansion aims to promote transparency and reduce physical interface between taxpayers and tax authorities."
  }
];

const TaxUpdates = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading new tax updates
    toast({
      title: "Tax Updates Loaded",
      description: "Latest tax updates have been loaded successfully.",
      duration: 3000,
    });
  }, [toast]);

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
          <h1 className="text-3xl font-bold text-tax-blue mb-8">Latest Tax Updates</h1>
          <p className="text-muted-foreground mb-8">
            Stay informed with the latest changes in Indian tax laws, GST notifications, and compliance requirements.
            This page is updated regularly with the most recent tax updates from various government departments.
          </p>
          
          <div className="space-y-6">
            {taxUpdates.map((update) => (
              <Card key={update.id} className="section-animate">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-tax-blue">{update.title}</CardTitle>
                    <Badge variant="outline" className="bg-tax-blue/10">{update.category}</Badge>
                  </div>
                  <CardDescription>{update.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">{update.description}</p>
                  <p className="text-sm text-muted-foreground">{update.content}</p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="text-xs text-muted-foreground">Source: Ministry of Finance, India</div>
                  <button className="text-sm text-tax-blue hover:underline">Read More</button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TaxUpdates;
