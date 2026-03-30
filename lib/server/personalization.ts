import { Groq } from 'groq-sdk';
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

  const apiKey = process.env.GROQ_API_KEY?.replace(/"/g, '').trim();
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY. Please add GROQ_API_KEY to your .env file.");
  }

  const groq = new Groq({ apiKey });

  const conversationString = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

  let assistantReply = "";
  let updatedSession = { ...session, messages };

  // Safety constraint: If we hit 10 questions, force completion
  if (updatedSession.answeredQuestions >= 10 && !updatedSession.profilingComplete) {
    updatedSession.profilingComplete = true;
    isJustFinished = true;
  }

  if (!updatedSession.profilingComplete) {
    const currentQIndex = updatedSession.answeredQuestions;
    const currentQuestion = PROFILING_QUESTIONS[currentQIndex];
    
    // Explicitly handle the logic for the final question
    const isLastQuestion = currentQIndex === PROFILING_QUESTIONS.length - 1;

    const profilingPrompt = `You are the ET AI Concierge. A user is answering 10 specific onboarding questions.
Current Question (Question ${currentQIndex + 1} of 10): "${currentQuestion.prompt}"

User's Latest Message: "${userInput}"

Your task:
1. Determine if the user has adequately answered the current question. Small talk is allowed but doesn't count as an answer unless it contains the info.
2. If yes: Increment the answered count to ${currentQIndex + 1}. ${isLastQuestion ? "This is the final question, so just acknowledge their answer and say we are setting up their dashboard." : "Pick the NEXT question from the list below. Acknowledge their answer briefly and ask the next question."}
3. If no: Keep the answered count at ${currentQIndex}. Briefly handle their small talk, then politely re-ask the current question.

Question List:
${PROFILING_QUESTIONS.map((q, i) => `${i + 1}. ${q.prompt}`).join('\n')}        

Constraints:
- \`newAnsweredCount\` MUST be exactly ${currentQIndex + 1} if they answered the question, or ${currentQIndex} if they didn't.
- \`isProfilingComplete\` MUST be true ONLY if \`newAnsweredCount\` equals 10.

You must reply in valid JSON format. Return ONLY a JSON object matching this schema exactly:
{"assistantReply": "string", "newAnsweredCount": number, "isProfilingComplete": boolean}`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: profilingPrompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      
      const responseText = completion.choices[0]?.message?.content || '{}';
      const data = JSON.parse(responseText);
      
      assistantReply = data.assistantReply || "Got it. Let's move to the next question.";
      
      // Clamp the count to exactly current + 1 or stay the same
      if (typeof data.newAnsweredCount === 'number') {
        updatedSession.answeredQuestions = Math.min(Math.max(data.newAnsweredCount, currentQIndex), currentQIndex + 1);
      }
      
      if (data.isProfilingComplete || updatedSession.answeredQuestions >= 10) {
        updatedSession.profilingComplete = true;
        isJustFinished = true;
      }
    } catch (err: any) {
      console.error("Groq Profiling Error:", err.message);
      assistantReply = "I'm having a slight connection hiccup right now. Let me try that again.";
    }

  } else {
    // Stage 3: General Chat Post-Profiling
    const postProfilingPrompt = `
You are the ET AI Concierge for The Economic Times ecosystem. The user has already finished their onboarding.
Their profile summary: ${updatedSession.profile?.summary || 'User is looking for ET insights.'}
Their main goal: ${updatedSession.profile?.primaryGoal || 'Financial growth'}
Risk Level: ${updatedSession.profile?.riskLabel || 'Balanced'}

Conversation History:
${conversationString.replace(/`/g, "'")}

Respond strictly in plain text / conversational format to their latest message. Keep your responses crisp, direct, and under 4-5 sentences.
`;
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: postProfilingPrompt },
          { role: "user", content: userInput }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });
      assistantReply = completion.choices[0]?.message?.content || "Could you clarify that?";
    } catch (err: any) {
      console.error("Groq Chat Error:", err.message);
      assistantReply = "I'm experiencing some interference. Could you say that again?";
    }
  }

  // Generate Profile & Recommendations Dashboard
  if (isJustFinished || (session.profilingComplete && session.recommendations.length > 0 && session.recommendations[0].id === 'rec-prime')) {
    console.log("Profiling complete! Generating recommendations dashboard...");

    const synthesisPrompt = `You are the ET AI Concierge expert data generator. Based on the conversation, generate a profile and recommendations.
Conversation:
${conversationString.replace(/`/g, "'")}

CRITICAL LINK INSTRUCTIONS: Use only these links:
- https://economictimes.indiatimes.com/prime
- https://economictimes.indiatimes.com/markets
- https://economictimes.indiatimes.com/wealth
- https://economictimes.indiatimes.com/tech

RETURN ONLY JSON:
{
  "assistantReply": "Welcome aboard. Your dashboard is ready.",
  "profile": {
    "name": "Name or Operator",
    "persona": "e.g. Alpha Seeker",
    "summary": "2 sentence summary.",
    "riskTolerance": "medium",
    "riskLabel": "Balanced",
    "experienceLevel": "Intermediate",
    "interests": ["ET Markets"],
    "primaryGoal": "Wealth",
    "investmentHorizon": "5+ years",
    "financialIQ": 75,
    "profileCompletion": 100,
    "coreId": "OX-USER-1",
    "insights": [{"label": "Risk appetite", "value": "Balanced", "score": 60}]
  },
  "recommendations": [
    {
      "title": "ET Prime Daily",
      "description": "Specific daily insights.",
      "confidence": 0.95,
      "reasoning": "You mentioned macro.",
      "ctaLabel": "Open ET",
      "link": "https://economictimes.indiatimes.com/prime",
      "source": "ET Prime",
      "tags": ["Premium"]
    }
  ]
}`;
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: synthesisPrompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      
      const data = JSON.parse(completion.choices[0]?.message?.content || '{}');
      updatedSession.profile = { ...data.profile, lastActive: new Date().toISOString() };
      updatedSession.recommendations = data.recommendations.map((r: any, i: number) => ({ ...r, id: `groq-rec-${i}` }));

      if (isJustFinished) {
        assistantReply = data.assistantReply || "Your profile is fully calibrated! The ET Ecosystem dashboard is ready on your right.";
      }
    } catch (err: any) {
      console.error("Groq Synthesis Error:", err.message);
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
