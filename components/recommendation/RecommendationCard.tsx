import { Recommendation } from '../../types';
import Link from 'next/link';
import { motion } from 'motion/react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const isHighMatch = recommendation.confidence >= 0.9;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-surface-container-high rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-all group ${recommendation.confidence < 0.7 ? 'opacity-70' : ''}`}
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div>
          <h4 className="font-bold text-white group-hover:text-primary transition-colors">{recommendation.title}</h4>
          <p className="text-[10px] text-tertiary uppercase tracking-tighter">{recommendation.source}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-black font-headline ${isHighMatch ? 'text-primary' : 'text-secondary-container'}`}>
            {(recommendation.confidence * 100).toFixed(0)}%
          </div>
          <div className="text-[8px] text-tertiary uppercase font-bold">Match</div>
        </div>
      </div>

      <p className="text-sm text-white/80 leading-relaxed mb-4">{recommendation.description}</p>

      <div className={`bg-black/40 rounded-lg p-3 mb-4 border-l-2 ${isHighMatch ? 'border-primary' : 'border-secondary-container'}`}>
        <p className="text-xs text-tertiary leading-relaxed italic">&quot;{recommendation.reasoning}&quot;</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {recommendation.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-widest text-tertiary font-bold">
            {tag}
          </span>
        ))}
      </div>

      <Link href={recommendation.link} target="_blank" className={`block w-full py-2.5 text-center text-xs font-bold rounded-lg transition-all ${isHighMatch ? 'bg-primary text-black hover:brightness-110' : 'border border-secondary-container text-secondary-container hover:bg-secondary-container/10'}`}>
        {recommendation.ctaLabel}
      </Link>
    </motion.div>
  );
};
