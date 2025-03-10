import { useState, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, Calculator, MapPin, FileSpreadsheet, AlertCircle } from "lucide-react";

// Updated Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyB1i3OK0PF3Az3-WS2QcM_Y_zzCMyxgvuM";

// State-specific tax rules (simplified for demo)
const stateTaxRules: Record<string, { 
  additionalTaxRate: number, 
  specialDeductions: string[],
  gstThresholds: Record<string, string>
}> = {
  "Delhi": { 
    additionalTaxRate: 0.01, 
    specialDeductions: ["Metro travel allowance up to ₹1,600/month"],
    gstThresholds: { "Services": "₹20 Lakhs", "Goods": "₹40 Lakhs" }
  },
  "Maharashtra": { 
    additionalTaxRate: 0.02, 
    specialDeductions: ["Professional Tax deduction up to ₹2,500/year"],
    gstThresholds: { "Services": "₹20 Lakhs", "Goods": "₹40 Lakhs" }
  },
  "Karnataka": { 
    additionalTaxRate: 0.015, 
    specialDeductions: ["Rent allowance special deduction up to ₹3,000/month in Bangalore"],
    gstThresholds: { "Services": "₹20 Lakhs", "Goods": "₹40 Lakhs" }
  },
  "Tamil Nadu": { 
    additionalTaxRate: 0.0125, 
    specialDeductions: ["Entertainment tax exemption up to ₹6,000/year"],
    gstThresholds: { "Services": "₹20 Lakhs", "Goods": "₹40 Lakhs" }
  },
  "Gujarat": { 
    additionalTaxRate: 0.01, 
    specialDeductions: ["Special economic zone tax benefits"],
    gstThresholds: { "Services": "₹20 Lakhs", "Goods": "₹40 Lakhs" }
  }
};

const predefinedResponses: Record<string, string> = {
  "deductions": "Based on your income details, you could claim deductions under Section 80C for your PPF contributions of ₹1,50,000, potentially saving ₹46,800 in taxes.",
  "home office": "You could qualify for a home office deduction of approximately ₹1,80,000 based on your consulting income and workspace details.",
  "gst": "Your business falls under the 18% GST slab. Based on your quarterly turnover, you need to file GSTR-1 and GSTR-3B by the 20th of next month.",
  "income tax": "For your income bracket of ₹12,50,000, the estimated tax liability is ₹1,87,500 after standard deduction and Section 80C investments.",
  "due date": "The due date for filing your ITR for AY 2023-24 is July 31, 2023. For GST returns, your next filing is due on 20th of next month.",
  "help": "I can help with tax deductions, GST filing, income tax calculations, and financial planning. What would you like to know about?"
};

// Indian tax slabs for FY 2023-24 (AY 2024-25)
const calculateTaxOldRegime = (income: number, stateAdditionalTax: number = 0): number => {
  let baseTax = 0;
  
  if (income <= 250000) baseTax = 0;
  else if (income <= 500000) baseTax = (income - 250000) * 0.05;
  else if (income <= 750000) baseTax = 12500 + (income - 500000) * 0.1;
  else if (income <= 1000000) baseTax = 37500 + (income - 750000) * 0.15;
  else if (income <= 1250000) baseTax = 75000 + (income - 1000000) * 0.2;
  else if (income <= 1500000) baseTax = 125000 + (income - 1250000) * 0.25;
  else baseTax = 187500 + (income - 1500000) * 0.3;
  
  // Add state-specific additional tax if applicable
  return baseTax + (income * stateAdditionalTax);
};

// New tax regime FY 2023-24
const calculateTaxNewRegime = (income: number, stateAdditionalTax: number = 0): number => {
  let baseTax = 0;
  
  if (income <= 300000) baseTax = 0;
  else if (income <= 600000) baseTax = (income - 300000) * 0.05;
  else if (income <= 900000) baseTax = 15000 + (income - 600000) * 0.1;
  else if (income <= 1200000) baseTax = 45000 + (income - 900000) * 0.15;
  else if (income <= 1500000) baseTax = 90000 + (income - 1200000) * 0.2;
  else baseTax = 150000 + (income - 1500000) * 0.3;
  
  // Add state-specific additional tax if applicable
  return baseTax + (income * stateAdditionalTax);
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
    stateSpecificNotes?: string[];
  } | null>(null);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);

  // Detect user's state based on coordinates
  const detectUserLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            
            const data = await response.json();
            
            if (data.status === "REQUEST_DENIED") {
              throw new Error("API access denied: " + (data.error_message || "No details provided"));
            }
            
            if (data.results && data.results.length > 0) {
              // Find the state from the address components
              const addressComponents = data.results[0].address_components;
              const stateComponent = addressComponents.find(
                (component: any) => component.types.includes("administrative_area_level_1")
              );
              
              if (stateComponent) {
                const state = stateComponent.long_name;
                setUserLocation(state);
                
                toast({
                  title: "Location Detected",
                  description: `Your location: ${state}`,
                  duration: 3000,
                });
              }
            }
          } catch (error) {
            console.error("Error getting location:", error);
            toast({
              title: "Location Detection Failed",
              description: "Could not determine your location. Using default tax calculations.",
              duration: 3000,
            });
          } finally {
            setIsDetectingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsDetectingLocation(false);
          toast({
            title: "Location Access Denied",
            description: "Please enable location access for state-specific tax information.",
            duration: 3000,
          });
        }
      );
    } else {
      setIsDetectingLocation(false);
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    // If we have location and calculation results, update the calculation with state-specific data
    if (userLocation && calculationResult) {
      // Find if we have specific tax rules for this state
      const stateKey = Object.keys(stateTaxRules).find(
        state => userLocation.includes(state)
      );
      
      if (stateKey) {
        calculateTaxLiability(csvData || []);
      }
    }
  }, [userLocation]);

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
      toast({
        title: "CSV Processing Complete",
        description: "Your financial data has been processed successfully.",
        duration: 3000,
      });
      calculateTaxLiability(data);
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

  const calculateTaxLiability = (data: any[]) => {
    setIsProcessing(true);
    
    // Simple implementation - assuming CSV has 'income', 'section80c', etc.
    let totalIncome = 0;
    let totalDeductions = 0;
    
    try {
      // Extract data from CSV
      data.forEach(entry => {
        if (entry.income) totalIncome += parseFloat(entry.income);
        if (entry.section80c) totalDeductions += parseFloat(entry.section80c);
        if (entry.section80d) totalDeductions += parseFloat(entry.section80d);
        if (entry.section80g) totalDeductions += parseFloat(entry.section80g);
        if (entry.hra) totalDeductions += parseFloat(entry.hra);
        if (entry.lta) totalDeductions += parseFloat(entry.lta);
        // Add more sections as needed
      });
      
      // Calculate taxable income
      const taxableIncomeOldRegime = Math.max(0, totalIncome - totalDeductions);
      const taxableIncomeNewRegime = totalIncome; // No deductions in new regime
      
      // Find if we have specific tax rules for this state
      let stateAdditionalTaxRate = 0;
      let stateSpecificNotes: string[] = [];
      
      if (userLocation) {
        const stateKey = Object.keys(stateTaxRules).find(
          state => userLocation.includes(state)
        );
        
        if (stateKey) {
          const stateRules = stateTaxRules[stateKey];
          stateAdditionalTaxRate = stateRules.additionalTaxRate;
          stateSpecificNotes = [
            `${stateKey} additional tax rate: ${stateRules.additionalTaxRate * 100}%`,
            ...stateRules.specialDeductions.map(deduction => `Available deduction: ${deduction}`),
            `GST registration thresholds in ${stateKey}: ${Object.entries(stateRules.gstThresholds).map(([type, threshold]) => `${type} - ${threshold}`).join(', ')}`
          ];
        }
      }
      
      // Calculate tax for both regimes with state-specific additional tax if available
      const oldRegimeTax = calculateTaxOldRegime(taxableIncomeOldRegime, stateAdditionalTaxRate);
      const newRegimeTax = calculateTaxNewRegime(taxableIncomeNewRegime, stateAdditionalTaxRate);
      
      // Determine which regime is better
      const recommendation = oldRegimeTax <= newRegimeTax 
        ? `Based on your income of ₹${totalIncome.toLocaleString('en-IN')} and deductions of ₹${totalDeductions.toLocaleString('en-IN')}${userLocation ? ` in ${userLocation}` : ''}, the Old Tax Regime is more beneficial for you.`
        : `Based on your income of ₹${totalIncome.toLocaleString('en-IN')} and deductions of ₹${totalDeductions.toLocaleString('en-IN')}${userLocation ? ` in ${userLocation}` : ''}, the New Tax Regime is more beneficial for you.`;
      
      setCalculationResult({
        oldRegimeTax,
        newRegimeTax,
        recommendation,
        stateSpecificNotes: stateSpecificNotes.length > 0 ? stateSpecificNotes : undefined
      });
      
      // Add message to chat
      addMessage(`I've uploaded my financial data for tax calculation.`, 'user');
      
      let aiResponseMessage = `I've analyzed your financial data:\n\n1. Total Income: ₹${totalIncome.toLocaleString('en-IN')}\n2. Total Deductions: ₹${totalDeductions.toLocaleString('en-IN')}\n3. Old Regime Tax: ₹${oldRegimeTax.toLocaleString('en-IN')}\n4. New Regime Tax: ₹${newRegimeTax.toLocaleString('en-IN')}\n\n${recommendation}`;
      
      if (stateSpecificNotes.length > 0) {
        aiResponseMessage += `\n\n${userLocation} specific information:\n${stateSpecificNotes.map(note => `• ${note}`).join('\n')}`;
      }
      
      addMessage(aiResponseMessage, 'ai');
      
      setCsvError(null);
    } catch (error) {
      console.error("Error calculating tax:", error);
      setCsvError("Error in tax calculation. Please check your CSV format.");
      toast({
        title: "Calculation Error",
        description: "Error calculating taxes. Please verify your CSV data format.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
      
      if (!csvError) {
        toast({
          title: "Tax Calculation Complete",
          description: "View your tax calculation results in the chat",
          duration: 5000,
        });
      }
    }
  };

  const toggleMode = () => {
    setIsUploadMode(!isUploadMode);
    setCsvError(null);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end gap-2 mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-xs"
          onClick={detectUserLocation}
          disabled={isDetectingLocation}
        >
          <MapPin className="h-3 w-3" />
          {isDetectingLocation ? "Detecting..." : userLocation ? "Location: " + userLocation : "Detect Location"}
        </Button>
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
              <FileSpreadsheet className="h-3 w-3" /> Upload CSV
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
          
          {calculationResult && !csvError && (
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
              
              {calculationResult.stateSpecificNotes && (
                <>
                  <p className="text-xs text-muted-foreground mt-3">State-Specific Information</p>
                  <ul className="text-sm space-y-1">
                    {calculationResult.stateSpecificNotes.map((note, index) => (
                      <li key={index} className="text-sm">• {note}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>CSV Format: income,section80c,section80d,section80g,hra,lta</p>
            <p>Example: 1200000,150000,25000,10000,240000,60000</p>
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
