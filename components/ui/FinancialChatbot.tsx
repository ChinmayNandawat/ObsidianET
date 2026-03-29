'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, BookOpen, TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { sendFinancialChatMessage } from '../../lib/api';

interface FinancialMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'stocks' | 'trading' | 'investment' | 'analysis' | 'guidance';
}

export const FinancialChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<FinancialMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Financial Terms Assistant. I can help explain any financial concepts, market terms, or investment strategies in simple, easy-to-understand language. What would you like to know about today?',
      timestamp: new Date(),
      category: 'analysis'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: FinancialMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Call the real Gemini API
      const apiResponse = await sendFinancialChatMessage(input);
      
      const assistantMessage: FinancialMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: apiResponse.response,
        timestamp: new Date(),
        category: apiResponse.category
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Financial Chatbot Error:', error);
      
      // Add error message instead of getting stuck in loop
      const errorMessage: FinancialMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to my financial knowledge base right now. Please try again in a moment. If you have questions about using Obsidian Flux, I can still help guide you through the platform's features!",
        timestamp: new Date(),
        category: 'guidance'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'stocks': return <BarChart3 className="w-3 h-3" />;
      case 'trading': return <TrendingUp className="w-3 h-3" />;
      case 'investment': return <PieChart className="w-3 h-3" />;
      case 'analysis': return <BookOpen className="w-3 h-3" />;
      case 'guidance': return <DollarSign className="w-3 h-3" />;
      default: return <DollarSign className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'stocks': return 'text-blue-400';
      case 'trading': return 'text-green-400';
      case 'investment': return 'text-purple-400';
      case 'analysis': return 'text-yellow-400';
      case 'guidance': return 'text-primary';
      default: return 'text-primary';
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-primary text-black p-4 rounded-full shadow-[0_0_30px_rgba(0,200,5,0.4)] btn-elastic chatbot-glow chatbot-bounce ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] bg-surface-container border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,200,5,0.2)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-surface-container-high border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Financial Terms Assistant</h3>
                  <p className="text-tertiary text-xs">Ask me anything about finance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-tertiary hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 text-[10px] text-tertiary uppercase tracking-widest font-bold">
                    {message.role === 'assistant' && (
                      <>
                        <div className={`w-2 h-2 rounded-full ${getCategoryColor(message.category)} shadow-[0_0_8px_currentColor]`}></div>
                        {getCategoryIcon(message.category)}
                      </>
                    )}
                    {message.role === 'assistant' ? 'Financial Assistant' : 'You'}
                  </div>
                  
                  <div className={`rounded-2xl p-3 text-sm leading-relaxed border border-white/5 shadow-lg max-w-[85%] ${
                    message.role === 'assistant' 
                      ? 'bg-surface-container-high text-white' 
                      : 'bg-primary/10 text-primary border-primary/30'
                  }`}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-tertiary text-sm"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Researching financial terms...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about financial terms..."
                  className="flex-1 bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-tertiary text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-primary text-black px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
