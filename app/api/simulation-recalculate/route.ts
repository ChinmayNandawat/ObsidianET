import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getOrCreateSession } from '../../../lib/server/session-store';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const RECALCULATION_PROMPT = `You are a financial simulation engine for Obsidian Flux. Generate new projection numbers and metrics based on the user's updated profile.

Rules:
1. Use Indian Rupees (₹) with Lakhs/Crores format
2. Generate realistic projections based on risk tolerance and horizon
3. Create 3 key metrics: Growth Vector, Drawdown Guard, Hedge Efficiency
4. Generate 3 ET content recommendations
5. Return JSON format only

User Profile:
{profile}

Generate a JSON response with:
{
  "title": "Updated projection for [user's primary goal]",
  "subtitle": "Recalculated based on current profile data",
  "optimistic": "₹X.XL" (or Crores for large amounts),
  "expected": "₹X.XL" (or Crores for large amounts),
  "points": [array of 10 numbers 0-100 for chart],
  "metrics": [
    {
      "label": "Growth Vector",
      "value": "X.X%",
      "detail": "Annual growth potential",
      "tone": "positive"
    },
    {
      "label": "Drawdown Guard", 
      "value": "X.X%",
      "detail": "Maximum downside protection",
      "tone": "neutral"
    },
    {
      "label": "Hedge Efficiency",
      "value": "X.X%", 
      "detail": "Risk-adjusted returns",
      "tone": "positive"
    }
  ],
  "adjustments": [
    {
      "id": "et-wealth",
      "title": "ET Wealth: Strategic Portfolio Rebalancing",
      "detail": "Quarterly rebalancing strategy for optimal risk-adjusted returns",
      "etSection": "ET Wealth",
      "etLink": "https://economictimes.indiatimes.com/wealth"
    },
    {
      "id": "et-markets", 
      "title": "ET Markets: Sector Rotation Insights",
      "detail": "Data-driven sector allocation based on market cycles",
      "etSection": "ET Markets", 
      "etLink": "https://economictimes.indiatimes.com/markets"
    },
    {
      "id": "et-prime",
      "title": "ET Prime: Alternative Investment Opportunities",
      "detail": "Exploring beyond traditional assets for enhanced returns", 
      "etSection": "ET Prime",
      "etLink": "https://economictimes.indiatimes.com/prime"
    }
  ]
}

Base projections on:
- Risk tolerance: {riskTolerance}
- Investment horizon: {investmentHorizon}
- Primary goal: {primaryGoal}
- Experience level: {experienceLevel}`;

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = getOrCreateSession(searchParams.get('sessionId') || undefined);
    
    if (!process.env.GEMINI_API_KEY) {
      // Fallback mock data
      const mockResponse = {
        title: `Updated projection for ${session.profile.primaryGoal || 'Wealth Building'}`,
        subtitle: "Recalculated based on current profile data", 
        optimistic: "₹42.5L",
        expected: "₹28.3L",
        points: [20, 35, 40, 55, 62, 70, 82, 90, 95, 100],
        metrics: [
          {
            label: "Growth Vector",
            value: "12.5%",
            detail: "Annual growth potential",
            tone: "positive"
          },
          {
            label: "Drawdown Guard",
            value: "18.2%", 
            detail: "Maximum downside protection",
            tone: "neutral"
          },
          {
            label: "Hedge Efficiency",
            value: "15.8%",
            detail: "Risk-adjusted returns", 
            tone: "positive"
          }
        ],
        adjustments: [
          {
            id: "et-wealth",
            title: "ET Wealth: Strategic Portfolio Rebalancing",
            detail: "Quarterly rebalancing strategy for optimal risk-adjusted returns",
            etSection: "ET Wealth",
            etLink: "https://economictimes.indiatimes.com/wealth"
          },
          {
            id: "et-markets",
            title: "ET Markets: Sector Rotation Insights", 
            detail: "Data-driven sector allocation based on market cycles",
            etSection: "ET Markets",
            etLink: "https://economictimes.indiatimes.com/markets"
          },
          {
            id: "et-prime",
            title: "ET Prime: Alternative Investment Opportunities",
            detail: "Exploring beyond traditional assets for enhanced returns",
            etSection: "ET Prime", 
            etLink: "https://economictimes.indiatimes.com/prime"
          }
        ]
      };
      
      return NextResponse.json(mockResponse);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const fullPrompt = RECALCULATION_PROMPT
      .replace('{profile}', JSON.stringify(session.profile, null, 2))
      .replace('{riskTolerance}', session.profile.riskTolerance)
      .replace('{investmentHorizon}', session.profile.investmentHorizon)
      .replace('{primaryGoal}', session.profile.primaryGoal)
      .replace('{experienceLevel}', session.profile.experienceLevel);
    
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const simulationData = JSON.parse(jsonMatch[0]);
      return NextResponse.json(simulationData);
    }
    
    throw new Error('Invalid JSON response from Gemini');

  } catch (error) {
    console.error('Recalculation Error:', error);
    return NextResponse.json({
      error: "Failed to recalculate projections. Please try again."
    }, { status: 500 });
  }
}
