
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const categories = [
  { id: "income-tax", name: "Income Tax" },
  { id: "gst", name: "GST" },
  { id: "tds", name: "TDS" },
  { id: "corporate-tax", name: "Corporate Tax" },
  { id: "international-tax", name: "International Tax" }
];

const taxLaws = {
  "income-tax": [
    {
      id: 1,
      title: "Section 80C - Deductions",
      description: "Deductions for investments and expenses up to ₹1,50,000",
      content: "Section 80C allows for deductions of up to ₹1,50,000 for various investments and expenses such as PPF, ELSS, Life Insurance Premium, Home Loan Principal Repayment, Tuition Fees, NSC, etc. This deduction is available only under the old tax regime."
    },
    {
      id: 2,
      title: "Section 80D - Medical Insurance",
      description: "Deductions for health insurance premiums",
      content: "Section 80D provides deductions for health insurance premiums paid for self, spouse, dependent children, and parents. The maximum deduction available is ₹25,000 for self and family, and an additional ₹25,000 for parents (₹50,000 if parents are senior citizens). This deduction is available only under the old tax regime."
    },
    {
      id: 3,
      title: "Section 87A - Tax Rebate",
      description: "Rebate for taxpayers with income up to ₹7,00,000",
      content: "Under Section 87A, taxpayers with a total income of up to ₹7,00,000 can claim a tax rebate of up to ₹25,000 under the new tax regime. Under the old tax regime, this rebate is available for income up to ₹5,00,000 with a maximum rebate of ₹12,500."
    }
  ],
  "gst": [
    {
      id: 1,
      title: "GST Registration Requirements",
      description: "Thresholds and conditions for mandatory GST registration",
      content: "GST registration is mandatory for businesses with an aggregate turnover exceeding ₹20 lakhs (₹10 lakhs for special category states). For suppliers engaged exclusively in the supply of goods, the threshold is ₹40 lakhs (₹20 lakhs for special category states). E-commerce operators and persons making inter-state supplies must register irrespective of turnover."
    },
    {
      id: 2,
      title: "GST Rate Structure",
      description: "Different GST slabs and applicable categories",
      content: "GST in India follows a multi-tier rate structure with slabs of 0%, 5%, 12%, 18%, and 28%. Essential goods are either exempt or taxed at lower rates, while luxury and demerit goods attract the highest rate along with a cess. Services generally fall under the 18% slab, with exceptions for specific categories."
    },
    {
      id: 3,
      title: "Input Tax Credit Rules",
      description: "Eligibility and conditions for claiming input tax credit",
      content: "Input Tax Credit (ITC) allows businesses to claim credit for taxes paid on inputs used for business purposes. To claim ITC, the recipient must have a valid tax invoice, must have received the goods/services, must have paid GST to the supplier, and must have filed returns. ITC is not available for certain specified goods and services, such as motor vehicles (with exceptions), food and beverages, outdoor catering, etc."
    }
  ],
  "tds": [
    {
      id: 1,
      title: "Section 194C - TDS on Contractor",
      description: "TDS on payments to contractors and sub-contractors",
      content: "TDS under Section 194C applies to payments to contractors and sub-contractors. The TDS rate is 1% for payment to individuals/HUFs and 2% for payment to others. No TDS is deducted if the single payment does not exceed ₹30,000 or the aggregate payment during the financial year does not exceed ₹1,00,000."
    },
    {
      id: 2,
      title: "Section 194J - TDS on Professional Fees",
      description: "TDS on professional and technical services",
      content: "TDS under Section 194J applies to payments for professional or technical services, royalty, non-compete fees, etc. The TDS rate is 10% (reduced to 2% for fees for technical services and royalty for a patent, trademark, call center). No TDS is deducted if the payment does not exceed ₹30,000 during the financial year."
    },
    {
      id: 3,
      title: "Section 194-IA - TDS on Immovable Property",
      description: "TDS on transfer of immovable property",
      content: "TDS under Section 194-IA applies to transfer of immovable property (other than agricultural land) for a consideration exceeding ₹50 lakhs. The TDS rate is 1% of the consideration. The buyer is responsible for deducting TDS at the time of payment or credit, whichever is earlier."
    }
  ],
  "corporate-tax": [
    {
      id: 1,
      title: "Corporate Tax Rates",
      description: "Tax rates applicable to different types of companies",
      content: "Domestic companies can opt for a concessional tax rate of 22% (effective rate 25.17% including surcharge and cess) under Section 115BAA, provided they forgo certain deductions and exemptions. New manufacturing companies can opt for a concessional tax rate of 15% (effective rate 17.16% including surcharge and cess) under Section 115BAB. For companies not opting for concessional rates, the tax rate is 30% (effective rate up to 34.94% including surcharge and cess) for companies with turnover exceeding ₹400 crores."
    },
    {
      id: 2,
      title: "Minimum Alternate Tax (MAT)",
      description: "MAT provisions to ensure minimum tax payment",
      content: "Minimum Alternate Tax (MAT) ensures that companies with substantial accounting profits but low taxable income due to deductions and exemptions pay a minimum tax. MAT is calculated at 15% of book profits (effective rate up to 17.47% including surcharge and cess). Companies opting for concessional tax rates under Section 115BAA or 115BAB are exempt from MAT. MAT credit can be carried forward and set off against normal tax liability for up to 15 years."
    },
    {
      id: 3,
      title: "Dividend Distribution Tax (DDT)",
      description: "Taxation of dividends distributed by companies",
      content: "Dividend Distribution Tax (DDT) has been abolished from April 1, 2020. Dividends are now taxable in the hands of the recipients at their applicable income tax rates. Companies are required to deduct TDS at the rate of 10% on dividend payments exceeding ₹5,000 in a financial year. This change aims to promote equity by taxing dividends based on the recipient's income tax slab."
    }
  ],
  "international-tax": [
    {
      id: 1,
      title: "Double Taxation Avoidance Agreements (DTAAs)",
      description: "India's tax treaties with other countries",
      content: "India has comprehensive Double Taxation Avoidance Agreements (DTAAs) with over 90 countries to prevent double taxation of income earned in one country by a resident of another country. These treaties provide relief through exemption, credit, or deduction methods. DTAAs override domestic tax laws when they provide more beneficial treatment to the taxpayer."
    },
    {
      id: 2,
      title: "Transfer Pricing Regulations",
      description: "Rules for international transactions between related entities",
      content: "Transfer Pricing regulations in India require that international transactions between associated enterprises be at arm's length price. Companies need to maintain documentation for such transactions and file an annual transfer pricing report if the aggregate value of international transactions exceeds ₹1 crore. Penalties for non-compliance range from 2% of the transaction value to 50-200% of the tax sought to be evaded."
    },
    {
      id: 3,
      title: "Place of Effective Management (POEM)",
      description: "Determining residential status of foreign companies",
      content: "Place of Effective Management (POEM) is a test to determine the residential status of foreign companies. A foreign company is considered resident in India if its POEM is in India. POEM refers to the place where key management and commercial decisions necessary for the conduct of the business as a whole are made. This concept aims to prevent tax avoidance by shell companies incorporated outside India but effectively managed from India."
    }
  ]
};

const TaxLaws = () => {
  const [activeCategory, setActiveCategory] = useState("income-tax");

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
          <h1 className="text-3xl font-bold text-tax-blue mb-8">Indian Tax Laws</h1>
          <p className="text-muted-foreground mb-8">
            Explore comprehensive information on various Indian tax laws and regulations.
            This guide provides detailed explanations of income tax provisions, GST rules, TDS requirements, and more.
          </p>
          
          <Tabs defaultValue="income-tax" onValueChange={setActiveCategory} className="w-full">
            <TabsList className="w-full grid grid-cols-5 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{category.name} Laws and Regulations</CardTitle>
                    <CardDescription>
                      Detailed information about {category.name.toLowerCase()} provisions and their applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {taxLaws[category.id as keyof typeof taxLaws].map((law) => (
                        <AccordionItem key={law.id} value={`item-${law.id}`}>
                          <AccordionTrigger className="text-left">
                            <div>
                              <div className="font-medium">{law.title}</div>
                              <div className="text-sm text-muted-foreground">{law.description}</div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2 text-muted-foreground">
                              {law.content}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TaxLaws;
