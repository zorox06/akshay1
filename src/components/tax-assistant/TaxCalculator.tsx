
import { useState, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from "@/components/ui/use-toast";
import { stateTaxRules } from '@/utils/stateTaxRules';
import { 
  calculateTaxNewRegime, 
  calculateTaxOldRegime,
  FinancialData,
  TaxCalculationResult
} from '@/utils/taxCalculations';

interface TaxCalculatorProps {
  csvData: FinancialData[] | null;
  userLocation: string | null;
  setCalculationResult: (result: TaxCalculationResult | null) => void;
  calculationResult: TaxCalculationResult | null;
  setIsProcessing: (isProcessing: boolean) => void;
}

export default function TaxCalculator({ 
  csvData, 
  userLocation, 
  setCalculationResult, 
  calculationResult,
  setIsProcessing
}: TaxCalculatorProps) {
  const { addMessage } = useChat();
  const { toast } = useToast();
  const [csvError, setCsvError] = useState<string | null>(null);

  useEffect(() => {
    // If we have location and calculation results, update the calculation with state-specific data
    if (userLocation && calculationResult && csvData) {
      // Find if we have specific tax rules for this state
      const stateKey = Object.keys(stateTaxRules).find(
        state => userLocation.includes(state)
      );
      
      if (stateKey) {
        calculateTaxLiability(csvData);
      }
    }
  }, [userLocation, calculationResult, csvData]);

  const calculateTaxLiability = (data: FinancialData[]) => {
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

  return { calculateTaxLiability, csvError };
}
