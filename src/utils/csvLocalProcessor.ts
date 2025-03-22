
import { FinancialData } from "@/utils/taxCalculations";
import { useToast } from "@/components/ui/use-toast";

/**
 * Process CSV data locally without ML
 */
export const processCSVLocally = (
  text: string,
  toast: ReturnType<typeof useToast>["toast"]
): FinancialData[] | null => {
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
    
    toast({
      title: "CSV Processing Complete",
      description: "Your financial data has been processed successfully.",
      duration: 3000,
    });
    
    return data;
  } catch (error) {
    console.error("CSV parsing error:", error);
    toast({
      title: "CSV Parsing Error",
      description: "Invalid CSV format. Please check your file.",
      variant: "destructive",
      duration: 3000,
    });
    return null;
  }
};
