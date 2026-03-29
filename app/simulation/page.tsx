'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Activity, RotateCcw, Download, Save, ChevronRight, ShieldCheck, TrendingUp, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { getSimulationState, getSimulationReasoning, recalculateSimulation } from '../../lib/api';
import { SimulationScenario, UserProfile } from '../../types';
import { SimulationChatbot } from '../../components/ui/SimulationChatbot';
import { ViewPlansButton } from '../../components/ui/ViewPlansButton';
import { loadProfile, ProfileData, defaultProfile } from '../../lib/profileStore';

export default function SimulationPage() {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfile);
  const [isReady, setIsReady] = useState(false);
  const [reasoning, setReasoning] = useState<string>('');
  const [isRecalculating, setIsRecalculating] = useState(false);

  useEffect(() => {
    const data = loadProfile();
    console.log("Simulation page loaded profile:", data);
    setProfileData(data);
    setIsReady(true);
  }, []);

  // Show nothing until localStorage is read
  if (!isReady) return null;

  // Show overlay if profiling not complete
  if (!profileData.isProfilingComplete) {
    return (
      <main className="min-h-screen pt-16 bg-[#0b0e14] flex flex-col overflow-hidden">
        <Navbar />
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-surface-container rounded-2xl border border-white/10 p-8 max-w-md text-center">
            <h2 className="text-xl font-bold text-white mb-4">Complete your profile in The Terminal</h2>
            <p className="text-tertiary mb-6">to unlock your simulation</p>
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

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      // For now, just show loading state since we're using profile data
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Failed to recalculate:', error);
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <main className="min-h-screen pt-16 bg-[#0b0e14] flex flex-col overflow-hidden">
      <Navbar />

      <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-secondary-container" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-headline tracking-tight">Future Outcome Simulation</h1>
              <span className="text-[10px] bg-secondary-container/10 text-secondary-container border border-secondary-container/20 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">live</span>
            </div>
            <p className="text-[10px] text-tertiary uppercase font-bold tracking-widest">Profile-aware scenario engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-tertiary hover:text-white px-4 py-2 rounded-lg text-xs font-bold border border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRecalculating ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" /> Recalculating...
              </>
            ) : (
              <>
                <RotateCcw className="w-3 h-3" /> Recalculate
              </>
            )}
          </button>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-tertiary hover:text-white px-4 py-2 rounded-lg text-xs font-bold border border-white/10 transition-all">
            <Save className="w-3 h-3" /> Save Scenario
          </button>
          <button className="flex items-center gap-2 bg-primary text-black px-6 py-2 rounded-lg text-xs font-bold transition-all hover:brightness-110 active:scale-95">
            <Download className="w-3 h-3" /> Export Data
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto space-y-8">
          <div className="bg-surface-container-low rounded-3xl border border-white/5 p-8 relative overflow-hidden h-[600px] flex flex-col">
            <div className="flex justify-between items-start mb-8 gap-6 flex-wrap">
              <div>
                <h2 className="text-2xl font-black font-headline text-white mb-1">{profileData.projectionName || 'Loading scenario...'}</h2>
                <p className="text-tertiary text-xs max-w-xl">{profileData.primaryGoal || 'Preparing scenario output.'}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <div className="text-2xl font-black font-headline text-primary">₹{profileData.optimistic}L</div>
                  <div className="text-[8px] text-tertiary uppercase font-bold">Optimistic</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-headline text-secondary-container">₹{profileData.expected}L</div>
                  <div className="text-[8px] text-tertiary uppercase font-bold">Expected</div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative flex items-end justify-between gap-2">
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1000 500" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-primary" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00C805" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00C805" />
                  </linearGradient>
                </defs>
                {/* Nifty 50 Benchmark Line (12% CAGR) */}
                <polyline
                  fill="none"
                  stroke="#ffffff30"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  points="0,440,111,392,222,344,333,296,444,248,555,200,666,152,777,104,888,56,1000,8"
                  className="opacity-50"
                />
                {/* User Projection Line */}
                <polyline
                  fill="none"
                  stroke="url(#grad-primary)"
                  strokeWidth="5"
                  points={(() => {
                    const optimistic = profileData.optimistic || 42;
                    const expected = profileData.expected || 28;
                    // Generate growth curve points
                    return Array.from({ length: 10 }, (_, i) => {
                      const progress = i / 9;
                      const value = expected + (optimistic - expected) * Math.pow(progress, 1.5);
                      return `${(1000 / 9) * i},${500 - (value / 100) * 4}`;
                    }).join(' ');
                  })()}
                  className="drop-shadow-[0_0_15px_rgba(0,200,5,0.5)]"
                />
                {/* Nifty 50 Label */}
                <text x="850" y="100" fill="#ffffff50" fontSize="10" className="text-[10px]">Nifty 50 (12% CAGR)</text>
              </svg>
            </div>

            <div className="mt-8 flex justify-between items-center text-[10px] font-bold text-tertiary uppercase tracking-widest">
              <span>Year 0</span>
              <span>Year 5</span>
              <span>Year 10</span>
              <span>Year 15</span>
              <span>Year 20</span>
            </div>
          </div>

          {/* Why This Projection? Section */}
          <div className="bg-surface-container-low rounded-3xl border border-white/5 p-6">
            <h3 className="text-lg font-black font-headline text-white mb-3">Why This Projection?</h3>
            <p className="text-tertiary text-sm leading-relaxed">{profileData.projectionReasoning || "Your projection is being calculated..."}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Growth Vector', value: profileData.growthVector || 'Calculating...', tone: 'positive' },
              { label: 'Drawdown Guard', value: profileData.drawdownGuard || 'Calculating...', tone: 'positive' },
              { label: 'Hedge Efficiency', value: profileData.hedgeEfficiency || 'Calculating...', tone: 'positive' }
            ].map((metric: any, index: number) => (
              <div key={metric.label} className="bg-surface-container-high rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  {metric.tone === 'positive' && <TrendingUp className="w-4 h-4 text-primary" />}
                  {metric.tone === 'warning' && <AlertTriangle className="w-4 h-4 text-secondary-container" />}
                  {metric.tone === 'neutral' && <ShieldCheck className="w-4 h-4 text-white" />}
                  <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest">{metric.label}</h4>
                </div>
                <div className="text-2xl font-black font-headline text-white">{metric.value}</div>
                <p className="text-[10px] text-tertiary mt-1">Profile analysis</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 xl:w-96 border-l border-white/5 bg-[#0b0e14] p-6 flex flex-col overflow-y-auto space-y-8">
          <div>
            <h2 className="font-headline text-xl font-extrabold tracking-tight">Impact Breakdown</h2>
            <p className="text-tertiary text-[10px] uppercase font-bold tracking-widest">Built from {profileData.userName || 'your'} profile</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-surface-container-low p-5">
            <div className="text-[10px] uppercase tracking-widest font-bold text-primary">Primary goal</div>
            <div className="mt-2 text-lg font-bold text-white">{profileData.primaryGoal || 'Your Goal'}</div>
            <div className="mt-3 text-xs text-tertiary">Horizon: {profileData.investmentHorizon || 'Long Term'} • Risk: {profileData.riskTolerance || 'Balanced'}</div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-4">Recommended Adjustments</h4>
            <div className="space-y-3">
              {profileData.recommendations.length > 0 ? (
                profileData.recommendations.slice(0, 3).map((rec: any, index: number) => (
                  <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[8px] bg-primary/20 text-primary px-2 py-1 rounded font-black uppercase tracking-widest">
                            {rec.section}
                          </span>
                          <span className="text-[8px] text-tertiary">{rec.matchScore}% match</span>
                        </div>
                        <div className="text-sm text-white font-medium mb-2">{rec.title}</div>
                        <div className="text-[10px] text-tertiary leading-relaxed">{rec.description}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex gap-2">
                        <ViewPlansButton 
                          product={
                            rec.section === 'ET PRIME' ? 'ET Prime' : 
                            rec.section === 'ET MARKETS' ? 'ET Markets' : 'ET Wealth'
                          }
                          className="flex-1"
                        />
                        <a 
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-primary text-black px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110 active:scale-95"
                        >
                          Read on ET <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback hardcoded cards
                <>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[8px] bg-primary/20 text-primary px-2 py-1 rounded font-black uppercase tracking-widest">ET PRIME</span>
                          <span className="text-[8px] text-tertiary">94% match</span>
                        </div>
                        <div className="text-sm text-white font-medium mb-2">Market Analysis Report</div>
                        <div className="text-[10px] text-tertiary leading-relaxed">Deep dive into current market trends</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[8px] bg-secondary-container/20 text-secondary-container px-2 py-1 rounded font-black uppercase tracking-widest">ET MARKETS</span>
                          <span className="text-[8px] text-tertiary">89% match</span>
                        </div>
                        <div className="text-sm text-white font-medium mb-2">Portfolio Rebalancing Guide</div>
                        <div className="text-[10px] text-tertiary leading-relaxed">Optimize your asset allocation</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[8px] bg-tertiary px-2 py-1 rounded font-black uppercase tracking-widest">ET WEALTH</span>
                          <span className="text-[8px] text-tertiary">85% match</span>
                        </div>
                        <div className="text-sm text-white font-medium mb-2">Risk Management Strategies</div>
                        <div className="text-[10px] text-tertiary leading-relaxed">Protect your wealth with hedging</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Simulation Chatbot */}
      <SimulationChatbot />
    </main>
  );
}
