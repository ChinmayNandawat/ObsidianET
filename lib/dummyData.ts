import { Message, Recommendation, UserProfile } from '../types';

export const DUMMY_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Welcome to Obsidian Flux. I am your ET AI Concierge. How can I assist your financial journey today?',
    timestamp: new Date(),
    status: 'complete'
  }
];

export const DUMMY_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'ET Alpha Growth Fund',
    description: 'High-performance tech-focused equity fund.',
    confidence: 0.94,
    reasoning: 'Matches your medium-high risk tolerance and interest in emerging technologies.',
    actions: ['View Prospectus', 'Simulate Returns']
  },
  {
    id: 'rec-2',
    title: 'Obsidian Yield Optimizer',
    description: 'AI-managed stablecoin yield farming.',
    confidence: 0.88,
    reasoning: 'Optimizes passive income while maintaining liquidity.',
    actions: ['Connect Wallet', 'View Strategy']
  }
];

export const DUMMY_PROFILE: UserProfile = {
  name: 'Elite User',
  riskTolerance: 'medium',
  interests: ['DeFi', 'AI Tech', 'Sustainable Energy'],
  lastActive: new Date()
};
