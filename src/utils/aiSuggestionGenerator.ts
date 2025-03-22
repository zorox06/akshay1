
import { FinancialData } from "@/utils/taxCalculations";

/**
 * Generate AI suggestions based on financial data
 */
export const generateAISuggestions = (
  data: FinancialData[],
  addMessage: (content: string, role: 'user' | 'ai') => void
): void => {
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
