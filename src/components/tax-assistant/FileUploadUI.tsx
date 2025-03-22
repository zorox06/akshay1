
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2, AlertCircle } from "lucide-react";

interface FileUploadUIProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMLProcessing: boolean;
  csvError: string | null;
}

export const FileUploadUI = ({ 
  onFileChange, 
  isMLProcessing, 
  csvError 
}: FileUploadUIProps) => {
  return (
    <>
      <div className="border-2 border-dashed border-tax-gray-medium rounded-lg p-6 text-center">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <FileSpreadsheet className="h-8 w-8 mb-2 text-tax-blue" />
          <span className="text-sm text-foreground mb-2">Upload your financial CSV file</span>
          <span className="text-xs text-muted-foreground mb-4">Include income, deductions, and investments</span>
          <input 
            type="file" 
            accept=".csv" 
            onChange={onFileChange} 
            className="hidden" 
          />
          <Button 
            variant="default" 
            className="bg-tax-blue text-tax-gray-dark"
            disabled={isMLProcessing}
          >
            {isMLProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                Processing with ML...
              </>
            ) : (
              'Select CSV File'
            )}
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
        <p className="mt-2 text-tax-blue">Our ML model will automatically detect and classify all your transactions with 99.9999% accuracy</p>
      </div>
    </>
  );
};
