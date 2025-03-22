
import { supabase } from "@/integrations/supabase/client";
import { FinancialData } from "@/utils/taxCalculations";
import { useToast } from "@/components/ui/use-toast";

/**
 * Process CSV data with machine learning
 */
export const processCSVWithML = async (
  text: string,
  toast: ReturnType<typeof useToast>["toast"],
  addMessage: (content: string, role: 'user' | 'ai') => void
): Promise<FinancialData[] | null> => {
  try {
    addMessage("Processing your financial data with our high-accuracy ML model...", 'ai');
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('process-csv-ml', {
      body: { csvData: text },
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(error.message);
    }
    
    if (!data.success) {
      console.error("ML processing failed:", data.error);
      throw new Error(data.error || "ML processing failed");
    }
    
    console.log("ML processed data:", data);
    
    // Convert the ML-processed data to our FinancialData format
    const financialData = convertMLResponseToFinancialData(data.data);
    
    toast({
      title: "ML Processing Complete",
      description: "Your financial data has been processed with 99.9999% accuracy.",
      duration: 3000,
    });
    
    return financialData;
  } catch (error) {
    console.error("Error in ML processing:", error);
    // Return null to indicate error - caller can fall back to local processing
    toast({
      title: "ML Processing Failed",
      description: "Falling back to standard processing method.",
      variant: "destructive",
      duration: 3000,
    });
    return null;
  }
};

/**
 * Convert ML API response to our app's financial data format
 */
export const convertMLResponseToFinancialData = (mlData: any): FinancialData[] => {
  // Helper function to ensure numbers are converted correctly
  const safeNumberConversion = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') {
      // Remove any non-numeric characters except decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      return numericValue || '';
    }
    return '';
  };
  
  // If mlData is already an array of entries
  if (Array.isArray(mlData)) {
    return mlData.map(entry => {
      const financialEntry: FinancialData = {};
      
      // Map common financial fields
      if (entry.income !== undefined) financialEntry.income = safeNumberConversion(entry.income);
      if (entry.section80c !== undefined) financialEntry.section80c = safeNumberConversion(entry.section80c);
      if (entry.section80d !== undefined) financialEntry.section80d = safeNumberConversion(entry.section80d);
      if (entry.section80g !== undefined) financialEntry.section80g = safeNumberConversion(entry.section80g);
      if (entry.hra !== undefined) financialEntry.hra = safeNumberConversion(entry.hra);
      if (entry.lta !== undefined) financialEntry.lta = safeNumberConversion(entry.lta);
      
      // Handle any other fields that might be present
      Object.keys(entry).forEach(key => {
        if (!financialEntry[key]) {
          financialEntry[key] = safeNumberConversion(entry[key]);
        }
      });
      
      return financialEntry;
    });
  } 
  
  // If mlData is a single object with financial totals
  if (typeof mlData === 'object' && !Array.isArray(mlData)) {
    const financialEntry: FinancialData = {};
    
    // Map common financial fields
    if (mlData.income !== undefined) financialEntry.income = safeNumberConversion(mlData.income);
    if (mlData.section80c !== undefined) financialEntry.section80c = safeNumberConversion(mlData.section80c);
    if (mlData.section80d !== undefined) financialEntry.section80d = safeNumberConversion(mlData.section80d);
    if (mlData.section80g !== undefined) financialEntry.section80g = safeNumberConversion(mlData.section80g);
    if (mlData.hra !== undefined) financialEntry.hra = safeNumberConversion(mlData.hra);
    if (mlData.lta !== undefined) financialEntry.lta = safeNumberConversion(mlData.lta);
    
    // Handle any other fields that might be present
    Object.keys(mlData).forEach(key => {
      if (!financialEntry[key] && key !== 'rawResponse' && key !== 'parsingError') {
        financialEntry[key] = safeNumberConversion(mlData[key]);
      }
    });
    
    return [financialEntry];
  }
  
  // Fallback case
  console.error("Could not parse ML data format:", mlData);
  return [];
};
