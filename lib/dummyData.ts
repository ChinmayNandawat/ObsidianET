import {
  HubItem,
  PersonalizationPayload,
  ProfilingQuestion,
  Recommendation,
  SimulationScenario,
  UserProfile,
} from '../types';

export const PROFILING_QUESTIONS: ProfilingQuestion[] = [
  { id: 'name', prompt: 'What should I call you?', category: 'identity' },
  { id: 'experience', prompt: 'How many years have you been investing?', category: 'experience' },
  { id: 'risk', prompt: 'What is your risk style: cautious, balanced, or aggressive?', category: 'risk' },
  { id: 'goal', prompt: 'What is your main financial goal for the next 1-2 years?', category: 'goal' },
  { id: 'horizon', prompt: 'What is your preferred investment timeframe?', category: 'goal' },
  { id: 'focus', prompt: 'Which themes interest you most? (e.g., AI, equities, macro)', category: 'lifestyle' },
  { id: 'income', prompt: 'Are you looking for regular income, long-term growth, or both?', category: 'goal' },
  { id: 'volatility', prompt: 'How do you react to a sudden market drop?', category: 'risk' },
  { id: 'learning', prompt: 'What type of content do you prefer? (trade ideas, explainers, or deep dives)', category: 'lifestyle' },
  { id: 'time', prompt: 'How much time can you spend tracking markets weekly?', category: 'lifestyle' },
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
