'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { LayoutGrid, Search, ChevronRight, Star, TrendingUp, BookOpen, Wallet, Globe } from 'lucide-react';
import Link from 'next/link';
import { getHubState } from '../../lib/api';
import { HubItem, UserProfile } from '../../types';

export default function HubPage() {
  const categories = ['All', 'Articles', 'Products', 'Tools', 'Courses'];
  const [items, setItems] = useState<HubItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getHubState().then((data) => {
      setItems(data.hubItems);
      setProfile(data.profile);
    }).catch((error) => console.error('Failed to load hub', error));
  }, []);

  const iconMap = {
    article: Star,
    product: Wallet,
    tool: TrendingUp,
    course: BookOpen,
  } as const;

  return (
    <main className="min-h-screen pt-16 bg-[#0b0e14] flex flex-col">
      <Navbar />

      <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-headline tracking-tight">The Active Hub</h1>
            <p className="text-[10px] text-tertiary uppercase font-bold tracking-widest">
              Personalized for {profile?.name || 'your profile'}
            </p>
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
              <button key={cat} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'bg-primary text-black' : 'text-tertiary hover:text-white hover:bg-white/5'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <div className="rounded-3xl border border-white/5 bg-surface-container-low p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 block">Gemini Active Curation</span>
                <h2 className="text-4xl font-black font-headline text-white mb-4 leading-tight">{profile?.persona || 'ET Ecosystem Feed'}</h2>
                <p className="text-tertiary text-sm max-w-2xl leading-relaxed">{profile?.summary || 'Complete terminal onboarding to unlock deeper ET personalization.'}</p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5 min-w-[250px]">
                <div className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Primary Goal</div>
                <div className="mt-3 text-xl font-bold text-white">{profile?.primaryGoal || 'Build your profile'}</div>
                <div className="mt-2 text-xs text-tertiary">Interest focus: {(profile?.interests || []).join(' • ')}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => {
              const Icon = iconMap[item.type];
              return (
                <Link key={item.id} href={item.href} target="_blank" className="bg-surface-container-high rounded-3xl border border-white/5 p-6 group hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{Math.round(item.matchScore * 100)}% Match</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-tertiary text-sm mb-6 leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-black/20 border border-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-tertiary">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-secondary-container uppercase tracking-widest group-hover:gap-4 transition-all">
                    {item.source} <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/5 bg-surface-container-high p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-secondary-container" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Personalization source</div>
                <div className="text-xs text-tertiary">All hub items are served by the backend session payload and can later be hydrated from Supabase.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
