
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// Static tax updates data
const taxUpdates = [
  {
    id: 1,
    title: "Union Budget 2025-26 Tax Implications",
    date: "February 1, 2025",
    description: "The Union Budget 2025-26 introduces significant changes to income tax rates and slabs with focus on the new tax regime.",
    category: "Budget",
    content: "The Finance Minister announced in the Union Budget 2025-26 that the tax rebate limit under the new tax regime will remain at ₹7 lakh. Standard deduction has been increased from ₹50,000 to ₹75,000. The income tax slabs have been rationalized with higher exemption thresholds. Additional tax benefits have been introduced for investments in specified government schemes."
  },
  {
    id: 2,
    title: "Revised GST Filing Calendar for FY 2025-26",
    date: "March 10, 2025",
    description: "GST Council has released the updated filing schedule for all GST returns applicable in the financial year 2025-26.",
    category: "GST",
    content: "The GST Council has streamlined the return filing process. For GSTR-1, monthly filers must submit by the 11th day of the subsequent month. GSTR-3B is due by the 20th day of the subsequent month for monthly filers. Quarterly filers under the QRMP scheme must file GSTR-1 by the 13th day of the month following the quarter. The council has also introduced an amnesty scheme for clearing pending returns with reduced late fees until September 30, 2025."
  },
  {
    id: 3,
    title: "Revised TDS/TCS Rates for FY 2025-26",
    date: "April 1, 2025",
    description: "The government has notified revised TDS/TCS rates for various transactions effective April 1, 2025.",
    category: "TDS",
    content: "TDS rates for professional services have been rationalized at 7.5% (reduced from 10%). TDS on e-commerce transactions has been standardized at 1% across all categories. TDS on property transactions valued over ₹75 lakhs has been increased to 2%. The higher rate of TDS/TCS for non-filers of income tax returns has been reduced from 5% to 3% for specified transactions to encourage compliance."
  },
  {
    id: 4,
    title: "Extended Due Dates for Tax Audit and ITR Filing",
    date: "July 15, 2025",
    description: "CBDT extends the due dates for tax audit reports and ITR filing for AY 2025-26.",
    category: "Compliance",
    content: "The Central Board of Direct Taxes has extended the due date for filing tax audit reports under Section 44AB for Assessment Year 2025-26 from September 30, 2025, to October 31, 2025. The due date for filing ITRs for taxpayers requiring audit has been extended to November 30, 2025. Additionally, the due date for transfer pricing audit reports under Section 92E has been extended to November 15, 2025."
  },
  {
    id: 5,
    title: "New Digital Initiatives in Tax Administration",
    date: "May 20, 2025",
    description: "Income Tax Department launches new digital initiatives to enhance taxpayer services.",
    category: "Administration",
    content: "The Income Tax Department has launched a new mobile app 'TaxEase' for real-time tax payment and refund tracking. The e-filing 2.0 portal has been enhanced with AI-powered assistance for ITR filing. Pre-filled ITR forms now include capital gains data from multiple sources. The faceless assessment scheme has been further expanded to cover all regular assessment cases. The department has also introduced blockchain-based document verification for faster processing of refunds."
  },
  {
    id: 6,
    title: "Introduction of Tax Incentives for Green Energy",
    date: "June 5, 2025",
    description: "New tax incentives announced for investments in renewable energy and electric vehicles.",
    category: "Tax Incentives",
    content: "Under the new climate-focused tax initiatives, additional deduction of up to ₹50,000 is available for investments in specified green bonds. Businesses can claim accelerated depreciation at 40% for renewable energy equipment. Electric vehicle purchases are eligible for an additional income tax deduction of up to ₹1.5 lakhs on interest paid on loans. Corporate tax rate has been reduced by 5% for companies deriving more than 40% of their income from renewable energy operations."
  }
];

const OfficialUpdatesSection = () => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-tax-blue mb-4">Official Tax Updates</h2>
      
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
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
  );
};

export default OfficialUpdatesSection;
