'use client';

import { useEffect, useRef, useState } from 'react';
import { PersonalizationPayload } from '../../types';
import { sendChatMessage } from '../../lib/api';
import { ChatMessage } from './ChatMessage';
import { Send, Loader2, Globe, Cpu } from 'lucide-react';

interface ChatContainerProps {
  session: PersonalizationPayload | null;
  onSessionUpdate: (session: PersonalizationPayload) => void;
}

export const ChatContainer = ({ session, onSessionUpdate }: ChatContainerProps) => {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || !session) return;
    setIsThinking(true);
    const outbound = input;
    setInput('');

    try {
      const updatedSession = await sendChatMessage(outbound);
      onSessionUpdate(updatedSession);
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#0b0e14] to-transparent z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-[#0b0e14]/90 via-[#0b0e14]/50 to-transparent z-0 pointer-events-none"></div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-12 md:px-12 xl:px-24 space-y-10 scrollbar-hide z-10">
        {!session && (
          <div className="h-full flex flex-col items-center justify-center opacity-50 text-center">
            <Loader2 className="w-16 h-16 text-primary mb-4 animate-spin" />
            <h2 className="font-headline text-2xl text-white font-bold">Booting Obsidian Terminal</h2>
          </div>
        )}

        <div className="max-w-4xl mx-auto w-full space-y-10 pb-20">
          {session?.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isThinking && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-secondary-container/10 border border-secondary-container/30 px-4 py-2 rounded-full backdrop-blur-md">
                  <Loader2 className="w-3.5 h-3.5 text-secondary-container animate-spin" />
                  <span className="text-[10px] font-bold text-secondary-container uppercase tracking-widest">{session?.profilingComplete ? 'Analyzing input...' : 'Processing logic...'}</span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full opacity-70 backdrop-blur-md">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{session?.profilingComplete ? 'Querying ET Knowledge Base' : 'Synthesizing insights'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 md:px-8 z-20 pb-3">
        <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] text-tertiary">
          <div>
            <span className="text-white font-semibold">Profiling progress:</span> {session?.answeredQuestions ?? 0}/{session?.profilingQuestions.length ?? 10} answers collected
          </div>
          <div className="text-primary font-semibold uppercase tracking-[0.2em]">
            {session?.profilingComplete ? 'profile live' : 'onboarding'}
          </div>
        </div>
      </div>

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
              onKeyDown={handleKeyPress}
              placeholder={session?.profilingComplete ? 'Ask for recommendations, ET content, or portfolio guidance...' : session?.profilingQuestions[session.answeredQuestions]?.prompt || 'Answer the onboarding question...'}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/30 font-medium text-[15px] py-3 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isThinking || !session}
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
