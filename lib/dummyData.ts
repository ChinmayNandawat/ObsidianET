import { Message, Recommendation, UserProfile } from '../types';
import type { HubItem, PersonalizationPayload } from '../types';

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

export const DEFAULT_HUB_ITEMS: HubItem[] = [
  {
    id: 'hub-et-prime',
    category: 'ET_PRIME',
    title: 'ET Prime: The Alpha Report',
    description: 'Deep-dive analysis into emerging market trends, disruptive technologies, and institutional-grade investment strategies.',
    tags: ['equity', 'macro', 'institutional'],
    badge: 'PREMIUM',
    ctaLabel: 'Access Now',
  },
  {
    id: 'hub-et-markets',
    category: 'ET_MARKETS',
    title: 'ET Markets',
    description: 'Real-time data streams and predictive analytics for global markets.',
    tags: ['markets', 'real-time', 'nifty', 'sensex'],
    isLive: true,
    badge: 'LIVE',
    stats: [
      { label: 'NIFTY 50', value: '+1.24%' },
      { label: 'SENSEX', value: '+0.85%' },
    ],
  },
  {
    id: 'hub-masterclass',
    category: 'MASTERCLASS',
    title: 'Masterclass',
    description: 'Learn from institutional experts and industry leaders.',
    tags: ['education', 'learning', 'experts'],
    ctaLabel: 'Watch Now',
  },
  {
    id: 'hub-wealth',
    category: 'WEALTH',
    title: 'Wealth Tools',
    description: 'Bespoke financial planning and portfolio management utilities.',
    tags: ['planning', 'portfolio', 'tools'],
    badge: 'AI POWERED',
    stats: [
      { label: 'Tools', value: '12+' },
      { label: 'Powered', value: 'AI' },
    ],
  },
  {
    id: 'hub-global',
    category: 'GLOBAL_INSIGHTS',
    title: 'Global Insights',
    description: 'Macro-economic analysis and geopolitical risk assessment.',
    tags: ['macro', 'geopolitical', 'global'],
    ctaLabel: 'Explore World View',
  },
];

export function createFallbackPayload(sessionId: string): PersonalizationPayload {
  return {
    sessionId,
    messages: [],
    profilingComplete: false,
    answeredQuestions: 0,
    profile: undefined,
    recommendations: [],
    hubItems: DEFAULT_HUB_ITEMS,
  };
}
