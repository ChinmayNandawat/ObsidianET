export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  status?: 'thinking' | 'complete';
}

export interface ProfilingQuestion {
  id: string;
  prompt: string;
  category: 'identity' | 'experience' | 'risk' | 'goal' | 'lifestyle';
}

export interface ProfileInsight {
  label: string;
  value: string;
  score: number;
}

export interface UserProfile {
  name: string;
  persona: string;
  summary: string;
  riskTolerance: 'low' | 'medium' | 'high';
  riskLabel: string;
  experienceLevel: string;
  interests: string[];
  primaryGoal: string;
  investmentHorizon: string;
  financialIQ: number;
  profileCompletion: number;
  coreId: string;
  lastActive: string;
  insights: ProfileInsight[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  ctaLabel: string;
  link: string;
  source: string;
  tags: string[];
}

export interface HubItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'product' | 'tool' | 'course';
  source: string;
  href: string;
  matchScore: number;
  tags: string[];
}

export interface SimulationMetric {
  label: string;
  value: string;
  detail: string;
  tone: 'positive' | 'neutral' | 'warning';
}

export interface SimulationAdjustment {
  id: string;
  title: string;
  detail: string;
  etSection?: string;
  etLink?: string;
}

export interface SimulationScenario {
  title: string;
  subtitle: string;
  optimistic: string;
  expected: string;
  points: number[];
  metrics: SimulationMetric[];
  adjustments: SimulationAdjustment[];
}

export interface PersonalizationPayload {
  sessionId: string;
  messages: Message[];
  profile: UserProfile;
  recommendations: Recommendation[];
  hubItems: HubItem[];
  simulation: SimulationScenario;
  profilingQuestions: ProfilingQuestion[];
  answeredQuestions: number;
  profilingComplete: boolean;
  savedTrack?: string[];
}

export interface HubItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'product' | 'tool' | 'course';
  source: string;
  href: string;
  matchScore: number;
  tags: string[];
  category?: string;
  priorityLabel?: string;
  isLive?: boolean;
  isSaved?: boolean;
  matchReason?: string;
}

export interface HubState {
  items: HubItem[];
  savedTrack: string[];
  sectionScores: Array<{
    category: string;
    score: number;
  }>;
  isPersonalized: boolean;
  hubItems?: HubItem[];
  profileSummary?: ProfileSummary;
  journeyPath?: JourneyStep[];
  nextBestAction?: {
    action: string;
    urgency?: 'low' | 'medium' | 'high';
  };
  missedOpportunities?: Array<{
    category: string;
    title: string;
    teaser: string;
    unlockHint: string;
  }>;
}

export type HubCategory = 'ALL' | 'ET_PRIME' | 'ET_MARKETS' | 'WEALTH' | 'MASTERCLASS' | 'GLOBAL_INSIGHTS';

export interface ProfileSummary {
  name: string;
  persona: string;
  riskTolerance: string;
  primaryGoal: string;
  investmentHorizon: string;
  completionPercentage: number;
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  category: string;
  estimatedTime?: string;
}
