
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileSpreadsheet } from "lucide-react";
import { GOOGLE_MAPS_API_KEY } from "@/utils/constants";
import { FinancialData, TaxCalculationResult } from "@/utils/taxCalculations";

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
