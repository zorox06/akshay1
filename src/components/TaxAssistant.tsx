
import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from "@/components/ui/use-toast";

const predefinedResponses: Record<string, string> = {
  "deductions": "Based on your income details, you could claim deductions under Section 80C for your PPF contributions of ₹1,50,000, potentially saving ₹46,800 in taxes.",
  "home office": "You could qualify for a home office deduction of approximately ₹1,80,000 based on your consulting income and workspace details.",
  "gst": "Your business falls under the 18% GST slab. Based on your quarterly turnover, you need to file GSTR-1 and GSTR-3B by the 20th of next month.",
  "income tax": "For your income bracket of ₹12,50,000, the estimated tax liability is ₹1,87,500 after standard deduction and Section 80C investments.",
  "due date": "The due date for filing your ITR for AY 2023-24 is July 31, 2023. For GST returns, your next filing is due on 20th of next month.",
  "help": "I can help with tax deductions, GST filing, income tax calculations, and financial planning. What would you like to know about?"
};

export default function TaxAssistant() {
  const [input, setInput] = useState('');
  const { messages, addMessage } = useChat();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    addMessage(input, 'user');
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Check for keywords in the user input
      const userInput = input.toLowerCase();
      let response = "I'm not sure how to help with that specific query. Would you like information about tax deductions, GST filing, or income tax calculations?";
      
      // Check for keywords in predefined responses
      for (const [keyword, reply] of Object.entries(predefinedResponses)) {
        if (userInput.includes(keyword)) {
          response = reply;
          break;
        }
      }
      
      // Add AI response
      addMessage(response, 'ai');
      setIsProcessing(false);
      
      toast({
        title: "New tax recommendation",
        description: "Check out our latest analysis for your tax situation",
        duration: 5000,
      });
    }, 1500);
    
    setInput('');
  };

  return (
    <div className="w-full">
      <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="bg-tax-gray-dark p-3 rounded-lg">
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full ${message.role === 'ai' ? 'bg-tax-blue text-tax-gray-dark' : 'bg-tax-gray-medium text-foreground'} flex items-center justify-center text-sm shrink-0`}>
                {message.role === 'ai' ? 'AI' : 'You'}
              </div>
              <div className="ml-3">
                <p className="text-sm text-foreground">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="bg-tax-gray-dark p-3 rounded-lg animate-pulse">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-tax-blue flex items-center justify-center text-tax-gray-dark font-medium text-sm shrink-0">
                AI
              </div>
              <div className="ml-3 flex space-x-1">
                <div className="h-2 w-2 bg-tax-blue rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-tax-blue rounded-full animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-tax-blue rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about tax deductions..." 
          className="flex-1 px-4 py-2 bg-tax-gray-dark rounded-l-lg text-sm border-0 focus:ring-0 focus:outline-none text-foreground" 
        />
        <button 
          type="submit"
          disabled={isProcessing}
          className="bg-tax-blue text-tax-gray-dark px-4 py-2 rounded-r-lg text-sm font-medium"
        >
          Send
        </button>
      </form>
    </div>
  );
}
