'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { ChatContainer } from '../../components/chat/ChatContainer';
import { ProfilePanel } from '../../components/profile/ProfilePanel';
import { RecommendationCard } from '../../components/recommendation/RecommendationCard';
import { getUserProfile, getRecommendations } from '../../lib/api';
import { UserProfile, Recommendation } from '../../types';

export default function ChatPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [p, r] = await Promise.all([getUserProfile(), getRecommendations({} as any)]);
      setProfile(p);
      setRecommendations(r);
    };
    fetchData();
  }, []);

  return (
    <div className="h-screen flex flex-col pt-16 overflow-hidden bg-black">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area (Left) */}
        <ChatContainer />
        
        {/* Right Sidebar - ET Ecosystem & Intelligence */}
        <div className="w-80 xl:w-[26rem] flex-shrink-0 border-l border-white/5 bg-[#0b0e14] p-6 hidden lg:flex flex-col overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-xl font-extrabold tracking-tight">ET Recommendations</h2>
              <p className="text-tertiary text-[10px] uppercase font-bold tracking-widest">Real-time Alpha Signals</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>

          {/* Intelligence Profile Component */}
          {profile && <ProfilePanel profile={profile} />}
        </div>
      </div>
    </div>
  );
}
