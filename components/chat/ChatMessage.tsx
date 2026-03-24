import { motion } from 'motion/react';
import { Message } from '../../types';
import { PersonalizationPayload, ProfilingQuestion } from '../../types';

interface ChatMessageProps {
  message: Message;
  session?: PersonalizationPayload | null;
  onQuickReply?: (reply: string) => void;
}

export const ChatMessage = ({ message, session, onQuickReply }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';
  
  // Generate quick replies based on current question
  const getQuickReplies = () => {
    if (!session || session.profilingComplete || !onQuickReply) return [];
    
    const currentQuestionIndex = session.answeredQuestions;
    const currentQuestion = session.profilingQuestions[currentQuestionIndex];
    
    if (!currentQuestion) return [];
    
    const questionKey = currentQuestion.key;
    
    switch (questionKey) {
      case 'riskBehavior':
        return ["I'd panic sell", "I'd hold steady", "I'd buy more"];
      case 'knowledgeLevel':
        return ["Learner", "Navigator", "Operator"];
      case 'timeHorizon':
        return ["Less than 1 year", "1-3 years", "5+ years"];
      default:
        return ["Tell me more", "Skip for now", "Got it"];
    }
  };
  
  const quickReplies = getQuickReplies();
  
  // Check if this is an error message
  const isErrorMessage = message.content.includes('connection hiccup') || 
    message.content.includes('quick interruption') ||
    message.content.includes('rate limit') ||
    message.content.includes('rephrase that');
  
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
        {isAssistant ? 'Flux System Core' : (session?.profile?.name || 'YOU')}
      </div>
      
      <div className={`rounded-2xl p-6 text-sm md:text-base leading-relaxed border border-white/5 shadow-xl max-w-[85%] ${
        isAssistant 
          ? 'bg-surface-container-high text-white border-l-2 border-[#00ff41]/50' 
          : 'bg-primary/10 text-primary border-primary/30'
      }`}>
        {message.content}
      </div>
      
      {/* Quick Reply Chips */}
      {isAssistant && quickReplies.length > 0 && !isErrorMessage && (
        <div className="flex flex-wrap gap-2 mt-3">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => onQuickReply?.(reply)}
              className="border border-[#00ff41]/30 text-[#00ff41]/70 hover:bg-[#00ff41]/10 text-xs rounded-full px-3 py-1 transition-all hover:scale-105 active:scale-95"
            >
              {reply}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};
