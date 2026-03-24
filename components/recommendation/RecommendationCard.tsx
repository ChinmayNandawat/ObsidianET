import { Recommendation } from '../../types';
import Link from 'next/link';
import { motion } from 'motion/react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const isHighMatch = (recommendation.matchScore || recommendation.confidence * 100) >= 90;
  const displayScore = recommendation.matchScore || Math.round(recommendation.confidence * 100);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-surface-container-high rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-all group ${recommendation.confidence < 0.7 ? 'opacity-70' : ''}`}
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1">
          <h4 className="font-bold text-white group-hover:text-primary transition-colors">{recommendation.title}</h4>
          {recommendation.hook && (
            <p className="text-sm italic text-[#00ff41]/70 mt-1">{recommendation.hook}</p>
          )}
          <p className="text-[10px] text-tertiary uppercase tracking-tighter mt-2">{recommendation.source}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-black font-headline ${isHighMatch ? 'text-primary' : 'text-secondary-container'}`}>
            {displayScore}
          </div>
          <div className="text-[8px] text-tertiary uppercase font-bold">Match</div>
        </div>
      </div>

      {/* Why This Fits - Bullet Points */}
      {recommendation.whyThisFits && recommendation.whyThisFits.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-tertiary uppercase font-bold mb-2">Why this fits you:</div>
          {recommendation.whyThisFits.map((point, index) => (
            <div key={index} className="flex items-start gap-2 mb-1">
              <span className="text-[#00ff41] text-xs mt-0.5">●</span>
              <p className="text-xs text-white/80 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Urgency Signal */}
      {recommendation.urgencySignal && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-2 py-1 rounded mb-4">
          {recommendation.urgencySignal}
        </div>
      )}

      <div className={`bg-black/40 rounded-lg p-3 mb-4 border-l-2 border-l-2 ${isHighMatch ? 'border-primary' : 'border-secondary-container'}`}>
        <p className="text-xs text-gray-400 leading-relaxed italic pl-2">&quot;{recommendation.reasoning}&quot;</p>
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
