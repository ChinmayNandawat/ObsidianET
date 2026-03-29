'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Activity, RotateCcw, Download, Save, ChevronRight, ShieldCheck, TrendingUp, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { getSimulationState, getSimulationReasoning, recalculateSimulation } from '../../lib/api';
import { SimulationScenario, UserProfile } from '../../types';
import { SimulationChatbot } from '../../components/ui/SimulationChatbot';
import { ViewPlansButton } from '../../components/ui/ViewPlansButton';

export default function SimulationPage() {
  const [simulation, setSimulation] = useState<SimulationScenario | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reasoning, setReasoning] = useState<string>('');
  const [isRecalculating, setIsRecalculating] = useState(false);

  useEffect(() => {
    getSimulationState().then((data) => {
      setSimulation(data.simulation);
      setProfile(data.profile);
      
      // Get reasoning for the simulation
      if (data.simulation) {
        getSimulationReasoning(data.simulation.optimistic, data.simulation.expected)
          .then(reasoningData => setReasoning(reasoningData.reasoning))
          .catch(error => console.error('Failed to get reasoning:', error));
      }
    }).catch((error) => console.error('Failed to load simulation', error));
  }, []);

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      const newSimulation = await recalculateSimulation();
      setSimulation(newSimulation);
      
      // Get new reasoning
      getSimulationReasoning(newSimulation.optimistic, newSimulation.expected)
        .then(reasoningData => setReasoning(reasoningData.reasoning))
        .catch(error => console.error('Failed to get reasoning:', error));
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
                <h2 className="text-2xl font-black font-headline text-white mb-1">{simulation?.title || 'Loading scenario...'}</h2>
                <p className="text-tertiary text-xs max-w-xl">{simulation?.subtitle || 'Preparing scenario output.'}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <div className="text-2xl font-black font-headline text-primary">{simulation?.optimistic || '--'}</div>
                  <div className="text-[8px] text-tertiary uppercase font-bold">Optimistic</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-headline text-secondary-container">{simulation?.expected || '--'}</div>
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
                  points={(simulation?.points || [20, 35, 40, 55, 62, 70, 82, 90, 95, 100]).map((point, index, array) => `${(1000 / (array.length - 1)) * index},${500 - point * 4}`).join(' ')}
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
          {reasoning && (
            <div className="bg-surface-container-low rounded-3xl border border-white/5 p-6">
              <h3 className="text-lg font-black font-headline text-white mb-3">Why This Projection?</h3>
              <p className="text-tertiary text-sm leading-relaxed">{reasoning}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {simulation?.metrics.map((metric) => (
              <div key={metric.label} className="bg-surface-container-high rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  {metric.tone === 'positive' && <TrendingUp className="w-4 h-4 text-primary" />}
                  {metric.tone === 'warning' && <AlertTriangle className="w-4 h-4 text-secondary-container" />}
                  {metric.tone === 'neutral' && <ShieldCheck className="w-4 h-4 text-white" />}
                  <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest">{metric.label}</h4>
                </div>
                <div className="text-2xl font-black font-headline text-white">{metric.value}</div>
                <p className="text-[10px] text-tertiary mt-1">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 xl:w-96 border-l border-white/5 bg-[#0b0e14] p-6 flex flex-col overflow-y-auto space-y-8">
          <div>
            <h2 className="font-headline text-xl font-extrabold tracking-tight">Impact Breakdown</h2>
            <p className="text-tertiary text-[10px] uppercase font-bold tracking-widest">Built from {profile?.name || 'your'} profile</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-surface-container-low p-5">
            <div className="text-[10px] uppercase tracking-widest font-bold text-primary">Primary goal</div>
            <div className="mt-2 text-lg font-bold text-white">{profile?.primaryGoal || 'Complete onboarding'}</div>
            <div className="mt-3 text-xs text-tertiary">Horizon: {profile?.investmentHorizon || '--'} • Risk: {profile?.riskLabel || '--'}</div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-4">Recommended Adjustments</h4>
            <div className="space-y-3">
              {simulation?.adjustments.map((item, i) => (
                <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">{i + 1}</div>
                        {item.etSection && (
                          <span className="text-[8px] bg-primary/20 text-primary px-2 py-1 rounded font-black uppercase tracking-widest">
                            {item.etSection}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white font-medium mb-2">{item.title}</div>
                      <div className="text-[10px] text-tertiary leading-relaxed">{item.detail}</div>
                    </div>
                  </div>
                  {item.etLink && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex gap-2">
                        <ViewPlansButton 
                          product={item.etSection === 'ET Prime' ? 'ET Prime' : item.etSection === 'ET Markets' ? 'ET Markets' : 'ET Wealth'}
                        />
                        <a 
                          href={item.etLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-primary text-black px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110 active:scale-95"
                        >
                          Read on ET <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Simulation Chatbot */}
      <SimulationChatbot simulation={simulation} profile={profile} />
    </main>
  );
}
