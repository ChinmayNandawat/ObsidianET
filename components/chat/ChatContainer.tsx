'use client';

import { useEffect, useRef, useState } from 'react';
import { PersonalizationPayload } from '../../types';
import { sendChatMessage } from '../../lib/api';
import { saveProfile, loadProfile, clearProfile } from '../../lib/profileStore';
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
      
      // Save each answer to profileStore
      if (updatedSession.answeredQuestions > (session?.answeredQuestions || 0)) {
        const currentQuestionNumber = updatedSession.answeredQuestions;
        saveProfile({
          userName: loadProfile().userName || "",
          answers: {
            ...loadProfile().answers,
            [`question_${currentQuestionNumber}`]: outbound
          }
        });
      }
      
      // After question 10 - call Gemini
      if (updatedSession.profilingComplete && !session?.profilingComplete) {
        const profile = loadProfile();

        const prompt = `
You are a financial AI for Economic Times India.
Analyze this user profile and return ONLY a JSON object.
No markdown. No code fences. No explanation.
Start response with { and end with }.

User profile answers: ${JSON.stringify(profile.answers)}

Return exactly this JSON:
{
  "primaryGoal": "short goal phrase e.g. Retire at 55",
  "riskTolerance": "aggressive or balanced or conservative",
  "investorType": "retail or hni or institutional",
  "geminiSummary": "2-3 sentence profile summary",
  "projectionName": "creative name e.g. Retirement Alpha",
  "optimistic": <integer in lakhs e.g. 42>,
  "expected": <integer in lakhs e.g. 28>,
  "projectionReasoning": "2-3 sentences explaining the numbers",
  "growthVector": "one line growth description",
  "drawdownGuard": "one line risk protection description",
  "hedgeEfficiency": "one line hedge description",
  "recommendations": [
    {
      "product": "ET Prime",
      "section": "ET PRIME",
      "title": "relevant article/product title",
      "description": "one line why this matches user",
      "matchScore": 94,
      "url": "https://etprime.economictimes.com",
      "tags": ["tag1", "tag2", "tag3"],
      "geminiReason": "Based on your interest in X, this matches perfectly"
    },
    {
      "product": "ET Markets",
      "section": "ET MARKETS",
      "title": "relevant title",
      "description": "one line description",
      "matchScore": 89,
      "url": "https://markets.economictimes.indiatimes.com",
      "tags": ["tag1", "tag2"],
      "geminiReason": "reason based on user answers"
    },
    {
      "product": "ET Wealth",
      "section": "ET WEALTH",
      "title": "relevant title",
      "description": "one line description",
      "matchScore": 85,
      "url": "https://economictimes.indiatimes.com/wealth",
      "tags": ["tag1", "tag2"],
      "geminiReason": "reason based on user answers"
    },
    {
      "product": "ET Masterclass",
      "section": "ET MASTERCLASS",
      "title": "relevant title",
      "description": "one line description",
      "matchScore": 81,
      "url": "https://economictimes.indiatimes.com/masterclass",
      "tags": ["tag1", "tag2"],
      "geminiReason": "reason based on user answers"
    },
    {
      "product": "ET Global",
      "section": "GLOBAL INSIGHTS",
      "title": "relevant title",
      "description": "one line description",
      "matchScore": 77,
      "url": "https://economictimes.indiatimes.com/markets",
      "tags": ["tag1", "tag2"],
      "geminiReason": "reason based on user answers"
    }
  ]
}
`;

        // Call Gemini via API route
        try {
          const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, type: "profile" })
          });

          const data = await response.json();
          
          // Safe JSON parse — handles markdown fences
          let parsed: Record<string, unknown> = {};
          try {
            let clean = (data.content || "").trim();
            clean = clean.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
            const match = clean.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(match ? match[0] : clean);
          } catch (e) {
            console.error("❌ Profile parse failed:", e);
            console.log("Raw response:", data.content);
          }

          // Save to localStorage
          saveProfile({
            ...parsed,
            isProfilingComplete: true,
          } as any);

          console.log("✅ Profile saved:", loadProfile());

        } catch (err) {
          console.error("❌ Gemini call failed:", err);
          // Save completion flag even if Gemini fails
          // so user isn't stuck on overlay
          saveProfile({ isProfilingComplete: true });
        }
      }
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
    <>
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
    
    {/* Reset Button for Demos */}
    <button
      onClick={() => { 
        clearProfile();
        window.location.reload(); 
      }}
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        fontSize: 11,
        color: "#444",
        background: "transparent",
        border: "1px solid #333",
        borderRadius: 4,
        padding: "4px 8px",
        cursor: "pointer",
        zIndex: 999
      }}
    >
      Reset
    </button>
    </>
  );
};
