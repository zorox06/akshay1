
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

// Static tax updates data
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

const OfficialUpdatesSection = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-tax-blue mb-4">Official Tax Updates</h2>
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
