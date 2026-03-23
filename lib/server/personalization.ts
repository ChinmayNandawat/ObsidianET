import { GoogleGenAI } from '@google/genai';
import {
  DEFAULT_HUB_ITEMS,
  DEFAULT_RECOMMENDATIONS,
  DEFAULT_SIMULATION,
  DEFAULT_PROFILE,
  PROFILING_QUESTIONS,
} from '../dummyData';
import { Message, PersonalizationPayload, ProfilingQuestion, Recommendation, UserProfile } from '../../types';

function isValidGeminiPayload(payload: any): payload is {
  assistantReply: string;
  profile: UserProfile;
  recommendations: Recommendation[];
  hubItems: PersonalizationPayload['hubItems'];
  simulation: PersonalizationPayload['simulation'];
} {
  return Boolean(payload?.assistantReply && payload?.profile && Array.isArray(payload?.recommendations) && Array.isArray(payload?.hubItems) && payload?.simulation);
}


function generateFallbackProfile(messages: Message[], answeredQuestions: number): UserProfile {
  const answers = messages.filter((message) => message.role === 'user').map((message) => message.content);
  const name = answers[0]?.split(' ')[0]?.replace(/[^a-zA-Z]/g, '') || DEFAULT_PROFILE.name;
  const riskSource = answers.join(' ').toLowerCase();
  const riskTolerance = riskSource.includes('aggressive') || riskSource.includes('high') ? 'high' : riskSource.includes('cautious') || riskSource.includes('low') ? 'low' : 'medium';
  const riskLabel = riskTolerance === 'high' ? 'Aggressive' : riskTolerance === 'low' ? 'Defensive' : 'Balanced';
  const interests = Array.from(new Set(answers.join(' ').split(/[, ]+/).filter((word) => ['ai', 'equities', 'macro', 'wealth', 'startups', 'trading', 'markets'].includes(word.toLowerCase())).map((word) => word.toUpperCase()))).slice(0, 4);

  return {
    name: name || DEFAULT_PROFILE.name,
    persona: answeredQuestions >= 4 ? 'Personalized ET operator' : DEFAULT_PROFILE.persona,
    summary: answeredQuestions >= 4
      ? `Profile synthesized from ${answeredQuestions} onboarding responses. Recommendations now prioritize ${riskLabel.toLowerCase()} opportunities, ET content, and execution support.`
      : DEFAULT_PROFILE.summary,
    riskTolerance,
    riskLabel,
    experienceLevel: answeredQuestions >= 2 ? 'Self-directed investor' : DEFAULT_PROFILE.experienceLevel,
    interests: interests.length ? interests : DEFAULT_PROFILE.interests,
    primaryGoal: answers[3] || 'Clarify your next financial milestone',
    investmentHorizon: answers[4] || '1-3 years',
    financialIQ: Math.min(96, 58 + answeredQuestions * 3),
    profileCompletion: Math.min(100, 10 + answeredQuestions * 9),
    coreId: `OX-${(name || 'USER').toUpperCase()}-${answeredQuestions.toString().padStart(3, '0')}`,
    lastActive: new Date().toISOString(),
    insights: [
      { label: 'Risk appetite', value: riskLabel, score: riskTolerance === 'high' ? 84 : riskTolerance === 'low' ? 38 : 65 },
      { label: 'Experience', value: answeredQuestions >= 3 ? 'Active' : 'Emerging', score: 40 + answeredQuestions * 5 },
      { label: 'Goal clarity', value: answeredQuestions >= 5 ? 'Defined' : 'Developing', score: 45 + answeredQuestions * 4 },
    ],
  };
}

function generateFallbackRecommendations(profile: UserProfile): Recommendation[] {
  const topTag = profile.interests[0] || 'ET Markets';
  return DEFAULT_RECOMMENDATIONS.map((recommendation, index) => ({
    ...recommendation,
    id: `${recommendation.id}-${index}`,
    confidence: Math.min(0.98, recommendation.confidence + profile.profileCompletion / 1000),
    reasoning: `${recommendation.reasoning} Gemini fallback aligned this card with your ${profile.riskLabel.toLowerCase()} profile and interest in ${topTag}.`,
    tags: [...recommendation.tags, topTag],
  }));
}

function buildAssistantReply(profile: UserProfile, answeredQuestions: number, nextQuestion?: ProfilingQuestion) {
  if (nextQuestion) {
    return `Profile signal updated for ${profile.name}. Current read: ${profile.riskLabel} risk, ${profile.experienceLevel.toLowerCase()}, focused on ${profile.primaryGoal}. Next question: ${nextQuestion.prompt}`;
  }

  return `Profile complete. You map to ${profile.persona.toLowerCase()} with a ${profile.riskLabel.toLowerCase()} stance. I have refreshed your ET ecosystem recommendations, active hub, and simulation panel around ${profile.primaryGoal}.`;
}

export async function personalizeSession(session: PersonalizationPayload, userInput: string) {
  const userMessage: Message = {
    id: crypto.randomUUID(),
    role: 'user',
    content: userInput,
    timestamp: new Date().toISOString(),
    status: 'complete',
  };

  const messages = [...session.messages, userMessage];
  const answeredQuestions = messages.filter((message) => message.role === 'user').length;
  const nextQuestion = answeredQuestions < PROFILING_QUESTIONS.length ? PROFILING_QUESTIONS[answeredQuestions] : undefined;

  let profile = generateFallbackProfile(messages, answeredQuestions);
  let recommendations = generateFallbackRecommendations(profile);
  let hubItems = DEFAULT_HUB_ITEMS.map((item, index) => ({
    ...item,
    id: `${item.id}-${index}`,
    matchScore: Math.min(0.99, item.matchScore + profile.profileCompletion / 1000),
    description: `${item.description} Personalized for ${profile.name}'s ${profile.riskLabel.toLowerCase()} strategy and ${profile.primaryGoal.toLowerCase()}.`,
  }));
  let simulation = {
    ...DEFAULT_SIMULATION,
    subtitle: `Scenario calibrated for ${profile.name}: ${profile.primaryGoal}.`,
    optimistic: profile.riskTolerance === 'high' ? '$5.6M' : profile.riskTolerance === 'low' ? '$3.4M' : '$4.2M',
    expected: profile.riskTolerance === 'high' ? '$3.1M' : profile.riskTolerance === 'low' ? '$2.5M' : '$2.8M',
  };
  let assistantReply = buildAssistantReply(profile, answeredQuestions, nextQuestion);

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are building a personalized financial profile and ET ecosystem concierge.\nQuestions: ${PROFILING_QUESTIONS.map((q, index) => `${index + 1}. ${q.prompt}`).join('\n')}\nConversation: ${messages.map((m) => `${m.role}: ${m.content}`).join('\n')}\nReturn JSON with assistantReply, profile, recommendations, hubItems, simulation. Recommendations and hub items should reference ET ecosystem-style resources with title, description, source, link. Use dummy links if needed. Answered questions count: ${answeredQuestions}. Next question: ${nextQuestion?.prompt || 'none - profiling complete'}.`;
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      const parsed = JSON.parse(result.text || '{}');
      if (!isValidGeminiPayload(parsed)) throw new Error('Invalid Gemini payload');
      profile = { ...parsed.profile, lastActive: new Date().toISOString() };
      recommendations = parsed.recommendations.map((item, index) => ({ ...item, id: `gemini-rec-${index}` }));
      hubItems = parsed.hubItems.map((item, index) => ({ ...item, id: `gemini-hub-${index}` }));
      simulation = parsed.simulation;
      assistantReply = parsed.assistantReply;
    } catch (error) {
      console.error('Gemini personalization fallback triggered:', error);
    }
  }

  const assistantMessage: Message = {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: assistantReply,
    timestamp: new Date().toISOString(),
    status: 'complete',
  };

  return {
    ...session,
    messages: [...messages, assistantMessage],
    profile,
    recommendations,
    hubItems,
    simulation,
    answeredQuestions,
    profilingComplete: !nextQuestion,
  } satisfies PersonalizationPayload;
}
