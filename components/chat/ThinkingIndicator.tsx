import { motion } from 'motion/react';

export const ThinkingIndicator = () => {
  return (
    <div className="flex items-center gap-3 p-6 bg-white/[0.02] border-y border-white/5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-1.5 h-1.5 bg-orange-500 rounded-full"
          />
        ))}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500/60">
        AI is processing flux data...
      </span>
    </div>
  );
};
