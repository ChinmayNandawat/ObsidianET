'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Shield, ArrowRight, Sparkles, TrendingUp, LayoutGrid, Lock, MessageSquare } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { AIOrb } from '../components/ui/AIOrb';
import { FinancialChatbot } from '../components/ui/FinancialChatbot';

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary selection:text-black antialiased overflow-x-hidden min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10 relative">
            <div className="flex-1 space-y-8 text-left">
              {/* <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/40 border border-white/5 text-primary text-xs font-black tracking-widest uppercase"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                v4.0 Obsidian Protocol Active
              </motion.div> */}
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05]"
              >
                Precision Intelligence <br/><span className="text-primary">Without Compromise</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="font-body text-xl text-tertiary max-w-2xl leading-relaxed"
              >
                Harness the power of Obsidian Flux to synthesize complex market data from the <span className="text-white font-semibold">Economic Times Ecosystem</span> into your personalized, executable strategy.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link href="/chat">
                  <button className="px-8 py-4 bg-primary text-black font-headline font-black rounded-lg shadow-[0_0_40px_rgba(0,200,5,0.3)] btn-elastic text-lg tracking-tight group flex items-center justify-center gap-2 w-full sm:w-auto">
                    Start Your Journey 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <button className="px-8 py-4 glass-card border border-white/10 text-white font-headline font-bold rounded-lg hover:bg-surface-container-high hover:border-white/20 transition-all btn-elastic text-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                  <span>Explore Features</span>
                </button>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex-1 flex justify-center lg:justify-end relative"
            >
              {/* Decorative background glow behind the orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
              
              <div className="scale-125 lg:scale-150 transform origin-center">
                <AIOrb />
              </div>
            </motion.div>
          </div>

          {/* Interactive App Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto mt-32 relative px-4"
          >
            <div className="text-center mb-10">
              <h2 className="font-headline text-3xl font-extrabold text-white mb-3">Meet The Terminal</h2>
              <p className="text-tertiary">Your central interface for ET Ecosystem intelligence</p>
            </div>
            
            <div className="relative rounded-2xl border border-white/10 bg-[#05070a] shadow-[0_0_100px_rgba(0,200,5,0.05)] overflow-hidden aspect-[16/9] md:aspect-[21/9] animate-float flex flex-col">
              
              {/* Mockup Header Bar */}
              <div className="h-12 border-b border-white/5 bg-surface-container-low/50 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                </div>
                <div className="text-xs text-white/30 font-mono">obsidian-terminal-v4.exe</div>
                <div className="w-12"></div> {/* Spacer for balance */}
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: The Terminal Chat */}
                <div className="w-full md:w-3/5 border-r border-white/5 flex flex-col p-6 bg-surface/30">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">Obsidian AI</h4>
                      <p className="text-[10px] text-primary tracking-widest uppercase">System Online</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    {/* User Message */}
                    <div className="p-4 rounded-xl bg-surface-container-high/50 border border-white/5 w-4/5 ml-auto">
                      <div className="text-sm text-white/90">
                        I have 10 years of experience and a high risk tolerance. What does the ET data suggest for Q3?
                      </div>
                    </div>

                    {/* AI Thinking State */}
                    <div className="p-4 rounded-xl glass-card relative overflow-hidden">
                      <div className="absolute left-0 top-0 w-1 h-full bg-primary/50"></div>
                      <p className="text-[10px] text-primary mb-3 opacity-70 font-black flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        SYNTHESIZING DATA
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-white/50">
                          <span>Scanning ET Markets...</span>
                          <span className="text-primary text-[10px]">DONE</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/50">
                          <span>Analyzing high-risk tech patterns...</span>
                          <span className="text-primary text-[10px]">DONE</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/80 font-medium mt-2">
                          <span>Compiling recommendation matrix</span>
                          <div className="w-3 h-3 border-2 border-primary/40 border-t-primary rounded-full animate-spin"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Mockup */}
                  <div className="mt-6 p-4 rounded-xl border border-white/10 bg-surface-container-low flex justify-between items-center group cursor-pointer transition-colors hover:border-primary/30">
                    <span className="text-sm text-white/30">Enter command...</span>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Right Panel: Live Profile / Active Hub Preview */}
                <div className="hidden md:block flex-1 p-6 bg-[#030407] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
                  
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <h5 className="text-xs font-bold tracking-widest text-white/50 uppercase">Live Profile Feed</h5>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold">HIGH RISK</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    {/* Simulated Article Card */}
                    <div className="p-4 rounded-xl border border-white/5 bg-surface/40 hover:border-primary/20 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] text-tertiary">From ET Tech</span>
                        <span className="text-[10px] text-primary">98% Match</span>
                      </div>
                      <h6 className="text-sm text-white font-bold mb-2">Emerging AI Sectors See Massive Q3 Influx</h6>
                      <div className="flex gap-2">
                        <div className="h-6 px-3 rounded bg-white/5 flex items-center text-[10px] text-tertiary">Tech</div>
                        <div className="h-6 px-3 rounded bg-white/5 flex items-center text-[10px] text-tertiary">Growth</div>
                      </div>
                    </div>

                    {/* Simulated Market Card */}
                    <div className="p-4 rounded-xl border border-white/5 bg-surface/40">
                      <h6 className="text-xs text-white/50 mb-4">Portfolio Strategy Impact</h6>
                      <div className="flex items-end gap-2 h-16 w-full">
                        <div className="w-1/5 bg-primary/20 h-[40%] rounded-t"></div>
                        <div className="w-1/5 bg-primary/30 h-[60%] rounded-t"></div>
                        <div className="w-1/5 bg-primary/40 h-[50%] rounded-t"></div>
                        <div className="w-1/5 bg-primary/60 h-[80%] rounded-t"></div>
                        <div className="w-1/5 bg-primary h-[100%] rounded-t shadow-[0_0_10px_rgba(0,200,5,0.3)]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Value Proposition */}
        <section className="py-32 px-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white mb-6">How Obsidian Flux Works</h2>
            <p className="text-tertiary text-lg max-w-2xl mx-auto">Our intelligence layer integrates seamlessly with the <span className="text-primary">ET Ecosystem</span> to provide unmatched clarity.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-500">
                <MessageSquare className="w-8 h-8" />
              </div>
                <h3 className="text-2xl font-headline font-extrabold text-white">Conversational Data</h3>
                <p className="text-tertiary leading-relaxed">Ask complex market questions in plain language. Receive institutional-grade synthesis powered by ET&apos;s proprietary databases.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-500">
                <LayoutGrid className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-extrabold text-white">Bespoke Strategies</h3>
              <p className="text-tertiary leading-relaxed">Our neural engine learns your risk DNA to curate a portfolio path that evolves with global shifts in the ET global feed.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-500">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-extrabold text-white">Obsidian Privacy</h3>
              <p className="text-tertiary leading-relaxed">Your financial intent is your own. We use zero-knowledge architecture to keep your data invisible to us and third parties.</p>
            </motion.div>
          </div>
        </section>

        {/* Expanded Ecosystem Section */}
        <section className="py-40 px-8 bg-[#070a0f] border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]"></div>
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center mb-24"
            >
              <span className="text-primary text-xs font-black tracking-[0.4em] uppercase mb-4">Foundation</span>
              <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">The ET Ecosystem</h2>
              <p className="text-tertiary max-w-2xl text-xl leading-relaxed">Obsidian Flux is the master intelligence layer that unifies the world-class financial instrumentation of The Economic Times into a single, cohesive experience.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative rounded-3xl overflow-hidden glass-card p-12 border-white/10 hover:border-primary/50 transition-all duration-500"
              >
                <div className="flex flex-col h-full space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Editorial Elite</span>
                      <h3 className="text-4xl font-headline font-extrabold text-white">ET Prime</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-tertiary leading-relaxed text-lg">Deep investigative logic for the strategic mind. Obsidian Flux processes Prime&apos;s long-form insights into immediate action items.</p>
                  <div className="pt-4 mt-auto">
                    <Link className="text-white text-sm font-bold flex items-center gap-2 group-hover:text-primary transition-colors" href="#">
                      Explore Integration <ArrowRight className="w-4 h-4 -rotate-45" />
                    </Link>
                  </div>
                </div>
              </motion.div>
              
              {/* Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group relative rounded-3xl overflow-hidden glass-card p-12 border-white/10 hover:border-primary/50 transition-all duration-500"
              >
                <div className="flex flex-col h-full space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Core Engine</span>
                      <h3 className="text-4xl font-headline font-extrabold text-white">ET Markets</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-tertiary leading-relaxed text-lg">Real-time terminal data at retail accessibility. Flux ingests live market feeds to recalibrate your strategy in milliseconds.</p>
                  <div className="pt-4 mt-auto">
                    <Link className="text-white text-sm font-bold flex items-center gap-2 group-hover:text-primary transition-colors" href="#">
                      Explore Integration <ArrowRight className="w-4 h-4 -rotate-45" />
                    </Link>
                  </div>
                </div>
              </motion.div>
              
              {/* Card 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="group relative rounded-3xl overflow-hidden glass-card p-12 border-white/10 hover:border-primary/50 transition-all duration-500"
              >
                <div className="flex flex-col h-full space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Growth Suite</span>
                      <h3 className="text-4xl font-headline font-extrabold text-white">Wealth Tools</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-tertiary leading-relaxed text-lg">AI-driven rebalancing for generational legacy. Connect your portfolios for automated risk management via the Flux core.</p>
                  <div className="pt-4 mt-auto">
                    <Link className="text-white text-sm font-bold flex items-center gap-2 group-hover:text-primary transition-colors" href="#">
                      Explore Integration <ArrowRight className="w-4 h-4 -rotate-45" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-20 text-center"
            >
              <button className="px-12 py-6 bg-primary text-black font-headline font-black rounded-xl shadow-[0_0_50px_rgba(0,200,5,0.4)] btn-elastic text-xl">
                Experience the Full Ecosystem
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="w-full py-20 px-8 border-t border-white/5 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <span className="text-2xl font-extrabold text-white tracking-tighter">Obsidian Flux</span>
            <p className="text-base text-tertiary max-w-sm leading-relaxed">
              An obsidian-tier intelligence layer for modern investors. Powered by the global infrastructure of The Economic Times.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Ecosystem</h4>
            <div className="flex flex-col gap-4">
              <Link className="text-sm text-tertiary hover:text-primary transition-colors" href="#">Intelligence Layer</Link>
              <Link className="text-sm text-tertiary hover:text-primary transition-colors" href="#">Market Terminal</Link>
              <Link className="text-sm text-tertiary hover:text-primary transition-colors" href="#">Wealth Engine</Link>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Network</h4>
            <div className="flex flex-col gap-4">
              <Link className="text-sm text-tertiary hover:text-primary transition-colors" href="#">Security Docs</Link>
              <Link className="text-sm text-tertiary hover:text-primary transition-colors" href="#">Privacy Protocol</Link>
              <Link className="text-sm text-tertiary hover:text-primary transition-colors" href="#">Terms of Access</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto pt-10 border-t border-white/5 gap-6">
          <p className="text-xs text-white/40 font-medium tracking-widest">© 2024 OBSIDIAN FLUX. POWERED BY THE ECONOMIC TIMES</p>
          <div className="flex gap-8">
            <TrendingUp className="w-5 h-5 text-white/40 hover:text-primary cursor-pointer transition-colors" />
            <Sparkles className="w-5 h-5 text-white/40 hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
      
      {/* Financial Chatbot */}
      <FinancialChatbot />
    </div>
  );
}
