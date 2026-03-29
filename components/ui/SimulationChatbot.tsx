'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, TrendingUp, BarChart3, Activity, ShieldCheck } from 'lucide-react';
import { sendSimulationChatMessage } from '../../lib/api';

interface SimulationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'guidance' | 'analysis' | 'explanation';
}

interface SimulationChatbotProps {
  simulation?: any;
  profile?: any;
}

export const SimulationChatbot = ({ simulation, profile }: SimulationChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SimulationMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Simulation Assistant. I can help explain your Future Outcome Simulation, the projection chart, metrics, and recommendations in simple terms. What would you like to understand better?',
      timestamp: new Date(),
      category: 'guidance'
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

    const userMessage: SimulationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const apiResponse = await sendSimulationChatMessage(input);
      
      const assistantMessage: SimulationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: apiResponse.response,
        timestamp: new Date(),
        category: apiResponse.category
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Simulation Chatbot Error:', error);
      
      const errorMessage: SimulationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment. I'm here to help explain your simulation!",
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
      case 'guidance': return <TrendingUp className="w-3 h-3" />;
      case 'analysis': return <BarChart3 className="w-3 h-3" />;
      case 'explanation': return <Activity className="w-3 h-3" />;
      default: return <ShieldCheck className="w-3 h-3" />;
    }
  };

  const getSuggestedQuestions = () => [
    "What does my projection chart show?",
    "How does my risk profile affect these numbers?",
    "What is Growth Vector and Drawdown Guard?",
    "How do I compare to Nifty 50?",
    "Why these ET recommendations?"
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary text-black p-4 rounded-full shadow-[0_0_30px_rgba(0,200,5,0.4)] btn-elastic chatbot-glow chatbot-bounce opacity-100"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-[#0b0e14] border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary-container/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Simulation Assistant</h3>
                    <p className="text-tertiary text-xs">Explains your projections</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-tertiary hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      {getCategoryIcon(message.category)}
                    </div>
                  )}
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-black' 
                        : 'bg-white/5 border border-white/10 text-white'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p className="text-[10px] text-tertiary mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Loader2 className="w-3 h-3 text-primary animate-spin" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            <div className="p-4 border-t border-white/10">
              <div className="mb-3">
                <p className="text-[10px] text-tertiary uppercase tracking-widest font-bold mb-2">Quick Questions</p>
                <div className="flex flex-wrap gap-2">
                  {getSuggestedQuestions().slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 text-tertiary hover:text-white transition-all"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your simulation..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-tertiary focus:outline-none focus:border-primary/30 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-primary text-black p-2 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
