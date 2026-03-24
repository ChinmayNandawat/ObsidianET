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
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const conversationString = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

  let assistantReply = "";
  let updatedSession = { ...session, messages };

  if (!session.profilingComplete) {
    const profilingPrompt = `
You are FLUX — the AI core of Obsidian ET, a financial intelligence platform 
built on The Economic Times ecosystem. You are sharp, direct, and personable. 
You speak like a seasoned financial advisor who also happens to be excellent 
at conversation — never robotic, never generic.

Your mission: Guide the user through exactly 10 profiling questions to build 
their financial DNA. You must extract DEEP insights, not surface answers.

RULES:
1. Ask ONE question at a time. Never stack two questions.
2. If the user's answer is vague (e.g. "maybe", "not sure", "somewhere in between"), 
   DO NOT move on. Gently push back with a specific follow-up. Example: 
   "Got it — but if you had to pick one, which direction pulls you more?"
3. If the user gives a rich, specific answer, acknowledge it with ONE sharp 
   observation before moving to the next question. Example: 
   "Interesting — most people in your position actually underestimate that risk."
4. If the user asks a side question, answer it in ONE sentence, then redirect 
   to the pending question.
5. Maintain a tone that is: confident, warm, slightly premium. 
   Like Bloomberg meets a trusted mentor.
6. Never repeat a question that has already been answered.
7. Track answered count precisely. Move forward only when you have a 
   real, usable answer.

User has answered ${session.answeredQuestions} of 10 questions.

Conversation so far:
${conversationString}

Pending question number: ${session.answeredQuestions + 1}
Question list: 
${PROFILING_QUESTIONS.map((q, i) => `${i + 1}. ${q.prompt}${q.depth ? ` [captures: ${q.depth}]` : ''}`).join('\n')}

OUTPUT — strict JSON only:
{
  "assistantReply": "Your response + next question. Must feel natural, not mechanical.",
  "newAnsweredCount": <number>,
  "isProfilingComplete": <boolean>,
  "extractedInsight": "One-line summary of what you just learned from their answer"
}

isProfilingComplete = true ONLY when newAnsweredCount >= 10.`;

    try {
      console.log("Profiling prompt being sent, answeredQuestions:", session.answeredQuestions);
      const result = await model.generateContent(profilingPrompt);
      const rawText = result.response.text().trim();
      const cleanText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const data = JSON.parse(cleanText);
      
      assistantReply = data.assistantReply;
      updatedSession.answeredQuestions = data.newAnsweredCount;
      
      if (data.isProfilingComplete) {
        updatedSession.profilingComplete = true;
        isJustFinished = true; // Trigger the dashboard generation in stage 2
      }
    } catch (err: any) {
      console.error("Gemini Profiling Error - Message:", err.message);
      assistantReply = "Let me rephrase that — " + 
        PROFILING_QUESTIONS[session.answeredQuestions]?.prompt || 
        "Could you repeat your last answer?";
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
You are the FLUX Intelligence Engine. A user just completed their 10-question 
financial profiling. Your job is to synthesize their answers into:
1. A razor-sharp user profile
2. Exactly 4 hyper-targeted ET product recommendations

SYNTHESIS RULES:
- Every recommendation must reference at least 2 SPECIFIC things the user said
- Descriptions must be 2 sentences max — specific and actionable, not generic
- The "hook" field must be a single punchy line that would make THIS specific user 
  stop scrolling. Personalize it to their words/situation.
- Match scores must be calculated based on: goal alignment, risk fit, 
  experience level, time availability, investment horizon
- "whyThisFits" must list exactly 3 bullet points referencing user's actual answers
- urgencySignal: if their horizon is short or goal is income-based, add urgency copy

Conversation History:
${conversationString}

VERIFIED ET LINKS (use ONLY these, no hallucination):
- ET Prime: https://economictimes.indiatimes.com/prime
- ET Markets: https://economictimes.indiatimes.com/markets  
- ET Wealth: https://economictimes.indiatimes.com/wealth
- ET Tech: https://economictimes.indiatimes.com/tech
- ET Mutual Funds: https://economictimes.indiatimes.com/mf
- ET Options: https://economictimes.indiatimes.com/markets/options

RETURN THIS EXACT JSON SCHEMA — no extra fields, no missing fields:
{
  "assistantReply": "2-3 sentence welcome. Reference their name and one specific 
    thing they mentioned. Tell them their dashboard is live on the right.",
  "profile": {
    "name": "string",
    "persona": "Creative label e.g. 'Calculated Growth Architect'",
    "summary": "2 sentences — goal + behavioral risk style",
    "riskTolerance": "low" | "medium" | "high",
    "riskLabel": "Cautious" | "Balanced" | "Aggressive",
    "experienceLevel": "string",
    "interests": ["array of 3-5 strings"],
    "primaryGoal": "string",
    "investmentHorizon": "string",
    "financialIQ": <number 0-100>,
    "profileCompletion": 100,
    "coreId": "OX-USER-1",
    "insights": [
      { "label": "Risk appetite", "value": "string", "score": <0-100> },
      { "label": "Experience", "value": "string", "score": <0-100> },
      { "label": "Goal clarity", "value": "string", "score": <0-100> },
      { "label": "Time horizon", "value": "string", "score": <0-100> }
    ],
    "psychProfile": "One sentence on their financial personality archetype",
    "topBlocker": "The main fear/blocker they mentioned",
    "investableSurplus": "Monthly amount they can invest"
  },
  "recommendations": [
    {
      "title": "string — specific, not generic",
      "hook": "One punchy line personalized to their situation",
      "description": "2 sentences max — what it does + why for them specifically",
      "confidence": <0.0-1.0>,
      "matchScore": <60-99>,
      "reasoning": "1 sentence — direct reference to their answer",
      "whyThisFits": ["bullet 1 referencing their answer", "bullet 2", "bullet 3"],
      "ctaLabel": "Action-oriented label e.g. 'Start Screening'",
      "link": "one of the 6 verified links above",
      "source": "ET Prime" | "ET Markets" | "ET Wealth" | "ET Tech" | "ET MF" | "ET Options",
      "tags": ["2-4 relevant tags"],
      "urgencySignal": "string or null — e.g. 'Based on your 1-year horizon, act now'"
    }
  ]
}`;
    try {
      const gModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: 'application/json' }});
      const result = await gModel.generateContent(synthesisPrompt);
      const data = JSON.parse(result.response.text());
      
      updatedSession.profile = { ...data.profile, lastActive: new Date().toISOString() };
      updatedSession.recommendations = data.recommendations.map((r: any, i: number) => ({ 
        ...r, 
        id: `gemini-rec-${i}`,
        hook: r.hook || '',
        matchScore: r.matchScore || Math.round(r.confidence * 100),
        whyThisFits: r.whyThisFits || [],
        urgencySignal: r.urgencySignal || null
      }));
      
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
