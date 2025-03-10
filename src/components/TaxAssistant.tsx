
import { useState, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from "@/components/ui/button";
import { Calculator, FileSpreadsheet } from "lucide-react";
import LocationDetector from './tax-assistant/LocationDetector';
import CSVUploader from './tax-assistant/CSVUploader';
import MessageDisplay from './tax-assistant/MessageDisplay';
import ChatInterface from './tax-assistant/ChatInterface';
import TaxResultDisplay from './tax-assistant/TaxResultDisplay';
import TaxCalculator from './tax-assistant/TaxCalculator';
import { FinancialData, TaxCalculationResult } from '@/utils/taxCalculations';

export default function TaxAssistant() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<FinancialData[] | null>(null);
  const [calculationResult, setCalculationResult] = useState<TaxCalculationResult | null>(null);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  // Get tax calculator functionality
  const { calculateTaxLiability, csvError } = TaxCalculator({
    csvData,
    userLocation,
    setCalculationResult,
    calculationResult,
    setIsProcessing
  });

  const toggleMode = () => {
    setIsUploadMode(!isUploadMode);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end gap-2 mb-2">
        <LocationDetector
          userLocation={userLocation}
          setUserLocation={setUserLocation}
        />
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-xs"
          onClick={toggleMode}
        >
          {isUploadMode ? (
            <>
              <Calculator className="h-3 w-3" /> Chat Mode
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-3 w-3" /> Upload CSV
            </>
          )}
        </Button>
      </div>
      
      <MessageDisplay isProcessing={isProcessing} />
      
      {isUploadMode ? (
        <div className="mt-4">
          <CSVUploader
            setIsProcessing={setIsProcessing}
            setCsvData={setCsvData}
            setCalculationResult={setCalculationResult}
            calculateTaxLiability={calculateTaxLiability}
          />
          
          <TaxResultDisplay 
            calculationResult={calculationResult!} 
            csvError={csvError}
          />
        </div>
      ) : (
        <ChatInterface setIsProcessing={setIsProcessing} />
      )}
    </div>
  );
}
