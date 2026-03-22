import { motion } from 'motion/react';

export const AIOrb = () => {
  return (
    <div className="relative w-[400px] h-[400px] flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"
      />
      
      {/* Core */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-[240px] h-[240px] rounded-full bg-radial-[circle_at_30%_30%] from-primary to-[#004d02] shadow-[0_0_60px_rgba(0,200,5,0.6),inset_-10px_-10px_40px_rgba(0,0,0,0.5)] z-2"
      />
      
      {/* Orbiting Rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-primary/20 rounded-full" 
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[10%] border border-dashed border-primary/40 rounded-full" 
      />
    </div>
  );
};
