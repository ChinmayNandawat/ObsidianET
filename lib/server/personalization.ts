import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  DEFAULT_HUB_ITEMS,
  DEFAULT_RECOMMENDATIONS,
  DEFAULT_SIMULATION,
  DEFAULT_PROFILE,
  PROFILING_QUESTIONS,
} from '../dummyData';
import { Message, PersonalizationPayload, UserProfile, HubItem, ProfileSummary, JourneyStep, MissedOpportunity, NextBestAction } from '../../types';

export async function personalizeSession(session: PersonalizationPayload, userInput: string): Promise<PersonalizationPayload> {
  const userMessage: Message = {
    id: crypto.randomUUID(),
    role: 'user',
    content: userInput,
    timestamp: new Date().toISOString(),
    status: 'complete',
  };

  const messages = [...session.messages, userMessage];
  let isJustFinished = false;

  const apiKey = process.env.GEMINI_API_KEY?.replace(/"/g, '');
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const conversationString = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

  let assistantReply = "";
  let updatedSession = { ...session, messages };

  if (!session.profilingComplete) {
    const profilingPrompt = `
You are the ET AI Concierge for The Economic Times ecosystem.
Your goal is to guide the user through a short onboarding process consisting of exactly 10 questions.
We need to figure out their financial profile.

Here is the list of target questions to ask recursively:
${PROFILING_QUESTIONS.map((q, i) => `${i + 1}. ${q.prompt}`).join('\n')}

The user has answered ${session.answeredQuestions} questions so far.

Conversation History:
${conversationString.replace(/`/g, "'")}

INSTRUCTIONS:
1. Look at the user's latest response.
2. If they make small talk or ask a side question, answer it briefly, AND THEN ask the NEXT pending question from the list.
3. If they answered the question adequately, increment the answered question count in your head and ask the NEXT question on the list.
4. Keep your responses short, professional, conversational, and direct.

OUTPUT (JSON MATCHING SCHEMA):
{
  "assistantReply": "Your response to them and the next question text.",
  "newAnsweredCount": <number>, 
  "isProfilingComplete": <boolean>
}
**Ensure isProfilingComplete is true ONLY if newAnsweredCount is 10 or more**
`;

    try {
      const result = await model.generateContent(profilingPrompt);
      const data = JSON.parse(result.response.text());
      
      assistantReply = data.assistantReply;
      updatedSession.answeredQuestions = data.newAnsweredCount;
      
      if (data.isProfilingComplete) {
        updatedSession.profilingComplete = true;
        isJustFinished = true; // Trigger the dashboard generation in stage 2
      }
    } catch (err: any) {
      console.error("Gemini Profiling Error:", err.message);
      assistantReply = "I'm having a slight connection hiccup right now. Could you repeat that?";
    }

  } else {
    // Stage 3: General Chat Post-Profiling
    // In this branch, Gemini answers general queries contextually as the ET AI Concierge
    const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const postProfilingPrompt = `
You are the ET AI Concierge for The Economic Times ecosystem. The user has already finished their onboarding.
Their profile summary: ${updatedSession.profile?.summary || 'User is looking for ET insights.'}
Their main goal: ${updatedSession.profile?.primaryGoal || 'Financial growth'}
Risk Level: ${updatedSession.profile?.riskLabel || 'Balanced'}

Conversation History:
${conversationString.replace(/`/g, "'")}

Respond strictly in plain text / conversational format to their latest message. You can recommend ET topics, talk about macro, or adjust their profile via conversation. Keep your responses crisp, direct, and under 4-5 sentences.
`;
    try {
      const result = await chatModel.generateContent(postProfilingPrompt);
      assistantReply = result.response.text().trim();
    } catch (err: any) {
      console.error("Gemini Chat Error:", err.message);
      if (err.message.includes("429 Too Many Requests") || err.message.includes("Quota")) {
        assistantReply = "I'm hitting a quick rate limit with Gemini right now because of the free tier. Please wait about 60 seconds and try again!";
      } else {
        assistantReply = "I'm experiencing a quick interruption; could you rephrase that?";
      }
    }
  }

  // Generate Profile & Recommendations Dashboard
  // This triggers right after they answer the 10th question OR if it was already complete but we haven't generated the real recommendations yet
  if (isJustFinished || (session.profilingComplete && session.recommendations.length > 0 && session.recommendations[0].id === 'rec-prime')) {
    console.log("Profiling complete! Generating recommendations dashboard...");
    
    const synthesisPrompt = `
You are the ET AI Concierge expert data generator.
The user has just finished answering their 10 onboarding financial questions.

Conversation History:
${conversationString.replace(/`/g, "'")}

Based ON THEIR ANSWERS, generate a fully personalized user profile, and exactly 3 hyper-targeted "recommendations" for ET (Economic Times) products/features.

CRITICAL LINK INSTRUCTIONS:
Do NOT hallucinate links. You MUST map your recommendation to one of these exact, verified ET links ONLY:
- https://economictimes.indiatimes.com/prime (For Premium deep analysis, macro)
- https://economictimes.indiatimes.com/markets (For Live stock data, screener, signals)
- https://economictimes.indiatimes.com/wealth (For Personal finance, mutual funds, taxes)
- https://economictimes.indiatimes.com/tech (For Startup and technology news)
- https://economictimes.indiatimes.com/mf (For strictly Mutual Funds)
- https://economictimes.indiatimes.com/markets/options (For Options/Derivatives traders)

YOU MUST RETURN JSON MATCHING THIS EXACT SCHEMA:
{
  "assistantReply": "A welcome aboard message mentioning their dashboard is ready. Answer any final trailing thoughts they just had.",
  "profile": {
    "name": "Extract their name or use Operator",
    "persona": "e.g. Emerging Alpha Seeker",
    "summary": "2 sentence summary of their goals and risk profile.",
    "riskTolerance": "low" | "medium" | "high",
    "riskLabel": "Cautious" | "Balanced" | "Aggressive",
    "experienceLevel": "e.g. Intermediate",
    "interests": ["ET Markets", "AI", "Macro"],
    "primaryGoal": "e.g. Wealth Creation",
    "investmentHorizon": "e.g. 5+ years",
    "financialIQ": 75,
    "profileCompletion": 100,
    "coreId": "OX-USER-1",
    "insights": [
      { "label": "Risk appetite", "value": "Balanced", "score": 60 },
      { "label": "Experience", "value": "Intermediate", "score": 70 },
      { "label": "Goal clarity", "value": "High", "score": 85 }
    ]
  },
  "recommendations": [
    {
      "title": "ET Prime Daily Playbook",
      "description": "Specific daily insights matched to their answers.",
      "confidence": 0.95,
      "reasoning": "You mentioned wanting macro analysis.",
      "ctaLabel": "Open ET Prime",
      "link": "https://economictimes.indiatimes.com/prime",
      "source": "ET Prime",
      "tags": ["Premium", "Macro"]
    }
  ]
}
Return EXACTLY 4 recommendations of array items.
`;
    try {
      const gModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: 'application/json' }});
      const result = await gModel.generateContent(synthesisPrompt);
      const data = JSON.parse(result.response.text());
      
      updatedSession.profile = { ...data.profile, lastActive: new Date().toISOString() };
      updatedSession.recommendations = data.recommendations.map((r: any, i: number) => ({ ...r, id: `gemini-rec-${i}` }));
      
      if (isJustFinished) {
        assistantReply = data.assistantReply || "Your profile is fully calibrated! The ET Ecosystem dashboard is ready on your right.";
      }

    } catch (err: any) {
      console.error("Gemini Synthesis Error:", err.message);
    }
  }

  // Push the final AI response to the message array
  updatedSession.messages.push({
    id: crypto.randomUUID(),
    role: 'assistant',
    content: assistantReply,
    timestamp: new Date().toISOString(),
    status: 'complete',
  });

  return updatedSession;
}

export function getPersonalizedHubItems(session: PersonalizationPayload): HubItem[] {
  const { DEFAULT_HUB_ITEMS } = require('../dummyData') as typeof import('../dummyData');

  if (!session.profile) {
    return DEFAULT_HUB_ITEMS.map((item) => ({ ...item, relevanceScore: 0 }));
  }

  const profile = session.profile;
  const messages = session.messages ?? [];

  const SECTION_WEIGHTS: Record<string, any> = {
    ET_PRIME: {
      riskHigh: 15,
      riskMedium: 20,
      horizonLong: 25,
      goalWealth: 20,
      interestMacro: 10,
      interestEquity: 10,
      chatKeywordBoost: 5,
      baseScore: 10,
    },
    ET_MARKETS: {
      riskHigh: 25,
      riskMedium: 15,
      horizonShort: 20,
      goalTrading: 20,
      interestMarkets: 15,
      chatKeywordBoost: 5,
      baseScore: 15,
    },
    WEALTH: {
      riskLow: 25,
      riskMedium: 15,
      horizonLong: 20,
      goalWealth: 20,
      goalRetirement: 25,
      interestPlanning: 15,
      chatKeywordBoost: 5,
      baseScore: 10,
    },
    MASTERCLASS: {
      experienceBeginner: 30,
      experienceIntermediate: 15,
      goalLearning: 20,
      interestEducation: 15,
      chatKeywordBoost: 5,
      baseScore: 5,
    },
    GLOBAL_INSIGHTS: {
      interestGlobal: 25,
      interestMacro: 20,
      horizonLong: 15,
      riskHigh: 10,
      chatKeywordBoost: 5,
      baseScore: 5,
    },
  };

  const KEYWORDS: Record<string, string[]> = {
    ET_PRIME: ['alpha', 'prime', 'analysis', 'research', 'institutional'],
    ET_MARKETS: ['market', 'nifty', 'sensex', 'trade', 'stock', 'equity'],
    WEALTH: ['wealth', 'plan', 'portfolio', 'retirement', 'savings'],
    MASTERCLASS: ['learn', 'course', 'expert', 'masterclass', 'beginner'],
    GLOBAL_INSIGHTS: ['global', 'macro', 'geopolit', 'world', 'international'],
  };

  function scanChatKeywordsForSection(sectionKey: string) {
    const words = new Set<string>();
    const sectionKeywords = KEYWORDS[sectionKey] ?? [];
    for (const msg of messages) {
      if (msg.role !== 'user') continue;
      const content = msg.content.toLowerCase();
      for (const kw of sectionKeywords) {
        if (content.includes(kw)) words.add(kw);
      }
    }
    return Array.from(words);
  }

  const scoredItems = DEFAULT_HUB_ITEMS.map((item) => {
    const w = SECTION_WEIGHTS[item.category];
    let score = w?.baseScore ?? 0;

    // risk
    if (profile.riskTolerance === 'high') score += w?.riskHigh ?? 0;
    if (profile.riskTolerance === 'medium') score += w?.riskMedium ?? 0;
    if (profile.riskTolerance === 'low') score += w?.riskLow ?? 0;

    const horizon = (profile.investmentHorizon ?? '').toLowerCase();
    if (horizon.includes('long')) score += w?.horizonLong ?? 0;
    if (horizon.includes('short')) score += w?.horizonShort ?? 0;

    const goal = (profile.primaryGoal ?? '').toLowerCase();
    if (goal.includes('wealth')) score += w?.goalWealth ?? 0;
    if (goal.includes('trading') || goal.includes('trade')) score += w?.goalTrading ?? 0;
    if (goal.includes('retire') || goal.includes('retirement')) score += w?.goalRetirement ?? 0;
    if (goal.includes('learn') || goal.includes('learning') || goal.includes('course')) score += w?.goalLearning ?? 0;

    const exp = (profile.experienceLevel ?? '').toLowerCase();
    if (exp.includes('beginner')) score += w?.experienceBeginner ?? 0;
    if (exp.includes('intermediate')) score += w?.experienceIntermediate ?? 0;
    if (exp.includes('advanced')) score += w?.experienceAdvanced ?? 0;

    // interests
    for (const interest of profile.interests ?? []) {
      const il = interest.toLowerCase();
      if (il.includes('macro') || il.includes('global')) score += w?.interestMacro ?? 0;
      if (il.includes('equity') || il.includes('stocks') || il.includes('stock')) score += w?.interestEquity ?? 0;
      if (il.includes('markets')) score += w?.interestMarkets ?? 0;
      if (il.includes('planning') || il.includes('plan') || il.includes('portfolio')) score += w?.interestPlanning ?? 0;
      if (il.includes('education') || il.includes('learn') || il.includes('masterclass')) score += w?.interestEducation ?? 0;
      if (il.includes('global')) score += w?.interestGlobal ?? 0;
    }

    // chat keyword boost
    const foundKeywords = scanChatKeywordsForSection(item.category);
    const chatBoost = Math.min(foundKeywords.length * (w?.chatKeywordBoost ?? 0), 20);
    score += chatBoost;

    // Cap
    const finalScore = Math.min(Math.round(score), 100);

    // Build matchReason (reuse existing prioritized templates)
    let matchReason: string;
    if (foundKeywords.length > 0) {
      matchReason = `You asked about ${foundKeywords[0]} — this section is built for that focus.`;
    } else if ((profile.interests ?? []).some((i) => (item.tags ?? []).some((t) => i.toLowerCase().includes(t.toLowerCase())))) {
      const im = (profile.interests ?? []).find((i) => (item.tags ?? []).some((t) => i.toLowerCase().includes(t.toLowerCase())));
      matchReason = `Matched your stated interest in ${im}.`;
    } else if (profile.primaryGoal && ((profile.primaryGoal ?? '').toLowerCase().includes('global') || (profile.primaryGoal ?? '').toLowerCase().includes('macro'))) {
      matchReason = `Directly aligned with your goal: ${profile.primaryGoal}.`;
    } else if (item.category === 'ET_MARKETS' && profile.riskTolerance === 'high') {
      matchReason = 'Your Aggressive profile suggests active market tracking suits you.';
    } else if (item.category === 'WEALTH' && profile.riskTolerance === 'low') {
      matchReason = 'Your Cautious profile aligns with structured wealth planning.';
    } else if (item.category === 'MASTERCLASS' && (profile.experienceLevel ?? '').toLowerCase().includes('beginner')) {
      matchReason = 'Expert-led content recommended for your current experience level.';
    } else if (item.category === 'ET_PRIME' && ((profile.investmentHorizon ?? '').toLowerCase().includes('long'))) {
      matchReason = 'Deep analysis for your long-term investment approach.';
    } else if (item.category === 'GLOBAL_INSIGHTS') {
      matchReason = 'Macro and geopolitical context for your global investing interest.';
    } else if (item.category === 'ET_MARKETS') {
      matchReason = 'Market data is essential context for every investor.';
    } else {
      matchReason = 'Recommended based on your financial profile.';
    }

    let priorityLabel: string;
    if (finalScore >= 70) priorityLabel = 'Best Match';
    else if (finalScore >= 40) priorityLabel = 'Strong Match';
    else priorityLabel = 'Explore Next';

    return { ...item, relevanceScore: finalScore, matchReason, priorityLabel };
  });

  // Ensure sorted descending by relevanceScore
  const sorted = scoredItems.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));

  return sorted;
}

// NOTE for frontend dev: relevanceScore is now 0-100 percentage. No further scaling (/10*100) is required.

export function buildProfileSummary(session: PersonalizationPayload, topItems: HubItem[]): ProfileSummary | null {
  if (!session.profile) return null;

  const profile: any = session.profile;

  const persona: string =
    (typeof profile.persona === 'string' && profile.persona.trim())
      ? profile.persona.trim()
      : profile.riskTolerance === 'high'
          ? 'Growth-Focused Active Investor'
          : profile.riskTolerance === 'medium'
            ? 'Balanced Wealth Builder'
            : 'Conservative Long-Term Planner';

  const primaryGoal = String(profile.primaryGoal ?? '')
    .trim()
    .slice(0, 40);

  const riskLabel = String(profile.riskLabel ?? profile.riskTolerance ?? 'balanced');
  const experience = String(profile.experienceLevel ?? 'intermediate');
  const horizon = String(profile.investmentHorizon ?? 'long-term');

  const style = `${riskLabel}-risk approach, ${experience} level, ${horizon} horizon`;

  const bestETFit = (topItems ?? [])
    .slice(0, 3)
    .map((i) => i.title)
    .filter(Boolean);

  return { persona, primaryGoal, style, bestETFit };
}

export function buildJourneyPath(rankedItems: HubItem[]): JourneyStep[] {
  return (rankedItems ?? []).map((item, idx) => {
    const step = idx + 1;

    let action = `Start with ${item.title}`;
    let reason = 'Sets your strategic foundation';
    let section = 'ET Prime';

    switch (item.category) {
      case 'ET_PRIME':
        action = `Start with ${item.title}`;
        reason = 'Sets your strategic foundation';
        section = 'ET Prime';
        break;
      case 'ET_MARKETS':
        action = 'Track market signals in ET Markets';
        reason = 'Real-time context for your decisions';
        section = 'ET Markets';
        break;
      case 'WEALTH':
        action = 'Build your plan using Wealth Tools';
        reason = 'Turns insights into an action plan';
        section = 'Wealth Tools';
        break;
      case 'MASTERCLASS':
        action = 'Sharpen strategy with a Masterclass';
        reason = 'Accelerates your learning curve';
        section = 'Masterclass';
        break;
      case 'GLOBAL_INSIGHTS':
        action = 'Explore your Global Insights feed';
        reason = 'Broadens your macro perspective';
        section = 'Global Insights';
        break;
    }

    return { step, action, section, reason };
  });
}

export function getTabContextCopy(category: HubItem['category'] | 'ALL', session: PersonalizationPayload, sectionScore: number): { headline: string; subline: string } {
  const profile = session.profile;

  const safe = (value: any, fallback: string) => (value ? String(value) : fallback);

  if (category === 'ALL') {
    if (profile) {
      const hl = 'Your ET Intelligence Hub';
      const sl = `Ranked for a ${safe(profile.riskLabel ?? profile.riskTolerance, 'balanced')} investor focused on ${safe(profile.primaryGoal, 'your goals')}`;
      return { headline: hl, subline: sl };
    }
    return { headline: 'Your ET Intelligence Hub', subline: 'Complete your profile to unlock personalised rankings' };
  }

  if (category === 'ET_PRIME') {
    if (sectionScore >= 70) {
      return {
        headline: 'ET Prime: Your Highest Match',
        subline: `Deep analysis aligned with your ${safe(profile?.investmentHorizon, 'investment')} approach`,
      };
    }
    return { headline: 'ET Prime', subline: 'Institutional-grade insights for long-term wealth creation' };
  }

  if (category === 'ET_MARKETS') {
    if (sectionScore >= 70) {
      return {
        headline: 'ET Markets: Built for Your Style',
        subline: `Live signals matched to your ${safe(profile?.riskLabel ?? profile?.riskTolerance, 'risk')} risk approach`,
      };
    }
    return { headline: 'ET Markets', subline: 'Real-time market data and predictive analytics' };
  }

  if (category === 'WEALTH') {
    if (sectionScore >= 70) {
      return {
        headline: 'Wealth Tools: Your Action Plan',
        subline: `Planning tools aligned with your goal: ${safe(profile?.primaryGoal, 'your financial goal')}`,
      };
    }
    return { headline: 'Wealth Tools', subline: 'Bespoke financial planning and portfolio management' };
  }

  if (category === 'MASTERCLASS') {
    if (sectionScore >= 70) {
      return {
        headline: 'Masterclass: Start Here',
        subline: `Expert content recommended for your ${safe(profile?.experienceLevel, 'experience')} level`,
      };
    }
    return { headline: 'Masterclass', subline: 'Learn from institutional experts and industry leaders' };
  }

  // GLOBAL_INSIGHTS
  if (category === 'GLOBAL_INSIGHTS') {
    if (sectionScore >= 70) {
      return {
        headline: 'Global Insights: Your Macro Edge',
        subline: 'World-view analysis for your long-term perspective',
      };
    }
    return { headline: 'Global Insights', subline: 'Macro-economic and geopolitical risk analysis' };
  }

  return { headline: 'Your ET Intelligence Hub', subline: 'Complete your profile to unlock personalised rankings' };
}

export function getMissedOpportunities(session: PersonalizationPayload, scoredItems: HubItem[]): MissedOpportunity[] {
  if (!session.profile) return [];

  const profile = session.profile;
  const opportunities: MissedOpportunity[] = [];

  for (const item of scoredItems) {
    const score = item.relevanceScore ?? 0;
    if (score >= 40) continue; // skip strong matches

    if (item.category === 'ET_PRIME' && (profile.riskTolerance === 'medium' || profile.riskTolerance === 'high')) {
      opportunities.push({
        category: item.category,
        title: 'ET Prime deep-dive reports',
        teaser: 'Institutional-grade analysis you haven\'t explored yet',
        unlockHint: 'Tell me more about your investment style in chat',
      });
    }

    if (item.category === 'MASTERCLASS' && ((profile.experienceLevel ?? '').toLowerCase().includes('beginner') || (profile.experienceLevel ?? '').toLowerCase().includes('intermediate'))) {
      opportunities.push({
        category: item.category,
        title: 'Masterclass learning modules',
        teaser: 'Expert-led courses matched to your experience level',
        unlockHint: 'Ask me about learning resources in The Terminal',
      });
    }

    if (item.category === 'WEALTH' && ((profile.primaryGoal ?? '').toLowerCase().includes('wealth') || (profile.primaryGoal ?? '').toLowerCase().includes('retire'))) {
      opportunities.push({
        category: item.category,
        title: 'Wealth planning tools',
        teaser: '12+ planning utilities aligned with your goals',
        unlockHint: 'Explore the Wealth section to build your plan',
      });
    }

    if (item.category === 'GLOBAL_INSIGHTS' && ((profile.investmentHorizon ?? '').toLowerCase().includes('long'))) {
      opportunities.push({
        category: item.category,
        title: 'Global macro insights',
        teaser: 'Geopolitical and macro context for long-term investors',
        unlockHint: 'Update your interests to include global markets',
      });
    }

    if (opportunities.length >= 3) break;
  }

  return opportunities.slice(0, 3);
}

export function getNextBestAction(session: PersonalizationPayload, scoredItems: HubItem[]): NextBestAction | null {
  if (!session.profile) return null;
  if (!scoredItems || scoredItems.length === 0) return null;

  const top = scoredItems[0];
  const category = top.category;
  let action = '';
  let urgency: 'high' | 'medium' | 'low' = 'low';

  switch (category) {
    case 'ET_PRIME':
      action = "Read today's ET Prime Alpha Report before market open";
      urgency = 'high';
      break;
    case 'ET_MARKETS':
      action = 'Check live NIFTY and SENSEX signals for today\'s session';
      urgency = 'high';
      break;
    case 'WEALTH':
      action = 'Use Wealth Tools to build your 12-month capital allocation plan';
      urgency = 'medium';
      break;
    case 'MASTERCLASS':
      action = 'Start your first Masterclass session — takes under 20 minutes';
      urgency = 'low';
      break;
    case 'GLOBAL_INSIGHTS':
      action = "Read this week's Global Insights macro brief";
      urgency = 'medium';
      break;
  }

  return {
    headline: 'Your next best action',
    action,
    category,
    urgency,
  };
}