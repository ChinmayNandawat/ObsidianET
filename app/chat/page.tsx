'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { ChatContainer } from '../../components/chat/ChatContainer';
import { ProfilePanel } from '../../components/profile/ProfilePanel';
import { RecommendationCard } from '../../components/recommendation/RecommendationCard';
import { getSessionState } from '../../lib/api';
import { PersonalizationPayload } from '../../types';

export default function ChatPage() {
  const [session, setSession] = useState<PersonalizationPayload | null>(null);

  useEffect(() => {
    getSessionState().then(setSession).catch((error) => console.error('Failed to load session', error));
  }, []);

  return (
    <div className="h-screen flex flex-col pt-16 overflow-hidden bg-black">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <ChatContainer session={session} onSessionUpdate={setSession} />

        <div className="w-80 xl:w-[26rem] flex-shrink-0 border-l border-white/5 bg-[#0b0e14] p-6 hidden lg:flex flex-col overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-xl font-extrabold tracking-tight">ET Recommendations</h2>
              <p className="text-tertiary text-[10px] uppercase font-bold tracking-widest">Gemini-synthesized fit</p>
            </div>
          </div>

          <div className="space-y-4">
            {session?.recommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>

          {session?.profile && <ProfilePanel profile={session.profile} />}
        </div>
      </div>
    </div>
  );
}
