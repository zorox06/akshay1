
import { TaxCalculationResult } from '@/utils/taxCalculations';
import { FinancialData } from '@/utils/taxCalculations';
import { FileText } from 'lucide-react';

interface TaxResultDisplayProps {
  calculationResult: TaxCalculationResult;
  csvError: string | null;
  csvData?: FinancialData[] | null;
}

export default function TaxResultDisplay({ calculationResult, csvError, csvData }: TaxResultDisplayProps) {
  if (csvError || !calculationResult) return null;

  // Extract total values from CSV data
  const extractTotals = () => {
    if (!csvData || csvData.length === 0) return null;
    
    const totals = {
      income: 0,
      section80c: 0,
      section80d: 0,
      section80g: 0,
      hra: 0,
      lta: 0,
    };
    
    csvData.forEach(entry => {
      if (entry.income) totals.income += parseFloat(entry.income);
      if (entry.section80c) totals.section80c += parseFloat(entry.section80c);
      if (entry.section80d) totals.section80d += parseFloat(entry.section80d);
      if (entry.section80g) totals.section80g += parseFloat(entry.section80g);
      if (entry.hra) totals.hra += parseFloat(entry.hra);
      if (entry.lta) totals.lta += parseFloat(entry.lta);
    });
    
    return totals;
  };

  const totals = extractTotals();

  return (
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
      
      {totals && (
        <div className="mt-4 border-t border-tax-gray-medium pt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <FileText className="h-4 w-4 text-tax-blue" />
            <h4 className="text-sm font-medium">CSV Data Summary</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Total Income</p>
              <p className="font-medium">₹{totals.income.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Section 80C</p>
              <p className="font-medium">₹{totals.section80c.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Section 80D</p>
              <p className="font-medium">₹{totals.section80d.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Section 80G</p>
              <p className="font-medium">₹{totals.section80g.toLocaleString('en-IN')}</p>
            </div>
            {totals.hra > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">HRA</p>
                <p className="font-medium">₹{totals.hra.toLocaleString('en-IN')}</p>
              </div>
            )}
            {totals.lta > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">LTA</p>
                <p className="font-medium">₹{totals.lta.toLocaleString('en-IN')}</p>
              </div>
            )}
          </div>
          
          {csvData && csvData.length > 1 && (
            <div className="mt-2 text-xs text-muted-foreground">
              <p>Number of entries: {csvData.length}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
