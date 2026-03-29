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
import { loadProfile, ProfileData, defaultProfile } from '../../lib/profileStore';

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
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isReady, setIsReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(false);
  const [savedTrack, setSavedTrack] = useState<string[]>([]);

  useEffect(() => {
    const data = loadProfile();
    console.log("Hub page loaded profile:", data);
    setProfile(data);
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  if (!profile.isProfilingComplete) {
    return (
      <main className="min-h-screen pt-16 bg-[#0b0e14] flex flex-col overflow-hidden">
        <Navbar />
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-surface-container rounded-2xl border border-white/10 p-8 max-w-md text-center">
            <h2 className="text-xl font-bold text-white mb-4">Complete your profile first</h2>
            <p className="text-tertiary mb-6">to unlock your personalized ET ecosystem</p>
            <a 
              href="/chat" 
              className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg text-sm font-bold transition-all hover:brightness-110"
            >
              Go to Terminal <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>
    );
  }

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

  const filterMap: Record<string, string> = {
  "All": "All",
  "ET Prime": "ET PRIME",
  "ET Markets": "ET MARKETS", 
  "Wealth": "ET WEALTH",
  "Masterclass": "ET MASTERCLASS",
  "Global Insights": "GLOBAL INSIGHTS"
};

const filteredRecs = useMemo(() => {
  if (activeFilter === "All") return profile.recommendations;
  return profile.recommendations.filter(r => r.section === filterMap[activeFilter]);
}, [profile.recommendations, activeFilter]);

const searchedRecs = useMemo(() => {
  return filteredRecs.filter(rec =>
    searchQuery === "" ||
    rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [filteredRecs, searchQuery]);

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
              onClick={() => window.location.reload()}
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
            <input 
              type="text" 
              placeholder="Search Ecosystem..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs text-white placeholder:text-tertiary w-40" 
            />
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <HubTabBar
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
            sectionScores={[]}
            isPersonalized={profile.isProfilingComplete}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {profile.isProfilingComplete && profile.geminiSummary && (
            <ProfileSummaryStrip
              profileSummary={{
                name: profile.userName || "User",
                persona: profile.geminiSummary,
                riskTolerance: profile.riskTolerance || "Balanced",
                investmentHorizon: profile.investmentHorizon || "Long Term",
                primaryGoal: profile.primaryGoal || "Growth",
                completionPercentage: 100
              }}
              isPersonalized={true}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedRecs.length > 0 ? (
              searchedRecs.slice(0, 3).map((rec: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-surface-container-low rounded-2xl border border-white/5 p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                  onClick={() => window.open(rec.url, '_blank')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded font-black uppercase tracking-widest">
                          {rec.section}
                        </span>
                        <span className="text-[8px] bg-green-500/20 text-green-400 px-2 py-1 rounded font-black uppercase tracking-widest">
                          {rec.matchScore}% match
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                        {rec.title}
                      </h3>
                      <p className="text-tertiary text-sm leading-relaxed mb-4">
                        {rec.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {rec.tags?.map((tag: string, i: number) => (
                          <span key={i} className="text-[8px] bg-white/5 text-tertiary px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[10px] text-tertiary">
                        <Star className="w-3 h-3" />
                        <span>{rec.matchScore}% match</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveToggle(rec.title);
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          savedTrack.includes(rec.title)
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
                          rec.section === 'ET PRIME' ? 'ET Prime' : 
                          rec.section === 'ET MARKETS' ? 'ET Markets' : 'ET Wealth'
                        }
                        className="flex-1"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(rec.url, '_blank');
                        }}
                        className="flex-1 bg-primary text-black px-3 py-2 rounded-lg text-xs font-bold transition-all hover:brightness-110 active:scale-95"
                      >
                        Read on ET
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Fallback hardcoded cards
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-surface-container-low rounded-2xl border border-white/5 p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded font-black uppercase tracking-widest">ET PRIME</span>
                        <span className="text-[8px] bg-green-500/20 text-green-400 px-2 py-1 rounded font-black uppercase tracking-widest">94% match</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">Market Analysis Report</h3>
                      <p className="text-tertiary text-sm leading-relaxed mb-4">Deep dive into current market trends</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="group bg-surface-container-low rounded-2xl border border-white/5 p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-secondary-container/20 text-secondary-container px-2 py-1 rounded font-black uppercase tracking-widest">ET MARKETS</span>
                        <span className="text-[8px] bg-green-500/20 text-green-400 px-2 py-1 rounded font-black uppercase tracking-widest">89% match</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">Portfolio Rebalancing Guide</h3>
                      <p className="text-tertiary text-sm leading-relaxed mb-4">Optimize your asset allocation</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group bg-surface-container-low rounded-2xl border border-white/5 p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-tertiary px-2 py-1 rounded font-black uppercase tracking-widest">ET WEALTH</span>
                        <span className="text-[8px] bg-green-500/20 text-green-400 px-2 py-1 rounded font-black uppercase tracking-widest">85% match</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">Risk Management Strategies</h3>
                      <p className="text-tertiary text-sm leading-relaxed mb-4">Protect your wealth with hedging</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">Recommended for You</h2>
            <div className="space-y-4">
              {profile.recommendations.length > 0 ? (
                <RecommendationCard recommendation={{
                  id: 'top-rec',
                  title: profile.recommendations[0].title,
                  description: profile.recommendations[0].description,
                  confidence: profile.recommendations[0].matchScore / 100,
                  reasoning: profile.recommendations[0].geminiReason || 'Based on your profile analysis',
                  ctaLabel: 'Read More',
                  link: profile.recommendations[0].url,
                  source: profile.recommendations[0].product,
                  tags: profile.recommendations[0].tags || []
                }} />
              ) : (
                <RecommendationCard recommendation={{
                  id: 'fallback-rec',
                  title: 'Market Analysis Report',
                  description: 'Deep dive into current market trends and investment opportunities',
                  confidence: 0.94,
                  reasoning: 'Based on your interest in financial markets and growth opportunities',
                  ctaLabel: 'Read More',
                  link: 'https://etprime.economictimes.com',
                  source: 'ET Prime',
                  tags: ['Market Analysis', 'Investment', 'Growth']
                }} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden">
        <ChatContainer
          session={null}
          onSessionUpdate={() => {}}
        />
      </div>
    </main>
  );
}
