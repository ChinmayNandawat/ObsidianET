'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/layout/Navbar';
import { ChatContainer } from '../../components/chat/ChatContainer';
import { ProfilePanel } from '../../components/profile/ProfilePanel';
import { RecommendationCard } from '../../components/recommendation/RecommendationCard';
import { IdentityGate } from '../../components/IdentityGate';
import { IdentityBadge } from '../../components/IdentityBadge';
import { getSessionState } from '../../lib/api';
import { PersonalizationPayload, UserIdentity } from '../../types';
import { saveIdentity } from '../../lib/identity';
import { useAuth } from '../../src/context/AuthContext';

export default function ChatPage() {
  // ALL hooks must be declared first - before any conditional returns
  const { user, isAuthenticated, isLoading, session: authSession, token } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<PersonalizationPayload | null>(null);
  const [identity, setIdentity] = useState<UserIdentity | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [profilingComplete, setProfilingComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  // ALL useEffect hooks next
  // Auth guard effect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated]);

  // Session restore effect
  useEffect(() => {
    if (isAuthenticated && authSession && authSession.profilingComplete) {
      // restore into existing session state
      setMessages(authSession.messages || []);
      setProfilingComplete(authSession.profilingComplete);
      setAnsweredQuestions(authSession.answeredQuestions || 0);
      if (authSession.profile) setProfile(authSession.profile);
      if (authSession.recommendations?.length > 0) 
        setRecommendations(authSession.recommendations);
    }
  }, [isAuthenticated, authSession]);

  // Auto-save effect
  useEffect(() => {
    if (isAuthenticated && token && messages.length > 0) {
      fetch('/api/auth/save-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          messages, 
          profile, 
          recommendations,
          profilingComplete, 
          answeredQuestions 
        })
      }).catch(console.error);
    }
  }, [messages, token, profile, recommendations, profilingComplete, answeredQuestions]);

  // Auto-save identity when session changes
  useEffect(() => {
    if (session && identity) {
      const updatedIdentity: UserIdentity = {
        ...identity,
        profile: session.profile,
        messages: session.messages,
        profilingComplete: session.profilingComplete,
        recommendations: session.recommendations,
        lastActive: new Date().toISOString()
      };
      saveIdentity(updatedIdentity);
    }
  }, [session, identity]);

  // Initial session load
  useEffect(() => {
    getSessionState().then(setSession).catch((error) => console.error('Failed to load session', error));
  }, []);

  // Conditional returns come AFTER all hooks
  // Loading screen
  if (isLoading) return (
    <div className="h-screen w-screen bg-black flex items-center 
      justify-center flex-col gap-4">
      <div className="w-8 h-8 border-2 border-[#00ff41]/30 
        border-t-[#00ff41] rounded-full animate-spin"/>
      <div className="text-[#00ff41] font-mono text-xs 
        tracking-widest animate-pulse">
        AUTHENTICATING...
      </div>
    </div>
  );

  // Redirect if not authenticated
  if (!isAuthenticated) return null;

  const handleIdentitySet = (newIdentity: UserIdentity) => {
    setIdentity(newIdentity);
    // Convert UserIdentity to PersonalizationPayload format
    setSession({
      sessionId: newIdentity.coreId,
      messages: newIdentity.messages,
      profile: newIdentity.profile || {
        name: newIdentity.username,
        persona: 'New Operator',
        summary: 'Profile being constructed...',
        riskTolerance: 'medium',
        riskLabel: 'Balanced',
        experienceLevel: 'Discovering baseline',
        interests: ['ET Markets', 'Wealth', 'AI'],
        primaryGoal: 'Complete onboarding',
        investmentHorizon: 'Still assessing',
        financialIQ: 62,
        profileCompletion: 10,
        coreId: newIdentity.coreId,
        lastActive: newIdentity.lastActive,
        insights: [
          { label: 'Risk appetite', value: 'Balanced', score: 60 },
          { label: 'Experience', value: 'Calibrating', score: 45 },
          { label: 'Goal clarity', value: 'Building', score: 52 }
        ]
      },
      recommendations: newIdentity.recommendations,
      hubItems: [],
      simulation: {
        title: 'Projection Alpha-7',
        subtitle: 'Gemini will convert your profile into a forward scenario once onboarding is complete.',
        optimistic: '$4.2M',
        expected: '$2.8M',
        points: [],
        metrics: [],
        adjustments: []
      },
      profilingQuestions: [],
      answeredQuestions: newIdentity.profilingComplete ? 10 : 0,
      profilingComplete: newIdentity.profilingComplete
    });
  };

  return (
    <div className="h-screen flex flex-col pt-16 overflow-hidden bg-black">
      <Navbar>
        <IdentityBadge className="ml-auto" />
      </Navbar>

      <IdentityGate onIdentitySet={handleIdentitySet}>
        <>
          <div className="flex-1 flex overflow-hidden">
            <ChatContainer session={session} onSessionUpdate={setSession} />

            <div className="w-80 xl:w-[26rem] flex-shrink-0 border-l border-white/5 bg-[#0b0e14] p-6 hidden lg:flex flex-col overflow-y-auto space-y-6">
              {session?.profilingComplete && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-headline text-xl font-extrabold tracking-tight">ET Recommendations</h2>
                      <p className="text-tertiary text-[10px] uppercase font-bold tracking-widest">Gemini-synthesized fit</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {session.recommendations.map((rec) => (
                      <RecommendationCard key={rec.id} recommendation={rec} />
                    ))}
                  </div>

                  {session.profile && <ProfilePanel profile={session.profile} />}
                </>
              )}
            </div>
          </div>
        </>
      </IdentityGate>
    </div>
  );
}
