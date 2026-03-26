'use client';

import React, { useState } from 'react';
import { Recommendation } from '../../types';
import { motion } from 'motion/react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  relevanceScore?: number;
  isPersonalized?: boolean;
  priorityLabel?: string;
  matchReason?: string;
  aiTags?: string[];
  matchScore?: number;
  isSaved?: boolean;
  onSaveToggle?: (itemId: string) => void;
}

function getPriorityClasses(priorityLabel: string) {
  switch (priorityLabel) {
    case 'Best Match':
      return 'bg-green-950/60 border-green-800/40 text-green-400';
    case 'Strong Match':
      return 'bg-zinc-800/60 border-zinc-700/40 text-zinc-300';
    case 'Explore Next':
      return 'bg-zinc-900/60 border-zinc-800/40 text-zinc-500';
    default:
      return 'bg-zinc-800/60 border-zinc-700/40 text-zinc-300';
  }
}

function getContextualCTA(category: string, priorityLabel?: string, ctaLabel?: string): string {
  if (priorityLabel === 'Best Match') {
    if (category === 'ET_PRIME') return 'Open My Best Match';
    if (category === 'WEALTH') return 'Start Here';
    if (category === 'ET_MARKETS') return 'Track My Markets';
  }
  if (category === 'ET_PRIME') return 'Explore Your Edge';
  if (category === 'ET_MARKETS') return 'View Live Markets';
  if (category === 'WEALTH') return 'Build My Plan';
  if (category === 'MASTERCLASS') return 'View My Track';
  if (category === 'GLOBAL_INSIGHTS') return 'Unlock Insights';
  return ctaLabel ?? 'Explore';
}

export const RecommendationCard = ({
  recommendation,
  relevanceScore,
  isPersonalized,
  priorityLabel,
  matchReason,
  aiTags,
  matchScore,
  isSaved,
  onSaveToggle,
}: RecommendationCardProps) => {
  const isHighMatch = recommendation.confidence >= 0.9;

  const ctaText = getContextualCTA(
    (recommendation as any)?.category ?? '',
    priorityLabel,
    (recommendation as any)?.ctaLabel
  );

  const [showWhy, setShowWhy] = useState(false);

  const title = recommendation.title;
  const description = recommendation.description;
  const id = recommendation.id;
  const stats = (recommendation as any)?.stats as Array<{ label: string; value: string }> | undefined;
  const isLive = (recommendation as any)?.isLive === true;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative flex flex-col h-full rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer ${recommendation.confidence < 0.7 ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}
    >
      {/* Row 1: meta */}
      <div className="flex items-center justify-between">
        {priorityLabel && (
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${getPriorityClasses(priorityLabel)}`}>
            {priorityLabel}
          </span>
        )}

        {isLive && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-green-400 mx-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
        )}

        {matchScore && isPersonalized && (
          <span className="text-sm font-bold text-green-400 ml-auto">
            {matchScore}%
            <span className="text-xs font-normal text-zinc-500 ml-1">match</span>
          </span>
        )}
      </div>

      {/* Row 2: title */}
      <h3 className="text-base font-semibold text-white leading-snug mt-2">{title}</h3>

      {/* Row 3: AI tags */}
      {aiTags && aiTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {aiTags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/60 text-zinc-400 tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Row 4: description */}
      <p className="text-sm text-zinc-400 leading-relaxed flex-1 mt-2">
        {description}
      </p>

      {/* Optional stats block */}
      {stats && stats.length > 0 && (
        <div className="rounded-lg bg-zinc-800/60 divide-y divide-zinc-700/40 overflow-hidden mt-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between px-3 py-2">
              <span className="text-xs text-zinc-500 font-medium tracking-wide">{stat.label}</span>
              <span className={`text-xs font-semibold ${stat.value.startsWith('+') ? 'text-green-400' : stat.value.startsWith('-') ? 'text-red-400' : 'text-zinc-300'}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Row 5: Why this? expandable (matchReason only shown here) */}
      {matchReason && (
        <div className="mt-3">
          <button
            onClick={(e) => { e.stopPropagation(); setShowWhy(!showWhy); }}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors group"
          >
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-zinc-700 group-hover:border-zinc-500 text-[9px] transition-colors">
              {showWhy ? '−' : 'i'}
            </span>
            {showWhy ? 'Hide explanation' : 'Why this?'}
          </button>

          {showWhy && (
            <div className="mt-2 rounded-lg border border-zinc-700/60 bg-zinc-800/40 px-3 py-2.5">
              <p className="text-xs text-zinc-400 leading-relaxed">{matchReason}</p>
            </div>
          )}
        </div>
      )}

      {/* Row 6: actions */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 mt-auto">
        {onSaveToggle && (
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onSaveToggle(id);
            }}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              isSaved
                ? 'bg-green-950/60 border-green-800/50 text-green-400'
                : 'bg-transparent border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500'
            }`}
          >
            {isSaved ? 'Saved' : '+ Track'}
          </button>
        )}

        <button
          onClick={(e) => e.stopPropagation()}
          className="ml-auto px-4 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
        >
          {ctaText}
        </button>
      </div>
    </motion.div>
  );
};
