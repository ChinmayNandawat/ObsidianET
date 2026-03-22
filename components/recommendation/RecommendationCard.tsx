import { Recommendation } from '../../types';
import { motion } from 'motion/react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const isHighMatch = recommendation.confidence >= 0.9;
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-surface-container-high rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer ${recommendation.confidence < 0.7 ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-white group-hover:text-primary transition-colors">{recommendation.title}</h4>
          <p className="text-[10px] text-tertiary uppercase tracking-tighter">Global Alpha Cluster</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-black font-headline ${isHighMatch ? 'text-primary' : 'text-secondary-container'}`}>
            {(recommendation.confidence * 100).toFixed(0)}%
          </div>
          <div className="text-[8px] text-tertiary uppercase font-bold">Match</div>
        </div>
      </div>
      
      <div className={`bg-black/40 rounded-lg p-3 mb-4 border-l-2 ${isHighMatch ? 'border-primary' : 'border-secondary-container'}`}>
        <p className="text-xs text-tertiary leading-relaxed italic">
          &quot;{recommendation.reasoning}&quot;
        </p>
      </div>
      
      <button className={`w-full py-2.5 text-xs font-bold rounded-lg transition-all ${isHighMatch ? 'bg-primary text-black hover:brightness-110' : 'border border-secondary-container text-secondary-container hover:bg-secondary-container/10'}`}>
        {isHighMatch ? 'Deploy Sequence' : 'View Details'}
      </button>
    </motion.div>
  );
};
