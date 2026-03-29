import React from 'react';

interface MissedOpportunity {
  category: string;
  title: string;
  teaser: string;
  unlockHint: string;
}

interface MissedOpportunitiesProps {
  missedOpportunities: MissedOpportunity[];
  isPersonalized: boolean;
}

export function MissedOpportunities({ missedOpportunities, isPersonalized }: MissedOpportunitiesProps) {
  if (!isPersonalized || !missedOpportunities || missedOpportunities.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 mt-10 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">You are likely underusing</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {missedOpportunities.map((item) => (
          <div key={item.category} className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 hover:border-zinc-700 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-zinc-300">{item.title}</p>
              <span className="text-[10px] text-amber-500/80 font-medium bg-amber-950/40 border border-amber-900/40 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">Underused</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mb-3">{item.teaser}</p>
            <p className="text-xs text-zinc-600 italic">{item.unlockHint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
