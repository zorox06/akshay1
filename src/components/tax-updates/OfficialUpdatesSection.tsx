
import React from 'react';
import TaxUpdateCard from './TaxUpdateCard';
import TaxSummaryTable from './TaxSummaryTable';
import { taxUpdates } from './taxUpdatesData';

const OfficialUpdatesSection = () => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-tax-blue mb-4 transform-gpu transition-all duration-700 ease-in-out">
        Latest Tax Updates
      </h2>
      
      <TaxSummaryTable />
      
      <div className="space-y-6">
        {taxUpdates.map((update, index) => (
          <TaxUpdateCard key={update.id} update={update} index={index} />
        ))}
      </div>
      
      {/* Global styles added to a style tag without jsx attributes */}
      <style>
        {`
        .section-animate.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Improved animations */
        [data-state="open"] [data-radix-sheet-content] {
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1) !important;
          animation-duration: 500ms !important;
        }
        
        [data-radix-tooltip-content] {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important;
          transition-duration: 300ms !important;
        }
        `}
      </style>
    </div>
  );
};

export default OfficialUpdatesSection;
