
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useChat } from "@/contexts/ChatContext";
import { FinancialData, TaxCalculationResult } from "@/utils/taxCalculations";
import { FileUploadUI } from './FileUploadUI';
import { processCSVWithML } from '@/utils/csvMLProcessor';
import { processCSVLocally } from '@/utils/csvLocalProcessor';
import { generateAISuggestions } from '@/utils/aiSuggestionGenerator';

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
  const [isMLProcessing, setIsMLProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setIsMLProcessing(true);
    
    // Process the file
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      await processCSV(text);
    };
    
    reader.onerror = () => {
      setCsvError("Failed to read the file.");
      setIsProcessing(false);
      setIsMLProcessing(false);
      toast({
        title: "File Reading Error",
        description: "Failed to read the CSV file.",
        variant: "destructive",
        duration: 3000,
      });
    };
    
    reader.readAsText(file);
  };

  const processCSV = async (text: string) => {
    try {
      // First try with ML processing
      const mlProcessedData = await processCSVWithML(text, toast, addMessage);
      
      if (mlProcessedData) {
        // ML processing succeeded
        finishProcessing(mlProcessedData);
      } else {
        // Fall back to local processing
        const localProcessedData = processCSVLocally(text, toast);
        if (localProcessedData) {
          finishProcessing(localProcessedData);
        } else {
          throw new Error("Both ML and local processing failed");
        }
      }
    } catch (error) {
      console.error("Processing error:", error);
      setCsvError("Error processing the file. Please check your file format.");
      setIsProcessing(false);
      setIsMLProcessing(false);
    }
  };

  const finishProcessing = (data: FinancialData[]) => {
    setCsvData(data);
    calculateTaxLiability(data);
    generateAISuggestions(data, addMessage);
    setIsMLProcessing(false);
  };

  return (
    <div>
      <FileUploadUI 
        onFileChange={handleFileUpload} 
        isMLProcessing={isMLProcessing} 
        csvError={csvError} 
      />
    </div>
  );
}
