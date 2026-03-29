import React from 'react';

interface NextBestAction {
  action: string;
  urgency?: 'low' | 'medium' | 'high';
}

interface NextBestActionCardProps {
  nextBestAction: NextBestAction | null;
  isPersonalized: boolean;
}

export function NextBestActionCard({ nextBestAction, isPersonalized }: NextBestActionCardProps) {
  if (!isPersonalized || !nextBestAction) return null;

  const urgency = nextBestAction.urgency ?? 'low';

  return (
    <div className="mx-auto max-w-7xl px-4 mb-6">
      <div className="relative rounded-xl border border-zinc-700/80 bg-zinc-900 p-5 overflow-hidden">
        {/* Urgency accent line */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${
          urgency === 'high'   ? 'bg-green-500' :
          urgency === 'medium' ? 'bg-amber-500/70' :
                                  'bg-zinc-600'
        }`} />

        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
          Your next best action
        </p>
        <p className="text-white text-base font-medium leading-snug">
          {nextBestAction.action}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button className="px-4 py-1.5 rounded-full bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors">
            Take Action
          </button>
          <span className={`text-xs font-medium ${
            urgency === 'high'   ? 'text-green-400' :
            urgency === 'medium' ? 'text-amber-400' :
                                    'text-zinc-500'
          }`}>
            {urgency === 'high' ? 'Recommended now' : 
             urgency === 'medium' ? 'Good time this week' : 
             'When you are ready'}
          </span>
        </div>
      </div>
    </div>
  );
}
