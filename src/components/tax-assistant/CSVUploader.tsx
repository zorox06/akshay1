
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileSpreadsheet } from "lucide-react";
import { GOOGLE_MAPS_API_KEY } from "@/utils/constants";
import { FinancialData, TaxCalculationResult } from "@/utils/taxCalculations";
import { useChat } from "@/contexts/ChatContext";

interface CSVUploaderProps {
  setIsProcessing: (isProcessing: boolean) => void;
  setCsvData: (data: FinancialData[] | null) => void;
  setCalculationResult: (result: TaxCalculationResult | null) => void;
  calculateTaxLiability: (data: FinancialData[]) => void;
}

export default function CSVUploader({ 
  setIsProcessing, 
  setCsvData, 
  setCalculationResult,
  calculateTaxLiability 
}: CSVUploaderProps) {
  const { toast } = useToast();
  const { addMessage } = useChat();
  const [csvError, setCsvError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.name.endsWith('.csv')) {
      setCsvError("Please upload a CSV file.");
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setCsvError(null);
    setIsProcessing(true);
    
    // Process the file
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      
      try {
        // Attempt to use the provided API key to process the CSV
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets:batchUpdate?key=${GOOGLE_MAPS_API_KEY}`;
        
        // First, try to validate the CSV format with the API
        // This is a simplified example - in a real app you'd handle the Google Sheets API correctly
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                pasteData: {
                  data: text,
                  type: 'PASTE_NORMAL',
                  delimiter: ',',
                }
              }
            ]
          })
        }).then(response => {
          // If the API fails or is not configured for this use case, fall back to local processing
          processCSVLocally(text);
        }).catch(error => {
          console.error("Error with Google Sheets API:", error);
          // Fall back to local processing
          processCSVLocally(text);
        });
      } catch (error) {
        console.error("Error processing CSV:", error);
        processCSVLocally(text);
      }
    };
    
    reader.onerror = () => {
      setCsvError("Failed to read the file.");
      setIsProcessing(false);
      toast({
        title: "File Reading Error",
        description: "Failed to read the CSV file.",
        variant: "destructive",
        duration: 3000,
      });
    };
    
    reader.readAsText(file);
  };

  const processCSVLocally = (text: string) => {
    try {
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const data: FinancialData[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const entry: FinancialData = {};
        
        for (let j = 0; j < headers.length; j++) {
          entry[headers[j].trim()] = values[j] ? values[j].trim() : '';
        }
        
        data.push(entry);
      }
      
      setCsvData(data);
      toast({
        title: "CSV Processing Complete",
        description: "Your financial data has been processed successfully.",
        duration: 3000,
      });
      calculateTaxLiability(data);
      
      // Generate AI suggestions based on CSV data
      generateAISuggestions(data);
    } catch (error) {
      console.error("CSV parsing error:", error);
      setCsvError("Invalid CSV format. Please check your file.");
      setIsProcessing(false);
      toast({
        title: "CSV Parsing Error",
        description: "Invalid CSV format. Please check your file.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const generateAISuggestions = (data: FinancialData[]) => {
    try {
      // Extract key financial values
      let totalIncome = 0;
      let totalDeductions = 0;
      let section80c = 0;
      let section80d = 0;
      let hra = 0;
      let lta = 0;
      
      data.forEach(entry => {
        if (entry.income) totalIncome += parseFloat(entry.income);
        if (entry.section80c) {
          section80c += parseFloat(entry.section80c);
          totalDeductions += parseFloat(entry.section80c);
        }
        if (entry.section80d) {
          section80d += parseFloat(entry.section80d);
          totalDeductions += parseFloat(entry.section80d);
        }
        if (entry.section80g) totalDeductions += parseFloat(entry.section80g);
        if (entry.hra) {
          hra += parseFloat(entry.hra);
          totalDeductions += parseFloat(entry.hra);
        }
        if (entry.lta) {
          lta += parseFloat(entry.lta);
          totalDeductions += parseFloat(entry.lta);
        }
      });
      
      // Generate personalized suggestions
      let suggestions = `Based on my analysis of your financial data, here are some tailored tax suggestions:\n\n`;
      
      // Income suggestions
      suggestions += `**Income Analysis (₹${totalIncome.toLocaleString('en-IN')}):**\n`;
      if (totalIncome > 1500000) {
        suggestions += `• Consider investing in National Pension Scheme (NPS) for additional tax benefits under Section 80CCD(1B).\n`;
        suggestions += `• Look into tax-free bonds to optimize your investment returns.\n`;
      } else if (totalIncome > 750000) {
        suggestions += `• You may benefit from the standard deduction of ₹50,000 available for salaried individuals.\n`;
      }
      
      // Section 80C suggestions
      suggestions += `\n**Section 80C (₹${section80c.toLocaleString('en-IN')}):**\n`;
      if (section80c < 150000) {
        suggestions += `• You have utilized only ₹${section80c.toLocaleString('en-IN')} out of the maximum ₹1,50,000 available under Section 80C.\n`;
        suggestions += `• Consider additional investments in PPF, ELSS funds, or tax-saving FDs to maximize your deduction.\n`;
      } else {
        suggestions += `• Great job! You've maximized your Section 80C deduction of ₹1,50,000.\n`;
      }
      
      // Health insurance suggestions
      suggestions += `\n**Medical Insurance (Section 80D - ₹${section80d.toLocaleString('en-IN')}):**\n`;
      if (section80d < 25000) {
        suggestions += `• Consider increasing your health insurance coverage to maximize benefits under Section 80D.\n`;
        suggestions += `• You can claim up to ₹25,000 for self and family, and an additional ₹25,000 for parents (₹50,000 if they are senior citizens).\n`;
      }
      
      // HRA suggestions
      if (hra > 0) {
        suggestions += `\n**HRA Benefits (₹${hra.toLocaleString('en-IN')}):**\n`;
        suggestions += `• Ensure you're claiming HRA benefits correctly by submitting rent receipts.\n`;
        suggestions += `• For metros, you can claim the minimum of: actual HRA received, 50% of basic salary, or rent paid minus 10% of basic salary.\n`;
      }
      
      // LTA suggestions
      if (lta > 0) {
        suggestions += `\n**LTA (₹${lta.toLocaleString('en-IN')}):**\n`;
        suggestions += `• Remember that LTA is exempt only for domestic travel, and only for the shortest route by air/rail/public transport.\n`;
        suggestions += `• Keep all travel documents as proof for LTA claims.\n`;
      }
      
      // Tax regime suggestion
      suggestions += `\n**Tax Regime Recommendation:**\n`;
      if (totalDeductions > 250000) {
        suggestions += `• With your substantial deductions of ₹${totalDeductions.toLocaleString('en-IN')}, the Old Tax Regime is likely more beneficial for you.\n`;
      } else {
        suggestions += `• With your current deduction level, you should compare both tax regimes. The New Tax Regime might be more favorable.\n`;
      }
      
      // Add AI message to chat
      addMessage(suggestions, 'ai');
      
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      addMessage("I couldn't analyze your CSV data fully. Please ensure your data includes income and deduction details in the correct format.", 'ai');
    }
  };

  return (
    <div>
      <div className="border-2 border-dashed border-tax-gray-medium rounded-lg p-6 text-center">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <FileSpreadsheet className="h-8 w-8 mb-2 text-tax-blue" />
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
      
      {csvError && (
        <div className="mt-4 p-3 bg-rose-100 border border-rose-200 rounded-md flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
          <span className="text-sm text-rose-700">{csvError}</span>
        </div>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>CSV Format: income,section80c,section80d,section80g,hra,lta</p>
        <p>Example: 1200000,150000,25000,10000,240000,60000</p>
      </div>
    </div>
  );
}
