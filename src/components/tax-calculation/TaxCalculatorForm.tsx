
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  calculateTaxNewRegime, 
  calculateTaxOldRegime 
} from '@/utils/taxCalculations';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { stateTaxRules } from '@/utils/stateTaxRules';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  income: z.string().min(1, "Income is required"),
  section80c: z.string().optional(),
  section80d: z.string().optional(),
  section80g: z.string().optional(),
  hra: z.string().optional(),
  lta: z.string().optional(),
  state: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TaxCalculatorForm() {
  const { toast } = useToast();
  const [result, setResult] = useState<{
    oldRegimeTax: number;
    newRegimeTax: number;
    recommendation: string;
    stateSpecificNotes?: string[];
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: "",
      section80c: "",
      section80d: "",
      section80g: "",
      hra: "",
      lta: "",
      state: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      // Parse values
      const income = parseFloat(values.income) || 0;
      const section80c = parseFloat(values.section80c || "0") || 0;
      const section80d = parseFloat(values.section80d || "0") || 0;
      const section80g = parseFloat(values.section80g || "0") || 0;
      const hra = parseFloat(values.hra || "0") || 0;
      const lta = parseFloat(values.lta || "0") || 0;
      
      // Calculate total deductions
      const totalDeductions = section80c + section80d + section80g + hra + lta;
      
      // Calculate taxable income for old regime
      const taxableIncomeOldRegime = Math.max(0, income - totalDeductions);
      const taxableIncomeNewRegime = income; // No deductions in new regime
      
      // Check for state-specific tax rules
      let stateAdditionalTaxRate = 0;
      let stateSpecificNotes: string[] = [];
      
      if (values.state) {
        const stateKey = Object.keys(stateTaxRules).find(
          state => values.state?.includes(state)
        );
        
        if (stateKey) {
          const stateRules = stateTaxRules[stateKey];
          stateAdditionalTaxRate = stateRules.additionalTaxRate;
          stateSpecificNotes = [
            `${stateKey} additional tax rate: ${stateRules.additionalTaxRate * 100}%`,
            ...stateRules.specialDeductions.map(deduction => `Available deduction: ${deduction}`),
            `GST registration thresholds in ${stateKey}: ${Object.entries(stateRules.gstThresholds).map(([type, threshold]) => `${type} - ${threshold}`).join(', ')}`
          ];
        }
      }
      
      // Calculate tax for both regimes
      const oldRegimeTax = calculateTaxOldRegime(taxableIncomeOldRegime, stateAdditionalTaxRate);
      const newRegimeTax = calculateTaxNewRegime(taxableIncomeNewRegime, stateAdditionalTaxRate);
      
      // Determine which regime is better
      const recommendation = oldRegimeTax <= newRegimeTax 
        ? `Based on your income of ₹${income.toLocaleString('en-IN')} and deductions of ₹${totalDeductions.toLocaleString('en-IN')}${values.state ? ` in ${values.state}` : ''}, the Old Tax Regime is more beneficial for you.`
        : `Based on your income of ₹${income.toLocaleString('en-IN')} and deductions of ₹${totalDeductions.toLocaleString('en-IN')}${values.state ? ` in ${values.state}` : ''}, the New Tax Regime is more beneficial for you.`;
      
      // Set result
      setResult({
        oldRegimeTax,
        newRegimeTax,
        recommendation,
        stateSpecificNotes: stateSpecificNotes.length > 0 ? stateSpecificNotes : undefined
      });
      
      toast({
        title: "Tax Calculation Complete",
        description: "View your tax calculation results below",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error calculating tax:", error);
      toast({
        title: "Calculation Error",
        description: "There was an error calculating your taxes. Please check your inputs.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Income (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter your annual income" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Your total taxable income for the financial year.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="section80c"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section 80C (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="PPF, ELSS, etc." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="section80d"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section 80D (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Health Insurance" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="section80g"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section 80G (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Donations" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HRA Exemption (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="House Rent Allowance" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LTA (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Leave Travel Allowance" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State of Residence</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Select State</SelectItem>
                    {Object.keys(stateTaxRules).map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select your state for state-specific tax rules.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">Calculate Tax</Button>
        </form>
      </Form>
      
      {result && (
        <div className="mt-6 p-5 bg-tax-gray-dark rounded-lg">
          <h3 className="text-lg font-medium mb-3">Tax Calculation Results</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-tax-gray-medium rounded-md">
              <p className="text-sm text-muted-foreground">Old Regime Tax</p>
              <p className="text-lg font-semibold">₹{result.oldRegimeTax.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-4 bg-tax-gray-medium rounded-md">
              <p className="text-sm text-muted-foreground">New Regime Tax</p>
              <p className="text-lg font-semibold">₹{result.newRegimeTax.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="bg-tax-gray-medium p-3 rounded-md mb-3">
            <p className="text-sm text-muted-foreground font-medium">Recommendation</p>
            <p className="text-sm mt-1">{result.recommendation}</p>
          </div>
          
          {result.stateSpecificNotes && (
            <div className="bg-tax-gray-medium p-3 rounded-md">
              <p className="text-sm text-muted-foreground font-medium">State-Specific Information</p>
              <ul className="text-sm mt-1 space-y-1">
                {result.stateSpecificNotes.map((note, index) => (
                  <li key={index} className="text-sm">• {note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
