'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '../../types';
import { getAIResponse, getUserProfile } from '../../lib/api';
import { ChatMessage } from './ChatMessage';
import { Send, Loader2, Globe, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

export const ChatContainer = ({ onConversationUpdate }: { onConversationUpdate?: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const initialProfile = await getUserProfile();
      
      const initialMessages: Message[] = [
        {
          id: '1',
          role: 'assistant',
          content: `Connection established. I am Obsidian Flux, your dedicated financial intelligence terminal powered by the ET Ecosystem. I have processed your current portfolio delta and identified key opportunities. Shall we initiate a deep-dive analysis?`,
          timestamp: new Date(),
        }
      ];
      setMessages(initialMessages);
    };
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    
    try {
      const response = await getAIResponse([...messages, userMessage]);
      setMessages(prev => {
        const next = [...prev, response];
        return next;
      });
      onConversationUpdate?.();
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent relative overflow-hidden">
      {/* Decorative background gradients for the chat container */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#0b0e14] to-transparent z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-[#0b0e14]/90 via-[#0b0e14]/50 to-transparent z-0 pointer-events-none"></div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-12 md:px-12 xl:px-24 space-y-10 scrollbar-hide z-10"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
            <Cpu className="w-16 h-16 text-primary mb-4" />
            <h2 className="font-headline text-2xl text-white font-bold">Obsidian Terminal Ready</h2>
            <p className="text-sm text-tertiary">Awaiting your tactical instructions.</p>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto w-full space-y-10 pb-20">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isThinking && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-secondary-container/10 border border-secondary-container/30 px-4 py-2 rounded-full backdrop-blur-md">
                  <Loader2 className="w-3.5 h-3.5 text-secondary-container animate-spin" />
                  <span className="text-[10px] font-bold text-secondary-container uppercase tracking-widest">Synthesizing Alpha Data...</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full opacity-50 backdrop-blur-md">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Querying ET Markets</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="p-6 md:p-8 pt-0 z-20 pb-10">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-secondary-container/10 to-primary/10 rounded-3xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative bg-[#0d1118]/80 hover:bg-[#12161f]/90 transition-colors border border-white/10 group-focus-within:border-primary/30 rounded-2xl p-2.5 flex items-center gap-3 shadow-2xl backdrop-blur-xl">
            <div className="p-3 text-white/30 group-focus-within:text-primary transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Enter instructions or query Obsidian Flux..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/30 font-medium text-[15px] py-3 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="bg-white/5 hover:bg-primary hover:text-black group-focus-within:bg-primary group-focus-within:text-black text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2.5 disabled:opacity-30 disabled:pointer-events-none"
            >
              Execute <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
