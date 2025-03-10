
import { useChat } from '@/contexts/ChatContext';

interface MessageDisplayProps {
  isProcessing: boolean;
}

export default function MessageDisplay({ isProcessing }: MessageDisplayProps) {
  const { messages } = useChat();

  return (
    <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
      {messages.map((message) => (
        <div key={message.id} className="bg-tax-gray-dark p-3 rounded-lg">
          <div className="flex items-start">
            <div className={`w-8 h-8 rounded-full ${message.role === 'ai' ? 'bg-tax-blue text-tax-gray-dark' : 'bg-tax-gray-medium text-foreground'} flex items-center justify-center text-sm shrink-0`}>
              {message.role === 'ai' ? 'AI' : 'You'}
            </div>
            <div className="ml-3">
              <p className="text-sm text-foreground whitespace-pre-line">{message.content}</p>
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
  );
}
