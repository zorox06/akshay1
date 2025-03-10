
import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, Calculator } from "lucide-react";

const predefinedResponses: Record<string, string> = {
  "deductions": "Based on your income details, you could claim deductions under Section 80C for your PPF contributions of ₹1,50,000, potentially saving ₹46,800 in taxes.",
  "home office": "You could qualify for a home office deduction of approximately ₹1,80,000 based on your consulting income and workspace details.",
  "gst": "Your business falls under the 18% GST slab. Based on your quarterly turnover, you need to file GSTR-1 and GSTR-3B by the 20th of next month.",
  "income tax": "For your income bracket of ₹12,50,000, the estimated tax liability is ₹1,87,500 after standard deduction and Section 80C investments.",
  "due date": "The due date for filing your ITR for AY 2023-24 is July 31, 2023. For GST returns, your next filing is due on 20th of next month.",
  "help": "I can help with tax deductions, GST filing, income tax calculations, and financial planning. What would you like to know about?"
};

// Indian tax slabs for FY 2023-24 (AY 2024-25)
const calculateTaxOldRegime = (income: number): number => {
  if (income <= 250000) return 0;
  if (income <= 500000) return (income - 250000) * 0.05;
  if (income <= 750000) return 12500 + (income - 500000) * 0.1;
  if (income <= 1000000) return 37500 + (income - 750000) * 0.15;
  if (income <= 1250000) return 75000 + (income - 1000000) * 0.2;
  if (income <= 1500000) return 125000 + (income - 1250000) * 0.25;
  return 187500 + (income - 1500000) * 0.3;
};

// New tax regime FY 2023-24
const calculateTaxNewRegime = (income: number): number => {
  if (income <= 300000) return 0;
  if (income <= 600000) return (income - 300000) * 0.05;
  if (income <= 900000) return 15000 + (income - 600000) * 0.1;
  if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
  if (income <= 1500000) return 90000 + (income - 1200000) * 0.2;
  return 150000 + (income - 1500000) * 0.3;
};

export default function TaxAssistant() {
  const [input, setInput] = useState('');
  const { messages, addMessage } = useChat();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const [calculationResult, setCalculationResult] = useState<{
    oldRegimeTax: number;
    newRegimeTax: number;
    recommendation: string;
  } | null>(null);
  const [isUploadMode, setIsUploadMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    addMessage(input, 'user');
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Check for keywords in the user input
      const userInput = input.toLowerCase();
      let response = "I'm not sure how to help with that specific query. Would you like information about tax deductions, GST filing, or income tax calculations?";
      
      // Check for keywords in predefined responses
      for (const [keyword, reply] of Object.entries(predefinedResponses)) {
        if (userInput.includes(keyword)) {
          response = reply;
          break;
        }
      }
      
      // Add AI response
      addMessage(response, 'ai');
      setIsProcessing(false);
      
      toast({
        title: "New tax recommendation",
        description: "Check out our latest analysis for your tax situation",
        duration: 5000,
      });
    }, 1500);
    
    setInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCSV(text);
    };
    reader.readAsText(file);
  };

  const processCSV = (text: string) => {
    setIsProcessing(true);
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      const entry: Record<string, string> = {};
      
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j].trim()] = values[j] ? values[j].trim() : '';
      }
      
      data.push(entry);
    }
    
    setCsvData(data);
    calculateTaxLiability(data);
  };

  const calculateTaxLiability = (data: any[]) => {
    // Simple implementation - assuming CSV has 'income', 'section80c', etc.
    let totalIncome = 0;
    let totalDeductions = 0;
    
    // Extract data from CSV
    data.forEach(entry => {
      if (entry.income) totalIncome += parseFloat(entry.income);
      if (entry.section80c) totalDeductions += parseFloat(entry.section80c);
      if (entry.section80d) totalDeductions += parseFloat(entry.section80d);
      // Add more sections as needed
    });
    
    // Calculate taxable income
    const taxableIncomeOldRegime = Math.max(0, totalIncome - totalDeductions);
    const taxableIncomeNewRegime = totalIncome; // No deductions in new regime
    
    // Calculate tax for both regimes
    const oldRegimeTax = calculateTaxOldRegime(taxableIncomeOldRegime);
    const newRegimeTax = calculateTaxNewRegime(taxableIncomeNewRegime);
    
    // Determine which regime is better
    const recommendation = oldRegimeTax <= newRegimeTax 
      ? "Based on your income and deductions, the Old Tax Regime is more beneficial for you."
      : "Based on your income and deductions, the New Tax Regime is more beneficial for you.";
    
    setCalculationResult({
      oldRegimeTax,
      newRegimeTax,
      recommendation
    });
    
    // Add message to chat
    addMessage(`I've uploaded my financial data for tax calculation.`, 'user');
    addMessage(`I've analyzed your financial data:\n\n1. Old Regime Tax: ₹${oldRegimeTax.toLocaleString('en-IN')}\n2. New Regime Tax: ₹${newRegimeTax.toLocaleString('en-IN')}\n\n${recommendation}`, 'ai');
    
    setIsProcessing(false);
    
    toast({
      title: "Tax Calculation Complete",
      description: "View your tax calculation results in the chat",
      duration: 5000,
    });
  };

  const toggleMode = () => {
    setIsUploadMode(!isUploadMode);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-xs"
          onClick={toggleMode}
        >
          {isUploadMode ? (
            <>
              <Calculator className="h-3 w-3" /> Chat Mode
            </>
          ) : (
            <>
              <Upload className="h-3 w-3" /> Upload CSV
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="bg-tax-gray-dark p-3 rounded-lg">
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full ${message.role === 'ai' ? 'bg-tax-blue text-tax-gray-dark' : 'bg-tax-gray-medium text-foreground'} flex items-center justify-center text-sm shrink-0`}>
                {message.role === 'ai' ? 'AI' : 'You'}
              </div>
              <div className="ml-3">
                <p className="text-sm text-foreground whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="bg-tax-gray-dark p-3 rounded-lg animate-pulse">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-tax-blue flex items-center justify-center text-tax-gray-dark font-medium text-sm shrink-0">
                AI
              </div>
              <div className="ml-3 flex space-x-1">
                <div className="h-2 w-2 bg-tax-blue rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-tax-blue rounded-full animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-tax-blue rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isUploadMode ? (
        <div className="mt-4">
          <div className="border-2 border-dashed border-tax-gray-medium rounded-lg p-6 text-center">
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <Upload className="h-8 w-8 mb-2 text-tax-blue" />
              <span className="text-sm text-foreground mb-2">Upload your financial CSV file</span>
              <span className="text-xs text-muted-foreground mb-4">Include income, deductions, and investments</span>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <Button variant="default" className="bg-tax-blue text-tax-gray-dark">
                Select CSV File
              </Button>
            </label>
          </div>
          
          {calculationResult && (
            <div className="mt-4 p-4 bg-tax-gray-dark rounded-lg">
              <h3 className="text-sm font-medium mb-2">Tax Calculation Results</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="p-3 bg-tax-gray-medium rounded-md">
                  <p className="text-xs text-muted-foreground">Old Regime Tax</p>
                  <p className="text-sm font-semibold">₹{calculationResult.oldRegimeTax.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-tax-gray-medium rounded-md">
                  <p className="text-xs text-muted-foreground">New Regime Tax</p>
                  <p className="text-sm font-semibold">₹{calculationResult.newRegimeTax.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Recommendation</p>
              <p className="text-sm">{calculationResult.recommendation}</p>
            </div>
          )}
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>CSV Format: income,section80c,section80d,houseRentPaid,housingLoanInterest</p>
            <p>Example: 1200000,150000,25000,240000,200000</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tax deductions..." 
            className="flex-1 px-4 py-2 bg-tax-gray-dark rounded-l-lg text-sm border-0 focus:ring-0 focus:outline-none text-foreground" 
          />
          <button 
            type="submit"
            disabled={isProcessing}
            className="bg-tax-blue text-tax-gray-dark px-4 py-2 rounded-r-lg text-sm font-medium"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
