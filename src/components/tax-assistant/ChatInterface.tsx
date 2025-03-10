
import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from "@/components/ui/use-toast";
import { predefinedResponses } from '@/utils/predefinedResponses';

interface ChatInterfaceProps {
  setIsProcessing: (isProcessing: boolean) => void;
}

export default function ChatInterface({ setIsProcessing }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const { messages, addMessage } = useChat();
  const { toast } = useToast();

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
        disabled={false}
        className="bg-tax-blue text-tax-gray-dark px-4 py-2 rounded-r-lg text-sm font-medium"
      >
        Send
      </button>
    </form>
  );
}
