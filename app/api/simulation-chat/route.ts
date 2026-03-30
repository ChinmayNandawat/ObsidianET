import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getOrCreateSession } from '../../../lib/server/session-store';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SIMULATION_CHATBOT_PROMPT = `You are a specialized Simulation Assistant for Obsidian Flux. Your role is to help users understand their Future Outcome Simulation in simple, clear terms.

Your expertise includes:
- Explaining projection charts and what the lines mean
- Breaking down financial metrics like Growth Vector, Drawdown Guard, Hedge Efficiency
- Interpreting risk tolerance and investment horizon impacts
- Making complex financial concepts easy to understand
- Providing context about Nifty 50 benchmarks vs personal projections
- Explaining ET content recommendations and their relevance

User Profile Context:
{profile}

Current Simulation Data:
{simulation}

Guidelines:
- Keep explanations simple and conversational
- Use analogies and real-world examples
- Focus on helping the user understand THEIR specific simulation
- Reference their actual numbers and goals
- Be encouraging and educational
- Avoid overly technical jargon
- If you don't understand something, ask for clarification

User Question: "{message}"

Please provide a helpful, clear explanation that helps this specific user understand their simulation better.`;

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = getOrCreateSession(searchParams.get('sessionId') || undefined);
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response for simulation explanations
      const fallbackResponses = [
        "Your simulation shows how your investments might grow over time based on your risk tolerance and goals. The green line represents your projected growth, while the dashed line shows the Nifty 50 benchmark for comparison.",
        "The optimistic projection represents best-case scenario performance, while the expected projection is more realistic based on market conditions. Your actual results will likely fall somewhere between these two lines.",
        "Growth Vector shows your potential annual returns based on your risk profile. Higher risk tolerance typically means higher potential growth but also more volatility.",
        "The Nifty 50 benchmark line helps you compare your projected performance against India's main stock index. If your projection is above this line, you're expected to outperform the broader market.",
        "ET recommendations are tailored to your profile - ET Wealth for personal finance guidance, ET Markets for investment insights, and ET Prime for premium analysis."
      ];

      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return NextResponse.json({
        response: randomResponse,
        category: 'guidance',
        timestamp: new Date().toISOString(),
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    
    const fullPrompt = SIMULATION_CHATBOT_PROMPT
      .replace('{profile}', JSON.stringify(session.profile, null, 2))
      .replace('{simulation}', JSON.stringify(session.simulation, null, 2))
      .replace('{message}', message);
    
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    return NextResponse.json({
      response: response.trim(),
      category: 'guidance',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Simulation Chatbot Error:', error);
    return NextResponse.json({
      response: "I'm having trouble processing your question right now. Please try again in a moment. I'm here to help explain your simulation projections and financial concepts!",
      category: 'guidance',
      timestamp: new Date().toISOString(),
    });
  }
}
