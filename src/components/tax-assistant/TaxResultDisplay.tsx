
import { TaxCalculationResult } from '@/utils/taxCalculations';

interface TaxResultDisplayProps {
  calculationResult: TaxCalculationResult;
  csvError: string | null;
}

export default function TaxResultDisplay({ calculationResult, csvError }: TaxResultDisplayProps) {
  if (csvError || !calculationResult) return null;

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
    </div>
  );
}
