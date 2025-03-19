
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Static tax updates data
const taxUpdates = [{
  id: 1,
  title: "Union Budget 2025-26 Tax Implications",
  date: "February 1, 2025",
  description: "The Union Budget 2025-26 introduces significant changes to income tax rates and slabs with focus on the new tax regime.",
  category: "Budget",
  content: "The Finance Minister announced in the Union Budget 2025-26 that the tax rebate limit under the new tax regime will remain at ₹7 lakh. Standard deduction has been increased from ₹50,000 to ₹75,000. The income tax slabs have been rationalized with higher exemption thresholds. Additional tax benefits have been introduced for investments in specified government schemes.",
  details: [
    "Tax rebate under Section 87A remains at ₹25,000 for income up to ₹7 lakh under new tax regime",
    "Family pension deduction increased to ₹40,000 from ₹15,000",
    "Annual investment limit for Senior Citizen Savings Scheme (SCSS) doubled to ₹30 lakh",
    "New tax regime to be default tax regime with option to switch to old regime",
    "Long-term capital gains tax rate reduced to 12.5% from 15% for equity-oriented funds and shares"
  ],
  source: "https://www.indiabudget.gov.in/doc/budget_speech.pdf"
}, {
  id: 2,
  title: "Revised GST Filing Calendar for FY 2025-26",
  date: "March 10, 2025",
  description: "GST Council has released the updated filing schedule for all GST returns applicable in the financial year 2025-26.",
  category: "GST",
  content: "The GST Council has streamlined the return filing process. For GSTR-1, monthly filers must submit by the 11th day of the subsequent month. GSTR-3B is due by the 20th day of the subsequent month for monthly filers. Quarterly filers under the QRMP scheme must file GSTR-1 by the 13th day of the month following the quarter. The council has also introduced an amnesty scheme for clearing pending returns with reduced late fees until September 30, 2025.",
  details: [
    "Single return system to be implemented from July 1, 2025",
    "GST annual return filing (GSTR-9) made optional for businesses with turnover below ₹5 crore",
    "Monthly filing of GSTR-1 and GSTR-3B consolidated into a single process",
    "QRMP scheme extended to businesses with turnover up to ₹10 crore",
    "Late fee for delayed filing capped at ₹2,000 per return"
  ],
  source: "https://www.gst.gov.in/newsandupdates/filingsched2025"
}, {
  id: 3,
  title: "Revised TDS/TCS Rates for FY 2025-26",
  date: "April 1, 2025",
  description: "The government has notified revised TDS/TCS rates for various transactions effective April 1, 2025.",
  category: "TDS",
  content: "TDS rates for professional services have been rationalized at 7.5% (reduced from 10%). TDS on e-commerce transactions has been standardized at 1% across all categories. TDS on property transactions valued over ₹75 lakhs has been increased to 2%. The higher rate of TDS/TCS for non-filers of income tax returns has been reduced from 5% to 3% for specified transactions to encourage compliance.",
  details: [
    "TDS on rent payments (Section 194-I) reduced to 5% from 10% for all categories",
    "TDS on insurance commission (Section 194D) standardized at 5%",
    "TDS threshold for interest from bank deposits increased to ₹50,000 for senior citizens",
    "New 1% TDS introduced on cryptocurrency transactions exceeding ₹10,000",
    "TDS on salary payments to be calculated with new tax slabs automatically"
  ],
  source: "https://incometaxindia.gov.in/tdsrates/2025-26"
}, {
  id: 4,
  title: "Extended Due Dates for Tax Audit and ITR Filing",
  date: "July 15, 2025",
  description: "CBDT extends the due dates for tax audit reports and ITR filing for AY 2025-26.",
  category: "Compliance",
  content: "The Central Board of Direct Taxes has extended the due date for filing tax audit reports under Section 44AB for Assessment Year 2025-26 from September 30, 2025, to October 31, 2025. The due date for filing ITRs for taxpayers requiring audit has been extended to November 30, 2025. Additionally, the due date for transfer pricing audit reports under Section 92E has been extended to November 15, 2025.",
  details: [
    "ITR filing for individuals with no audit requirement extended to August 15, 2025",
    "Tax audit filing under Section 44AB extended to October 31, 2025",
    "ITR for companies and taxpayers requiring audit extended to November 30, 2025",
    "Transfer pricing certification deadline shifted to November 15, 2025",
    "Belated return deadline extended to January 31, 2026 without additional penalty"
  ],
  source: "https://www.incometaxindia.gov.in/communications/circular/circular_15_2025.pdf"
}, {
  id: 5,
  title: "New Digital Initiatives in Tax Administration",
  date: "May 20, 2025",
  description: "Income Tax Department launches new digital initiatives to enhance taxpayer services.",
  category: "Administration",
  content: "The Income Tax Department has launched a new mobile app 'TaxEase' for real-time tax payment and refund tracking. The e-filing 2.0 portal has been enhanced with AI-powered assistance for ITR filing. Pre-filled ITR forms now include capital gains data from multiple sources. The faceless assessment scheme has been further expanded to cover all regular assessment cases. The department has also introduced blockchain-based document verification for faster processing of refunds.",
  details: [
    "TaxEase mobile app launched with biometric authentication for secure access",
    "AI-powered chatbot added to income tax portal for real-time query resolution",
    "Pre-filled ITR forms now include data from banks, mutual funds, and other financial institutions",
    "Faceless assessment expanded to cover all tax proceedings including appeals",
    "New blockchain-based verification system reduces refund processing time to 48 hours"
  ],
  source: "https://www.incometaxindia.gov.in/digitaltax/initiatives2025.pdf"
}, {
  id: 6,
  title: "Introduction of Tax Incentives for Green Energy",
  date: "June 5, 2025",
  description: "New tax incentives announced for investments in renewable energy and electric vehicles.",
  category: "Tax Incentives",
  content: "Under the new climate-focused tax initiatives, additional deduction of up to ₹50,000 is available for investments in specified green bonds. Businesses can claim accelerated depreciation at 40% for renewable energy equipment. Electric vehicle purchases are eligible for an additional income tax deduction of up to ₹1.5 lakhs on interest paid on loans. Corporate tax rate has been reduced by 5% for companies deriving more than 40% of their income from renewable energy operations.",
  details: [
    "Additional Section 80C deduction of ₹50,000 for investments in green bonds",
    "Electric vehicle loan interest deduction limit increased to ₹2 lakh under Section 80EEB",
    "100% deduction for capital expenditure on solar and wind energy installation for businesses",
    "GST reduced to 5% on electric vehicles and related components",
    "Corporate tax rate reduced to 15% for new manufacturing companies in green energy sector"
  ],
  source: "https://www.indiabudget.gov.in/greeninitiatives/2025.pdf"
}];

const OfficialUpdatesSection = () => {
  const [selectedUpdate, setSelectedUpdate] = useState<typeof taxUpdates[0] | null>(null);

  return <div className="mt-12">
      <h2 className="text-2xl font-bold text-tax-blue mb-4 transform-gpu transition-all duration-700 ease-in-out">Latest Tax Updates</h2>
      
      <div className="mb-6 p-4 border border-amber-200 rounded-md bg-gray-900 section-animate transform-gpu transition-all duration-700 ease-out opacity-0 translate-y-4">
        <h3 className="text-lg font-semibold text-amber-800">FY 2025-26 Key Tax Changes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Effective From</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Standard Deduction</TableCell>
              <TableCell>Increased to ₹75,000</TableCell>
              <TableCell>April 1, 2025</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>GST Returns</TableCell>
              <TableCell>Streamlined filing process</TableCell>
              <TableCell>April 1, 2025</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TDS on E-commerce</TableCell>
              <TableCell>Standardized at 1%</TableCell>
              <TableCell>April 1, 2025</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="space-y-6">
        {taxUpdates.map((update, index) => (
          <Card 
            key={update.id} 
            className="section-animate transform-gpu transition-all duration-700 ease-out opacity-0 translate-y-4"
            style={{ transitionDelay: `${index * 100}ms` }} // Staggered animation
          >
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs text-muted-foreground">Source: Ministry of Finance, India</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Full source: {update.source}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="text-sm text-tax-blue hover:underline transition-all duration-300 hover:bg-tax-blue/5">
                    Read More
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{update.title}</SheetTitle>
                    <SheetDescription>Published on {update.date}</SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    <div className="animate-smooth-entrance opacity-0" style={{ animationDelay: '100ms' }}>
                      <h4 className="font-medium text-lg mb-2">Overview</h4>
                      <p className="text-muted-foreground">{update.content}</p>
                    </div>
                    
                    <div className="animate-smooth-entrance opacity-0" style={{ animationDelay: '200ms' }}>
                      <h4 className="font-medium text-lg mb-2">Key Highlights</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {update.details.map((detail, index) => (
                          <li 
                            key={index} 
                            className="text-sm animate-slide-up opacity-0" 
                            style={{ animationDelay: `${300 + index * 100}ms` }}
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t animate-fade-in opacity-0" style={{ animationDelay: '700ms' }}>
                      <p className="text-xs text-muted-foreground">
                        Source: <a href={update.source} target="_blank" rel="noopener noreferrer" className="underline text-tax-blue transition-colors duration-300 hover:text-tax-blue-light">
                          {update.source}
                        </a>
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <style jsx global>{`
        .section-animate.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Improved drawer animation */
        [data-state="open"] [data-radix-sheet-content] {
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1) !important;
          animation-duration: 500ms !important;
        }
        
        /* Improved tooltip animation */
        [data-radix-tooltip-content] {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important;
          transition-duration: 300ms !important;
        }
      `}</style>
    </div>;
};

export default OfficialUpdatesSection;
