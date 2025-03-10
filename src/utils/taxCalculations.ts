
// Indian tax slabs for FY 2023-24 (AY 2024-25)
export const calculateTaxOldRegime = (income: number, stateAdditionalTax: number = 0): number => {
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
export const calculateTaxNewRegime = (income: number, stateAdditionalTax: number = 0): number => {
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

export interface TaxCalculationResult {
  oldRegimeTax: number;
  newRegimeTax: number;
  recommendation: string;
  stateSpecificNotes?: string[];
}

export interface FinancialData {
  income?: string;
  section80c?: string;
  section80d?: string;
  section80g?: string;
  hra?: string;
  lta?: string;
  [key: string]: string | undefined;
}
