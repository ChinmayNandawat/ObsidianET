import { Navbar } from '../../components/layout/Navbar';
import { Activity, Zap, Play, RotateCcw, Share2, Download, Save, ChevronRight, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function SimulationPage() {
  return (
    <main className="min-h-screen pt-16 bg-[#0b0e14] flex flex-col overflow-hidden">
      <Navbar />
      
      {/* Simulation Header */}
      <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-secondary-container" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-headline tracking-tight">Future Outcome Simulation</h1>
              <span className="text-[10px] bg-secondary-container/10 text-secondary-container border border-secondary-container/20 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">v2.0</span>
            </div>
            <p className="text-[10px] text-tertiary uppercase font-bold tracking-widest">Recursive Probability Mapping</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-tertiary hover:text-white px-4 py-2 rounded-lg text-xs font-bold border border-white/10 transition-all">
            <RotateCcw className="w-3 h-3" /> Recalculate
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
        {/* Main Chart Area */}
        <div className="flex-1 p-8 overflow-y-auto space-y-8">
          <div className="bg-surface-container-low rounded-3xl border border-white/5 p-8 relative overflow-hidden h-[600px] flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black font-headline text-white mb-1">Projection Alpha-7</h2>
                <p className="text-tertiary text-xs">Monte Carlo Simulation • 10,000 Iterations</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <div className="text-2xl font-black font-headline text-primary">$4.2M</div>
                  <div className="text-[8px] text-tertiary uppercase font-bold">Optimistic</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-headline text-secondary-container">$2.8M</div>
                  <div className="text-[8px] text-tertiary uppercase font-bold">Expected</div>
                </div>
              </div>
            </div>

            {/* Placeholder for Chart */}
            <div className="flex-1 relative flex items-end justify-between gap-2">
              <div className="absolute inset-0 pointer-events-none opacity-20" 
                   style={{ backgroundImage: 'linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              {/* Simulated Chart Path */}
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                <path 
                  d="M0,400 Q100,380 200,350 T400,280 T600,200 T800,150 T1000,100" 
                  fill="none" 
                  stroke="url(#grad-primary)" 
                  strokeWidth="4" 
                  className="drop-shadow-[0_0_15px_rgba(0,200,5,0.5)]"
                />
                <path 
                  d="M0,400 Q100,390 200,370 T400,320 T600,280 T800,250 T1000,220" 
                  fill="none" 
                  stroke="url(#grad-secondary)" 
                  strokeWidth="4" 
                  className="drop-shadow-[0_0_15px_rgba(0,241,254,0.5)]"
                />
                <defs>
                  <linearGradient id="grad-primary" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00C805" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00C805" />
                  </linearGradient>
                  <linearGradient id="grad-secondary" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f1fe" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00f1fe" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Data Points */}
              <div className="absolute top-1/4 left-1/4 group cursor-pointer">
                <div className="w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20 animate-pulse"></div>
                <div className="absolute top-6 left-0 bg-surface-container-high border border-white/10 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  <div className="text-[10px] font-bold text-tertiary uppercase mb-1">Year 5 Milestone</div>
                  <div className="text-sm font-bold text-white">$1.2M Liquidity Event</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center text-[10px] font-bold text-tertiary uppercase tracking-widest">
              <span>Year 0</span>
              <span>Year 5</span>
              <span>Year 10</span>
              <span>Year 15</span>
              <span>Year 20</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-surface-container-high rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Growth Vector</h4>
              </div>
              <div className="text-2xl font-black font-headline text-white">+12.4%</div>
              <p className="text-[10px] text-tertiary mt-1">Annualized Alpha Target</p>
            </div>
            <div className="bg-surface-container-high rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-secondary-container" />
                <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Max Drawdown</h4>
              </div>
              <div className="text-2xl font-black font-headline text-white">-8.2%</div>
              <p className="text-[10px] text-tertiary mt-1">95% Confidence Interval</p>
            </div>
            <div className="bg-surface-container-high rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Hedge Efficiency</h4>
              </div>
              <div className="text-2xl font-black font-headline text-white">94%</div>
              <p className="text-[10px] text-tertiary mt-1">Obsidian Obsidian Protection</p>
            </div>
          </div>
        </div>

        {/* Side Panel - Impact Breakdown */}
        <div className="w-80 xl:w-96 border-l border-white/5 bg-[#0b0e14] p-6 flex flex-col overflow-y-auto space-y-8">
          <div>
            <h2 className="font-headline text-xl font-extrabold tracking-tight">Impact Breakdown</h2>
            <p className="text-tertiary text-[10px] uppercase font-bold tracking-widest">Variable Sensitivity Analysis</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Market Volatility</label>
                <span className="text-secondary-container text-xs font-bold">High Impact</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-secondary-container rounded-full"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Alpha Yield</label>
                <span className="text-primary text-xs font-bold">Optimal</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Risk Exposure</label>
                <span className="text-white text-xs font-bold">Mitigated</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[24%] bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <h4 className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-4">Recommended Adjustments</h4>
            <div className="space-y-3">
              {[
                "Increase Hedge on Tech Sector",
                "Rebalance Alpha Cluster B",
                "Initiate Yield Lock Sequence"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group cursor-pointer hover:border-primary/30 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                    {i+1}
                  </div>
                  <span className="text-xs text-white/80 group-hover:text-white">{item}</span>
                  <ChevronRight className="w-3 h-3 ml-auto text-tertiary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
