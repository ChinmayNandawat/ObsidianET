import {
  HubItem,
  PersonalizationPayload,
  ProfilingQuestion,
  Recommendation,
  SimulationScenario,
  UserProfile,
} from '../types';

export const PROFILING_QUESTIONS: ProfilingQuestion[] = [
  {
    prompt: 'What should I call you?',
    key: 'name',
    depth: 'Establishes rapport and personalization for the conversation',
    followUpTriggers: ['nickname', 'prefer', 'call me']
  },
  {
    prompt: 'If your money could do ONE thing for you in the next 3 years, what would it be?',
    key: 'primaryGoal',
    depth: 'Captures core financial motivation, urgency level, and emotional drivers',
    followUpTriggers: ['retire', 'buy house', 'education', 'business', 'emergency']
  },
  {
    prompt: 'Walk me through what you currently have invested — even roughly. Stocks, FDs, MFs, nothing yet?',
    key: 'currentPortfolio',
    depth: 'Assesses investment experience, existing asset allocation, and sophistication level',
    followUpTriggers: ['just starting', 'some mutual funds', 'stocks', 'FDs', 'real estate']
  },
  {
    prompt: 'If your ₹1 lakh investment dropped to ₹70k in a month, what would you do? (panic sell / hold / buy more)',
    key: 'riskBehavior',
    depth: 'Reveals true behavioral risk tolerance through hypothetical scenario',
    followUpTriggers: ['depends', 'would sell', 'would buy more', 'hold long term']
  },
  {
    prompt: 'After all expenses, roughly how much can you set aside for investing each month?',
    key: 'monthlySurplus',
    depth: 'Quantifies investable capacity and financial discipline',
    followUpTriggers: ['variable', 'depends on month', 'fixed amount', 'nothing left']
  },
  {
    prompt: 'When do you see yourself actually needing this money?',
    key: 'timeHorizon',
    depth: 'Defines investment timeline and liquidity requirements',
    followUpTriggers: ['short term', 'long term', 'retirement', 'specific goal', 'emergency']
  },
  {
    prompt: 'On a scale: Are you a Learner (just starting), Navigator (some experience), or Operator (active trader)?',
    key: 'knowledgeLevel',
    depth: 'Self-assessed financial sophistication and preferred engagement level',
    followUpTriggers: ['confused', 'intermediate', 'advanced', 'expert', 'beginner']
  },
  {
    prompt: 'How do you currently stay updated on markets or finance?',
    key: 'informationConsumption',
    depth: 'Identifies content preferences and information habits',
    followUpTriggers: ['news', 'social media', 'advisors', 'friends', 'dont follow', 'ET']
  },
  {
    prompt: 'What\'s the one thing that has held you back from investing more aggressively?',
    key: 'psychologicalBarrier',
    depth: 'Uncovers psychological blocks, fears, and constraint factors',
    followUpTriggers: ['fear', 'lack knowledge', 'time', 'money', 'risk', 'family']
  },
  {
    prompt: 'Describe your ideal financial situation 5 years from now. Be specific.',
    key: 'aspirationDepth',
    depth: 'Captures ambition level, specific goals, and vision for persona generation',
    followUpTriggers: ['financial freedom', 'passive income', 'wealth', 'security', 'lifestyle']
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Operator',
  persona: 'Emerging alpha seeker',
  summary: 'The system is gathering your first responses to construct a Gemini-powered financial persona.',
  riskTolerance: 'medium',
  riskLabel: 'Balanced',
  experienceLevel: 'Discovering baseline',
  interests: ['ET Markets', 'Wealth', 'AI'],
  primaryGoal: 'Complete onboarding',
  investmentHorizon: 'Still assessing',
  financialIQ: 62,
  profileCompletion: 10,
  coreId: 'OX-BOOTSTRAP',
  lastActive: new Date().toISOString(),
  insights: [
    { label: 'Risk appetite', value: 'Balanced', score: 60 },
    { label: 'Experience', value: 'Calibrating', score: 45 },
    { label: 'Goal clarity', value: 'Building', score: 52 },
  ],
};

export const DEFAULT_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-prime',
    title: 'ET Prime Daily Playbook',
    description: 'Premium briefings curated for users who want signal-first context before markets open.',
    confidence: 0.87,
    reasoning: 'Early responses indicate you value guided insight and structured decision support.',
    ctaLabel: 'Open ET Prime',
    link: 'https://economictimes.indiatimes.com/prime',
    source: 'ET Prime',
    tags: ['Premium', 'Morning Brief', 'Decision Support'],
  },
  {
    id: 'rec-markets',
    title: 'ET Markets Signal Scanner',
    description: 'A high-frequency watchlist of sectors, movers, and macro triggers inside the ET ecosystem.',
    confidence: 0.82,
    reasoning: 'Your onboarding path suggests an appetite for timely market context and thematic movement.',
    ctaLabel: 'View markets desk',
    link: 'https://economictimes.indiatimes.com/markets',
    source: 'ET Markets',
    tags: ['Markets', 'Signals', 'Watchlist'],
  },
];

export const DEFAULT_HUB_ITEMS: HubItem[] = [
  {
    id: 'hub-1',
    title: 'Inside ET Prime: The sectors institutions are quietly accumulating',
    description: 'A long-form article connecting macro narratives with specific sector rotation themes.',
    type: 'article',
    source: 'ET Prime',
    href: 'https://economictimes.indiatimes.com/prime',
    matchScore: 0.91,
    tags: ['Sector Rotation', 'Institutional', 'Long Form'],
  },
  {
    id: 'hub-2',
    title: 'Markets Dashboard',
    description: 'Monitor equity sentiment, benchmark moves, and cross-asset headlines from ET Markets.',
    type: 'tool',
    source: 'ET Markets',
    href: 'https://economictimes.indiatimes.com/markets',
    matchScore: 0.86,
    tags: ['Dashboard', 'Benchmarks', 'Real Time'],
  },
  {
    id: 'hub-3',
    title: 'ET Wealth Playbook',
    description: 'Personal finance explainers and portfolio-planning frameworks for your current stage.',
    type: 'course',
    source: 'ET Wealth',
    href: 'https://economictimes.indiatimes.com/wealth',
    matchScore: 0.83,
    tags: ['Wealth', 'Planning', 'Learning'],
  },
];

export const DEFAULT_SIMULATION: SimulationScenario = {
  title: 'Projection Alpha-7',
  subtitle: 'Gemini will convert your profile into a forward scenario once onboarding is complete.',
  optimistic: '$4.2M',
  expected: '$2.8M',
  points: [38, 42, 49, 58, 63, 72, 79, 88, 96, 100],
  metrics: [
    { label: 'Growth vector', value: '+12.4%', detail: 'Annualized upside from profile-aligned ideas', tone: 'positive' },
    { label: 'Drawdown guard', value: '-8.2%', detail: 'Expected downside in a stress window', tone: 'warning' },
    { label: 'Hedge efficiency', value: '94%', detail: 'Alignment between your goals and ET hedging content', tone: 'positive' },
  ],
  adjustments: [
    { id: 'adj-1', title: 'Increase AI theme exposure', detail: 'Gemini sees recurring interest in innovation-led growth setups.' },
    { id: 'adj-2', title: 'Pair conviction with ET Wealth explainers', detail: 'Use ET Wealth modules to translate ideas into allocation discipline.' },
    { id: 'adj-3', title: 'Track macro risk weekly', detail: 'A short weekly macro review reduces overreaction during volatility.' },
  ],
};

export function createFallbackPayload(sessionId: string): PersonalizationPayload {
  return {
    sessionId,
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `${PROFILING_QUESTIONS[0].prompt}`,
        timestamp: new Date().toISOString(),
        status: 'complete',
      },
    ],
    profile: DEFAULT_PROFILE,
    recommendations: DEFAULT_RECOMMENDATIONS,
    hubItems: DEFAULT_HUB_ITEMS,
    simulation: DEFAULT_SIMULATION,
    profilingQuestions: PROFILING_QUESTIONS,
    answeredQuestions: 0,
    profilingComplete: false,
  };
}
