import React from 'react';
import type { HubCategory } from '@/types';

export interface SectionScore {
  category: HubCategory;
  score: number;
}

export const TAB_LABELS: Record<string, string> = {
  ALL: 'All',
  ET_PRIME: 'ET Prime',
  ET_MARKETS: 'ET Markets',
  WEALTH: 'Wealth',
  MASTERCLASS: 'Masterclass',
  GLOBAL_INSIGHTS: 'Global Insights',
};

interface HubTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sectionScores: SectionScore[];
  isPersonalized: boolean;
}

export function HubTabBar({ activeTab, onTabChange, sectionScores, isPersonalized }: HubTabBarProps) {
  // Build ordered tabs: ALL first, then remaining categories sorted by score desc
  const scoreMap = new Map<string, number>();
  for (const s of sectionScores || []) scoreMap.set(String(s.category), s.score);

  const allCategories = Array.from(new Set([
    ...(sectionScores ? sectionScores.map(s => String(s.category)) : []),
    'ET_PRIME', 'ET_MARKETS', 'WEALTH', 'MASTERCLASS', 'GLOBAL_INSIGHTS'
  ]));

  const sorted = allCategories
    .filter((c) => c !== 'ALL')
    .sort((a, b) => (scoreMap.get(b) ?? 0) - (scoreMap.get(a) ?? 0));

  const tabs: { category: string; score: number }[] = [
    { category: 'ALL', score: 0 },
    ...sorted.map((c) => ({ category: c, score: scoreMap.get(c) ?? 0 })),
  ];

  return (
    <div className="hidden lg:flex items-center gap-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.category;
        return (
          <div key={tab.category} className="flex flex-col items-stretch">
            <button
              onClick={() => onTabChange(tab.category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isActive ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'}`}
            >
              {TAB_LABELS[tab.category] ?? tab.category}
              {isPersonalized && tab.category !== 'ALL' && tab.score >= 70 ? (
                <span className="ml-1.5 text-[10px] opacity-70">{tab.score}%</span>
              ) : null}
            </button>

            {/* score bar under each non-ALL tab */}
            {tab.category !== 'ALL' ? (
              <div className="mt-1 h-0.5 rounded-full bg-zinc-800 w-full">
                <div
                  className="h-0.5 rounded-full bg-green-600/60 transition-all duration-500"
                  style={{ width: `${tab.score}%` }}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
