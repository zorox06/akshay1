
import React from 'react';
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TaxUpdate } from './types';

interface TaxUpdateDetailsProps {
  update: TaxUpdate;
}

const TaxUpdateDetails = ({ update }: TaxUpdateDetailsProps) => {
  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>{update.title}</SheetTitle>
        <SheetDescription>Published on {update.date}</SheetDescription>
      </SheetHeader>
      
      <div className="mt-6 space-y-4">
        <div className="animate-smooth-entrance opacity-0" style={{ animationDelay: '100ms' }}>
          <h4 className="font-medium text-lg mb-2">Overview</h4>
          <p className="text-muted-foreground">{update.content}</p>
        </div>
        
        <div className="animate-smooth-entrance opacity-0" style={{ animationDelay: '200ms' }}>
          <h4 className="font-medium text-lg mb-2">Key Highlights</h4>
          <ul className="list-disc pl-5 space-y-2">
            {update.details.map((detail, index) => (
              <li 
                key={index} 
                className="text-sm animate-slide-up opacity-0" 
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 border-t animate-fade-in opacity-0" style={{ animationDelay: '700ms' }}>
          <p className="text-xs text-muted-foreground">
            Source: <a href={update.source} target="_blank" rel="noopener noreferrer" className="underline text-tax-blue transition-colors duration-300 hover:text-tax-blue-light">
              {update.source}
            </a>
          </p>
        </div>
      </div>
    </SheetContent>
  );
};

export default TaxUpdateDetails;
