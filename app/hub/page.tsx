import { Navbar } from '../../components/layout/Navbar';
import { LayoutGrid, Shield, Zap, ArrowUpRight, Search, Filter, ChevronRight, Star, TrendingUp, BookOpen, Wallet, Globe, Play } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function HubPage() {
  const categories = ["All", "ET Prime", "ET Markets", "Wealth", "Masterclass"];
  
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
            <h1 className="text-lg font-bold font-headline tracking-tight">The Active Hub</h1>
            <p className="text-[10px] text-tertiary uppercase font-bold tracking-widest">The Digital Curator</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <Search className="w-3 h-3 text-tertiary" />
            <input type="text" placeholder="Search Ecosystem..." className="bg-transparent border-none focus:ring-0 text-xs text-white placeholder:text-tertiary w-40" />
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="flex items-center gap-2">
            {categories.map((cat, i) => (
              <button 
                key={cat} 
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-primary text-black' : 'text-tertiary hover:text-white hover:bg-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* ET Prime Card - Large */}
          <div className="md:col-span-2 md:row-span-2 bg-surface-container-low rounded-3xl border border-white/5 p-8 relative overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-auto">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 block">Premium Intelligence</span>
                <h2 className="text-4xl font-black font-headline text-white mb-4 leading-tight">ET Prime:<br/>The Alpha Report</h2>
                <p className="text-tertiary text-sm max-w-md leading-relaxed">
                  Deep-dive analysis into emerging market trends, disruptive technologies, and institutional-grade investment strategies.
                </p>
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
                  Access Now
                </button>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* ET Markets Card */}
          <div className="bg-surface-container-high rounded-3xl border border-white/5 p-6 group cursor-pointer hover:border-secondary-container/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary-container" />
              </div>
              <span className="text-[10px] font-bold text-secondary-container uppercase tracking-widest">Live</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">ET Markets</h3>
            <p className="text-tertiary text-xs mb-6">Real-time data streams and predictive analytics for global markets.</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-black/20 border border-white/5">
                <span className="text-[10px] text-tertiary uppercase font-bold">NIFTY 50</span>
                <span className="text-xs font-bold text-primary">+1.24%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-black/20 border border-white/5">
                <span className="text-[10px] text-tertiary uppercase font-bold">SENSEX</span>
                <span className="text-xs font-bold text-primary">+0.85%</span>
              </div>
            </div>
          </div>

          {/* Masterclass Card */}
          <div className="bg-surface-container-high rounded-3xl border border-white/5 p-6 group cursor-pointer hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Masterclass</h3>
            <p className="text-tertiary text-xs mb-6">Learn from institutional experts and industry leaders.</p>
            <div className="aspect-video rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden relative">
              <Image 
                src="https://picsum.photos/seed/edu/400/225" 
                alt="Masterclass" 
                fill
                className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Wealth Tools Card */}
          <div className="bg-surface-container-high rounded-3xl border border-white/5 p-6 group cursor-pointer hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Wealth Tools</h3>
            <p className="text-tertiary text-xs mb-6">Bespoke financial planning and portfolio management utilities.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                <div className="text-lg font-bold text-white">12+</div>
                <div className="text-[8px] text-tertiary uppercase font-bold">Tools</div>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-center">
                <div className="text-lg font-bold text-white">AI</div>
                <div className="text-[8px] text-tertiary uppercase font-bold">Powered</div>
              </div>
            </div>
          </div>

          {/* Global Insights Card */}
          <div className="bg-surface-container-high rounded-3xl border border-white/5 p-6 group cursor-pointer hover:border-secondary-container/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-secondary-container" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Global Insights</h3>
            <p className="text-tertiary text-xs mb-6">Macro-economic analysis and geopolitical risk assessment.</p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-secondary-container uppercase tracking-widest group-hover:gap-4 transition-all">
              Explore World View <ChevronRight className="w-3 h-3" />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
