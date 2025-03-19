
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const TaxSummaryTable = () => {
  return (
    <div className="mb-6 p-4 border border-amber-200 rounded-md bg-gray-900 section-animate transform-gpu transition-all duration-700 ease-out opacity-0 translate-y-4 will-change-transform">
      <h3 className="text-lg font-semibold text-amber-800">FY 2025-26 Key Tax Changes</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Effective From</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Standard Deduction</TableCell>
            <TableCell>Increased to ₹75,000</TableCell>
            <TableCell>April 1, 2025</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>GST Returns</TableCell>
            <TableCell>Streamlined filing process</TableCell>
            <TableCell>April 1, 2025</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>TDS on E-commerce</TableCell>
            <TableCell>Standardized at 1%</TableCell>
            <TableCell>April 1, 2025</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TaxSummaryTable;
