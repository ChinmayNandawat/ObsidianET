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
}
