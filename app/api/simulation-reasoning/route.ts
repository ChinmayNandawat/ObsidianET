import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getOrCreateSession } from '../../../lib/server/session-store';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SIMULATION_REASONING_PROMPT = `You are a financial analyst for Obsidian Flux. Based on the user's profile data, explain in 2-3 clear sentences why these specific projection numbers were generated for this user.

Your explanation should:
- Be concise and easy to understand
- Reference their risk tolerance and investment horizon
- Connect their goals to the projection outcomes
- Use Indian context where relevant
- Avoid technical jargon

User Profile:
{profile}

Simulation Results:
- Optimistic: {optimistic}
- Expected: {expected}
- Investment Horizon: {horizon}

Provide a clear explanation of why these numbers make sense for this specific user.`;

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = getOrCreateSession(searchParams.get('sessionId') || undefined);
    const body = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reasoning: "Based on your risk profile and investment horizon, these projections reflect a balanced approach to wealth building. The expected outcome accounts for market volatility while the optimistic scenario assumes favorable conditions for your investment strategy."
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' });
    
    const fullPrompt = SIMULATION_REASONING_PROMPT
      .replace('{profile}', JSON.stringify(session.profile, null, 2))
      .replace('{optimistic}', body.optimistic || '--')
      .replace('{expected}', body.expected || '--')
      .replace('{horizon}', session.profile.investmentHorizon || '--');
    
    const result = await model.generateContent(fullPrompt);
    const reasoning = result.response.text();

    return NextResponse.json({ reasoning: reasoning.trim() });
    
  } catch (error) {
    console.error('Simulation Reasoning Error:', error);
    return NextResponse.json({
      reasoning: "Your projections are tailored to your risk tolerance and investment timeline, balancing growth potential with market realities for optimal outcomes."
    });
  }
}
