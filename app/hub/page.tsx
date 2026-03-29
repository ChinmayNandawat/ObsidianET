'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { ChatContainer } from '../../components/chat/ChatContainer';
import { RecommendationCard } from '../../components/recommendation/RecommendationCard';
import { ProfileSummaryStrip } from '../../components/hub/ProfileSummaryStrip';
import { RecommendedPath } from '../../components/hub/RecommendedPath';
import { HubTabBar, TAB_LABELS } from '../../components/hub/HubTabBar';
import { NextBestActionCard } from '../../components/hub/NextBestActionCard';
import { MissedOpportunities } from '../../components/hub/MissedOpportunities';
import { LayoutGrid, Shield, Zap, ArrowUpRight, Search, Filter, ChevronRight, Star, TrendingUp, BookOpen, Wallet, Globe, Play, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { getHubState, saveHubTrack } from '../../lib/api';
import type { HubState, HubItem } from '../../types';
import { ViewPlansButton } from '../../components/ui/ViewPlansButton';

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
  const [hubState, setHubState] = useState<HubState | null>(null);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [savedTrack, setSavedTrack] = useState<string[]>([]);

  const refetchHub = useCallback(() => {
    setError(false);
    getHubState()
      .then((data) => {
        setHubState(data);
        if (data.savedTrack) {
          setSavedTrack(data.savedTrack);
        }
      })
      .catch(() => setError(true));
  }, []);

  async function handleSaveToggle(itemId: string) {
    const action = savedTrack.includes(itemId) ? 'remove' : 'save';
    setSavedTrack(prev =>
      action === 'save' ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
    
    try {
      await saveHubTrack(itemId, action);
    } catch (err) {
      console.error('Failed to save track:', err);
    }
  }

  const filteredItems = useMemo(() => {
    if (!hubState?.items) return [];
    if (activeTab === 'ALL') return hubState.items;
    return hubState.items.filter(item => item.category === activeTab);
  }, [hubState, activeTab]);

  useEffect(() => {
    refetchHub();
  }, [refetchHub]);

  const tabCopyMap: Record<string, string> = {
    ALL: 'All',
    ET_PRIME: 'ET Prime',
    ET_MARKETS: 'ET Markets',
    WEALTH: 'Wealth',
    MASTERCLASS: 'Masterclass',
    GLOBAL_INSIGHTS: 'Global Insights',
  };

  if (error) {
    return (
      <main className="min-h-screen pt-16 bg-[#0b0e14] flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Hub Unavailable</h2>
            <p className="text-tertiary mb-6">Unable to load your personalized hub. Please try again.</p>
            <button
              onClick={refetchHub}
              className="bg-primary text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 bg-[#0b0e14] flex flex-col overflow-hidden">
      <Navbar />

      <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-secondary-container" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-headline tracking-tight">Active Hub</h1>
              <span className="text-[10px] bg-secondary-container/10 text-secondary-container border border-secondary-container/20 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">live</span>
            </div>
            <p className="text-[10px] text-tertiary uppercase font-bold tracking-widest">Personalized ET ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <Search className="w-3 h-3 text-tertiary" />
            <input type="text" placeholder="Search Ecosystem..." className="bg-transparent border-none focus:ring-0 text-xs text-white placeholder:text-tertiary w-40" />
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <HubTabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            sectionScores={hubState?.sectionScores?.map(score => ({
              category: score.category as any,
              score: score.score
            })) || []}
            isPersonalized={hubState?.isPersonalized || false}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {hubState?.profileSummary && (
            <ProfileSummaryStrip
              profileSummary={hubState.profileSummary}
              isPersonalized={hubState.isPersonalized}
            />
          )}

          {hubState?.journeyPath && hubState.journeyPath.length > 0 && (
            <RecommendedPath
              journeyPath={hubState.journeyPath}
              isPersonalized={hubState.isPersonalized}
            />
          )}

          {hubState?.nextBestAction && (
            <NextBestActionCard
              nextBestAction={hubState.nextBestAction}
              isPersonalized={hubState.isPersonalized}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-surface-container-low rounded-2xl border border-white/5 p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                onClick={() => window.open(item.href, '_blank')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded font-black uppercase tracking-widest">
                        {item.source}
                      </span>
                      {item.priorityLabel && (
                        <span className={`text-[8px] px-2 py-1 rounded font-black uppercase tracking-widest ${
                          item.priorityLabel === 'Best Match' ? 'bg-green-500/20 text-green-400' :
                          item.priorityLabel === 'Strong Match' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-zinc-500/20 text-zinc-400'
                        }`}>
                          {item.priorityLabel}
                        </span>
                      )}
                      {item.isLive && (
                        <span className="text-[8px] bg-red-500/20 text-red-400 px-2 py-1 rounded font-black uppercase tracking-widest animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-tertiary text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {getAITags(item).map((tag, i) => (
                        <span key={i} className="text-[8px] bg-white/5 text-tertiary px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[10px] text-tertiary">
                        <Star className="w-3 h-3" />
                        <span>{Math.round(item.matchScore * 100)}% match</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveToggle(item.id);
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          savedTrack.includes(item.id)
                            ? 'bg-primary text-black'
                            : 'bg-white/5 text-tertiary hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <ViewPlansButton 
                        product={
                          item.source.includes('Prime') ? 'ET Prime' : 
                          item.source.includes('Markets') ? 'ET Markets' : 'ET Wealth'
                        }
                        className="flex-1"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.href, '_blank');
                        }}
                        className="flex-1 bg-primary text-black px-3 py-2 rounded-lg text-xs font-bold transition-all hover:brightness-110 active:scale-95"
                      >
                        Read on ET
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {hubState?.missedOpportunities && hubState.missedOpportunities.length > 0 && (
            <MissedOpportunities
              missedOpportunities={hubState.missedOpportunities}
              isPersonalized={hubState.isPersonalized}
            />
          )}

          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">Recommended for You</h2>
            <div className="space-y-4">
              {hubState?.items?.slice(0, 3).map((rec) => (
                <RecommendationCard key={rec.id} recommendation={{
                  id: rec.id,
                  title: rec.title,
                  description: rec.description,
                  confidence: rec.matchScore,
                  reasoning: rec.matchReason || `Based on your interest in ${rec.tags.join(', ')}`,
                  ctaLabel: 'Read More',
                  link: rec.href,
                  source: rec.source,
                  tags: rec.tags
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {hubState && (
        <div className="hidden">
          <ChatContainer
            session={null}
            onSessionUpdate={() => {
              refetchHub();
            }}
          />
        </div>
      )}
    </main>
  );
}
