import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  DEFAULT_HUB_ITEMS,
  DEFAULT_RECOMMENDATIONS,
  DEFAULT_SIMULATION,
  DEFAULT_PROFILE,
  PROFILING_QUESTIONS,
} from '../dummyData';
import { Message, PersonalizationPayload, UserProfile } from '../../types';

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
    model: 'gemini-2.5-flash-preview-04-17',
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
