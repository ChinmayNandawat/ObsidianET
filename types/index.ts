export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'thinking' | 'complete';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  actions: string[];
}

export interface UserProfile {
  name: string;
  riskTolerance: 'low' | 'medium' | 'high';
  interests: string[];
  lastActive: Date;

  // Active Hub / personalization enrichment (optional to preserve current callers)
  primaryGoal?: string;
  investmentHorizon?: string;
  experienceLevel?: string;
  riskLabel?: string;
  summary?: string;
}

export type HubCategory = 'ET_PRIME' | 'ET_MARKETS' | 'WEALTH' | 'MASTERCLASS' | 'GLOBAL_INSIGHTS';

export interface HubItem {
  id: string;
  title: string;
  description: string;
  category: HubCategory;
  tags: string[];
  isLive?: boolean;

  // Added at runtime, not persisted
  relevanceScore?: number;
  matchReason?: string;
  priorityLabel?: string;

  badge?: string;
  ctaLabel?: string;
  stats?: { label: string; value: string }[];
}

export interface PersonalizationPayload {
  sessionId: string;
  messages: Message[];
  profilingComplete: boolean;
  answeredQuestions: number;
  profile?: UserProfile;
  recommendations: Recommendation[];
  hubItems?: HubItem[];
  savedTrack?: string[]; // array of HubItem ids
}

export interface SectionScore {
  category: HubItem['category'];
  score: number; // 0-100
  priorityLabel: string;
  reason: string;
}

export interface MissedOpportunity {
  category: HubItem['category'];
  title: string;
  teaser: string;
  unlockHint: string;
}

export interface NextBestAction {
  headline: string;
  action: string;
  category: HubItem['category'];
  urgency: 'high' | 'medium' | 'low';
}

export interface HubState {
  hubItems: HubItem[];
  profile?: UserProfile;
  profileSummary?: ProfileSummary;
  journeyPath?: JourneyStep[];
  sectionScores?: SectionScore[];
  missedOpportunities?: MissedOpportunity[];
  nextBestAction?: NextBestAction | null;
  tabCopyMap?: Record<string, { headline: string; subline: string }>;
  savedTrack: string[];
  isPersonalized: boolean;
}

export interface ProfileSummary {
  persona: string;
  primaryGoal: string;
  style: string;
  bestETFit: string[];
}

export interface JourneyStep {
  step: number;
  action: string;
  section: string;
  reason: string;
}
