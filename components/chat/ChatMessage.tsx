import { motion } from 'motion/react';
import { Message } from '../../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-3 ${isAssistant ? '' : 'items-end'}`}
    >
      <div className="flex items-center gap-2 text-[10px] text-tertiary uppercase tracking-widest font-bold">
        {isAssistant && (
          <span className="w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_8px_#00f1fe]"></span>
        )}
        {isAssistant ? 'Flux System Core' : 'Institutional Client'}
      </div>
      
      <div className={`rounded-2xl p-6 text-sm md:text-base leading-relaxed border border-white/5 shadow-xl max-w-[85%] ${
        isAssistant 
          ? 'bg-surface-container-high text-white' 
          : 'bg-primary/10 text-primary border-primary/30'
      }`}>
        {message.content}
      </div>
    </motion.div>
  );
};
