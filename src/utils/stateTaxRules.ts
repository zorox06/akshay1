
// State-specific tax rules (simplified for demo)
export const stateTaxRules: Record<string, { 
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
