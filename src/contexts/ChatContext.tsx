
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

type ChatContextType = {
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'ai') => void;
  clearMessages: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Hello! I\'m your tax assistant. How can I help you today?'
    }
  ]);

  const addMessage = (content: string, role: 'user' | 'ai') => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role, content }
    ]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
