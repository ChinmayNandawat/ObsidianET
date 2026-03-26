'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { ChatContainer } from '../../components/chat/ChatContainer';
import { RecommendationCard } from '../../components/recommendation/RecommendationCard';
import { ProfileSummaryStrip } from '@/components/hub/ProfileSummaryStrip';
import { RecommendedPath } from '@/components/hub/RecommendedPath';
import { HubTabBar, TAB_LABELS } from '@/components/hub/HubTabBar';
import { LayoutGrid, Shield, Zap, ArrowUpRight, Search, Filter, ChevronRight, Star, TrendingUp, BookOpen, Wallet, Globe, Play } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { getHubState, isHubPersonalized } from '@/lib/api';
import type { HubState, HubItem } from '@/types';
import { NextBestActionCard } from '@/components/hub/NextBestActionCard';
import { MissedOpportunities } from '@/components/hub/MissedOpportunities';

function getAITags(item: HubItem): string[] {
  const tags: string[] = [];
  if (item.priorityLabel === "Best Match") tags.push("Best Match");
  if (item.category === "ET_PRIME") tags.push("Deep Research", "Long-Term");
  if (item.category === "ET_MARKETS") tags.push("Live Tracking", "High Signal");
  if (item.category === "WEALTH") tags.push("Goal Aligned", "Planning");
  if (item.category === "MASTERCLASS") tags.push("Beginner Friendly", "Expert-Led");
  if (item.category === "GLOBAL_INSIGHTS") tags.push("Macro View", "Advanced Insights");
  if (item.isLive) tags.push("Live Now");
  return tags;
}

export default function HubPage() {
  const categories = ["All", "ET Prime", "ET Markets", "Wealth", "Masterclass"];

  const [hubState, setHubState] = useState<HubState | null>(null);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [savedTrack, setSavedTrack] = useState<string[]>(hubState?.savedTrack ?? []);

  const refetchHub = useCallback(() => {
    setError(false);
    getHubState()
      .then(setHubState)
      .catch(() => setError(true));
  }, []);

  async function handleSaveToggle(itemId: string) {
    const action = savedTrack.includes(itemId) ? 'remove' : 'save';
    setSavedTrack(prev =>
      action === 'save' ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );

    // persist in background
    try {
      await fetch('/api/hub/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, action }),
      });
    } catch (e) {
      // ignore — optimistic UI already applied
    }
  }

  const filteredItems = useMemo(() => {
    if (!hubState) return [];
    if (activeTab === 'ALL') return hubState.hubItems ?? [];
    return (hubState.hubItems ?? []).filter((it) => it.category === activeTab);
  }, [hubState, activeTab]);
  
  const tabCopyMap: Record<string, { headline: string; subline: string }> = {
    ALL: { headline: 'All Recommendations', subline: 'Explore curated content across the ET ecosystem' },
    ET_PRIME: { headline: 'ET Prime', subline: 'Long-form analysis and deep research tailored for you' },
    ET_MARKETS: { headline: 'ET Markets', subline: 'Live market signals and short-term alpha opportunities' },
    WEALTH: { headline: 'Wealth', subline: 'Personal finance and portfolio planning recommendations' },
    MASTERCLASS: { headline: 'Masterclass', subline: 'Curated learning tracks to level up your investing knowledge' },
    GLOBAL_INSIGHTS: { headline: 'Global Insights', subline: 'Macro perspectives and advanced thematic research' },
  };

  useEffect(() => {
    refetchHub();
  }, [refetchHub]);

  const isPersonalized = useMemo(() => (hubState ? isHubPersonalized(hubState) : false), [hubState]);
  const hubItems = hubState?.hubItems ?? [];
  const profileSummary = hubState?.profileSummary;
  const journeyPath = hubState?.journeyPath;

  if (error) {
    return (
      <main className="min-h-screen pt-16 bg-[#0b0e14] flex flex-col">
        <Navbar />
        <div className="text-center py-16 text-zinc-500 text-sm">
          Unable to load your hub right now. Try refreshing.
        </div>
      </main>
    );
  }

  // Empty state when a specific tab has no items
  if (activeTab !== 'ALL' && filteredItems.length === 0 && hubState) {
    return (
      <main className="min-h-screen pt-16 bg-[#0b0e14] flex flex-col">
        <Navbar />
        {/* preserve banner/profile strip */}
        {hubState && (!isPersonalized ? (
          <div className="mx-auto max-w-7xl px-4 mb-4">
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 
                            text-sm text-zinc-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 inline-block" />
              Personalised recommendations will appear after your first chat session
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-4 mb-4">
            <div className="rounded-lg border border-green-800/50 bg-green-950/30 px-4 py-2.5 
                            text-sm text-green-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              {profileSummary ? (
                <>
                  Recommended for a {profileSummary.persona}
                  <span className="ml-2 text-green-600">·</span>
                  <span className="ml-2 text-green-600/70">
                    Updated from your onboarding profile and live interactions
                  </span>
                </>
              ) : (
                'Showing recommendations tailored to your profile'
              )}
            </div>
          </div>
        ))}

        <ProfileSummaryStrip profileSummary={profileSummary} isPersonalized={isPersonalized} />

        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 mb-4">
            <span className="text-zinc-500 text-xl">·</span>
          </div>
          <p className="text-zinc-400 font-medium">
            No {TAB_LABELS[activeTab]} recommendations yet
          </p>
          <p className="text-zinc-600 text-sm mt-1">
            Continue your profile to unlock personalised {TAB_LABELS[activeTab]} content
          </p>
          <button
            onClick={() => setActiveTab('ALL')}
            className="mt-4 text-sm text-green-500 hover:text-green-400 underline underline-offset-2"
          >
            Back to all recommendations
          </button>
        </div>
      </main>
    );
  }

  function getContextualCTAForItem(category?: string, priorityLabel?: string, ctaLabel?: string) {
    if (priorityLabel === 'Best Match') {
      if (category === 'ET_PRIME') return 'Open My Best Match';
      if (category === 'WEALTH') return 'Start Here';
      if (category === 'ET_MARKETS') return 'Track My Markets';
    }
    if (category === 'ET_PRIME') return 'Explore Your Edge';
    if (category === 'ET_MARKETS') return 'View Live Markets';
    if (category === 'WEALTH') return 'Build My Plan';
    if (category === 'MASTERCLASS') return 'View My Track';
    if (category === 'GLOBAL_INSIGHTS') return 'Unlock Insights';
    return ctaLabel ?? 'Explore';
  }

  return (
    <main className="min-h-screen pt-16 bg-[#0b0e14] flex flex-col">
      <Navbar />
      
      {/* Hub Header */}
      <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-headline tracking-tight">
              {isPersonalized && profileSummary ? 'Built for Your Investing Style' : 'Your ET Intelligence Hub'}
            </h1>
            <p className="text-[10px] text-tertiary uppercase font-bold tracking-widest">
              {isPersonalized && profileSummary
                ? 'AI-curated access across the ET ecosystem'
                : 'Complete your profile to unlock personalised recommendations'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <Search className="w-3 h-3 text-tertiary" />
            <input type="text" placeholder="Search Ecosystem..." className="bg-transparent border-none focus:ring-0 text-xs text-white placeholder:text-tertiary w-40" />
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <HubTabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            sectionScores={hubState?.sectionScores ?? []}
            isPersonalized={isPersonalized}
          />
        </div>
      </div>

      {/* Personalization banner */}
      {hubState && (!isPersonalized ? (
        <div className="mx-auto max-w-7xl px-4 mb-4">
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 
                          text-sm text-zinc-400 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 inline-block" />
            Personalised recommendations will appear after your first chat session
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 mb-4">
          <div className="rounded-lg border border-green-800/50 bg-green-950/30 px-4 py-2.5 
                          text-sm text-green-400 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            {profileSummary ? (
              <>
                Recommended for a {profileSummary.persona}
                <span className="ml-2 text-green-600">·</span>
                <span className="ml-2 text-green-600/70">
                  Updated from your onboarding profile and live interactions
                </span>
              </>
            ) : (
              'Showing recommendations tailored to your profile'
            )}
          </div>
        </div>
      ))}

      {/* Next best action card (first inside hub content area) */}
      <NextBestActionCard nextBestAction={hubState?.nextBestAction ?? null} isPersonalized={isPersonalized} />

      {/* Profile summary strip */}
      <ProfileSummaryStrip profileSummary={profileSummary} isPersonalized={isPersonalized} />

      {/* Tab specific headline/subline */}
      {hubState && (
        <div className="mx-auto max-w-7xl px-4 mb-6">
          <h2 className="text-xl font-semibold text-white">{tabCopyMap[activeTab]?.headline}</h2>
          <p className="text-sm text-zinc-400 mt-1">{tabCopyMap[activeTab]?.subline}</p>
        </div>
      )}

      {!hubState ? (
        <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-zinc-800/60 animate-pulse h-48 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* ET Prime Card - Large (dynamic top item when ALL) */}
            {activeTab === 'ALL' && (
              <>
                <div className="md:col-span-2 md:row-span-2 bg-surface-container-low rounded-3xl border border-white/5 p-8 relative overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
                  {/* hero match score badge */}
                  {hubItems[0] && (hubItems[0].relevanceScore ?? 0) > 0 && (
                    <div className="absolute top-4 right-4 text-right">
                      <span className="text-2xl font-bold text-green-400">
                        {hubItems[0].relevanceScore}%
                      </span>
                      <p className="text-xs text-zinc-500">Match</p>
                    </div>
                  )}

                  <div className="absolute top-0 right-0 p-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="mb-auto">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 block">
                        {hubItems[0]?.priorityLabel?.toUpperCase() ?? 'TOP RECOMMENDATION'}
                      </span>
                      <h2 className="text-4xl font-black font-headline text-white mb-4 leading-tight">{hubItems[0]?.title}</h2>
                      <p className="text-tertiary text-sm max-w-md leading-relaxed">
                        {hubItems[0]?.description}
                      </p>

                      {hubItems[0]?.matchReason && (
                        <p className="mt-3 text-sm text-zinc-400 italic">
                          {hubItems[0]?.matchReason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-6 pt-8 border-t border-white/5 mt-8">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-xs font-bold text-white">Daily Updates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
                        <span className="text-xs font-bold text-white">Exclusive Access</span>
                      </div>
                      <button className="ml-auto bg-primary text-black px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:brightness-110 active:scale-95">
                        {hubItems[0] ? getContextualCTAForItem(hubItems[0].category, hubItems[0].priorityLabel) : 'Explore'}
                      </button>
                    </div>
                  </div>
                  {/* Background Decoration */}
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Right-side smaller cards: dynamic items 1..4 */}
                {hubItems.slice(1, 5).map((item) => (
                  <div key={item.id} className="bg-surface-container-high rounded-3xl border border-white/5 p-6 group cursor-pointer hover:border-secondary-container/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-secondary-container" />
                      </div>
                      {item.isLive ? (
                        <span className="text-[10px] font-bold text-secondary-container uppercase tracking-widest">Live</span>
                      ) : item.badge ? (
                        <span className="text-[10px] font-bold text-secondary-container uppercase tracking-widest">{item.badge}</span>
                      ) : null}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-tertiary text-xs mb-6">{item.description}</p>

                    {item.stats && (
                      <div className="space-y-3">
                        {item.stats.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-black/20 border border-white/5">
                            <span className="text-[10px] text-tertiary uppercase font-bold">{s.label}</span>
                            <span className="text-xs font-bold text-primary">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {/* Personalized hub items */}
            {filteredItems.map((item) => {
               const rawScore = item.relevanceScore ?? 0;
               const computedMatchScore = Math.min(Math.round((rawScore / 10) * 100), 99);
               const matchScore = computedMatchScore === 0 ? undefined : computedMatchScore;

               return (
                 <RecommendationCard
                   key={item.id}
                   recommendation={{
                     id: item.id,
                     title: item.title,
                     description: item.description,
                     confidence: Math.max(0, Math.min(1, rawScore)),
                     reasoning: item.matchReason ?? 'Tailored for your profile',
                     actions: [],
                   }}
                   relevanceScore={item.relevanceScore}
                   isPersonalized={isPersonalized}
                   priorityLabel={item.priorityLabel}
                   matchReason={item.matchReason}
                   aiTags={getAITags(item)}
                   matchScore={isPersonalized ? matchScore : undefined}
                   isSaved={savedTrack.includes(item.id)}
                   onSaveToggle={handleSaveToggle}
                 />
               );
             })}
          </div>

          {/* Recommended journey path */}
          <RecommendedPath journeyPath={journeyPath} isPersonalized={isPersonalized} />

          {/* Missed opportunities section */}
          <MissedOpportunities missedOpportunities={hubState?.missedOpportunities ?? []} isPersonalized={isPersonalized} />

          {/* Hidden chat refetch loop wiring (keeps layout unchanged) */}
          <div className="hidden">
            <ChatContainer
              onConversationUpdate={() => {
                getHubState().then(setHubState);
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
