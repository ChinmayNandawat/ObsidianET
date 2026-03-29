import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface FinancialChatRequest {
  message: string;
  sessionId?: string;
}

interface FinancialChatResponse {
  response: string;
  category: 'stocks' | 'trading' | 'investment' | 'analysis' | 'guidance';
  timestamp: string;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Enhanced system prompt for Obsidian Flux Financial Assistant
const OBSIDIAN_FLUX_ASSISTANT_PROMPT = `You are the intelligent Financial Assistant for Obsidian Flux, a sophisticated financial analysis platform powered by Economic Times data. Your role is to provide helpful, accurate, and contextual responses.

## Your Capabilities:

### 1. Financial Education (Simple Language)
- Explain complex financial concepts in simple, easy-to-understand terms
- Use analogies and real-world examples
- Focus on practical understanding over technical jargon
- Keep explanations concise but thorough (under 150 words)

### 2. Obsidian Flux Platform Guidance
- Explain platform features and navigation
- Guide users through the Economic Times ecosystem integration
- Help users understand how to use analysis tools and recommendations
- Explain the profiling system and personalization features

### 3. Market Context & Insights
- Provide general market education (no specific advice)
- Explain Economic Times data integration
- Help users understand financial terminology they encounter
- Guide users through the platform's analytical capabilities

## Important Guidelines:
- Never provide specific investment advice or stock recommendations
- Always include disclaimers for financial topics
- Be encouraging and educational in tone
- When asked about Obsidian Flux features, be specific and helpful
- Use the platform's actual terminology (e.g., "Active Hub", "profiling", "recommendations")

## Response Categories:
- **guidance**: Platform help, navigation, Obsidian Flux features
- **analysis**: Financial metrics, ratios, market concepts
- **stocks**: Stock market, equities, trading concepts
- **investment**: Portfolio management, investment strategies
- **trading**: Trading concepts, market mechanics

## Example Responses:
Q: "What is Active Hub?"
A: "Active Hub is your central command center in Obsidian Flux where Economic Times data gets synthesized into actionable insights. It's where the platform's AI analyzes market trends, news, and your personal profile to deliver tailored recommendations. Think of it as the brain of the system that processes ET's vast financial ecosystem and presents it in an easy-to-use interface. You can access it through the main navigation to see real-time analysis and personalized suggestions."

Q: "How does profiling work?"
A: "Profiling is how Obsidian Flux learns about your investment preferences and goals. The system asks targeted questions about your risk tolerance, investment timeline, and interests. This data helps personalize the Economic Times content and recommendations you receive. The more complete your profile, the better the AI can tailor insights from ET's vast financial database to match your specific needs. You can update your profile anytime to refine recommendations."

Now respond to the user's question following these guidelines.`;

export async function POST(request: Request) {
  try {
    const body: FinancialChatRequest = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      // Fallback to enhanced mock responses when API key is not configured
      return getEnhancedMockResponse(message);
    }

    try {
      // Use Gemini AI for intelligent responses
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const fullPrompt = `${OBSIDIAN_FLUX_ASSISTANT_PROMPT}\n\nUser Question: "${message}"\n\nPlease provide a helpful, intelligent response following the guidelines above.`;
      
      const result = await model.generateContent(fullPrompt);
      const response = result.response.text();
      
      // Categorize the response
      const category = categorizeResponse(message, response);
      
      return NextResponse.json({
        response: response.trim(),
        category,
        timestamp: new Date().toISOString(),
      });
      
    } catch (aiError) {
      console.error('Gemini AI Error:', aiError);
      // Fallback to enhanced mock responses
      return getEnhancedMockResponse(message);
    }

  } catch (error) {
    console.error('Financial Chat API Error:', error);
    
    return NextResponse.json({
      response: "I'm experiencing technical difficulties right now. Please try again in a moment. For immediate help with Obsidian Flux features, you can explore the main navigation or check the recommendations panel.",
      category: 'guidance' as const,
      timestamp: new Date().toISOString(),
    });
  }
}

function getEnhancedMockResponse(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Enhanced responses for Obsidian Flux specific questions
  if (lowerMessage.includes('active hub')) {
    return NextResponse.json({
      response: "Active Hub is your central command center in Obsidian Flux where Economic Times data gets synthesized into actionable insights. It's where the platform's AI analyzes market trends, news, and your personal profile to deliver tailored recommendations. Think of it as the brain of the system that processes ET's vast financial ecosystem and presents it in an easy-to-use interface. You can access it through the main navigation to see real-time analysis and personalized suggestions.",
      category: 'guidance' as const,
      timestamp: new Date().toISOString(),
    });
  }
  
  if (lowerMessage.includes('profiling') || lowerMessage.includes('profile')) {
    return NextResponse.json({
      response: "Profiling is how Obsidian Flux learns about your investment preferences and goals. The system asks targeted questions about your risk tolerance, investment timeline, and interests. This data helps personalize the Economic Times content and recommendations you receive. The more complete your profile, the better the AI can tailor insights from ET's vast financial database to match your specific needs. You can update your profile anytime to refine recommendations.",
      category: 'guidance' as const,
      timestamp: new Date().toISOString(),
    });
  }
  
  if (lowerMessage.includes('recommendation') || lowerMessage.includes('et recommendations')) {
    return NextResponse.json({
      response: "ET Recommendations are personalized insights generated by Obsidian Flux using Economic Times' comprehensive financial data. The system analyzes market trends, company performance, and your personal profile to suggest relevant content, investment ideas, and market insights. These recommendations appear in the side panel and are continuously updated based on real-time ET data feeds and your evolving preferences.",
      category: 'guidance' as const,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Financial concept explanations
  if (lowerMessage.includes('p/e ratio')) {
    return NextResponse.json({
      response: "The P/E ratio (Price-to-Earnings ratio) compares a company's stock price to its earnings per share. Think of it like this: if a company earns $1 per share and the stock costs $20, the P/E ratio is 20. This means investors are willing to pay $20 for every $1 of earnings the company makes. In Obsidian Flux, you'll find P/E ratios in company analysis reports powered by Economic Times data, helping you assess if a stock is fairly valued compared to peers.",
      category: 'analysis' as const,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Default enhanced response
  return NextResponse.json({
    response: `I can help you understand financial concepts and navigate Obsidian Flux's features! 

For financial questions, I can explain terms like P/E ratios, dividends, market cap, and portfolio strategies in simple language.

For platform guidance, I can explain Active Hub, profiling, ET Recommendations, and how to use Economic Times data integration.

What specific aspect would you like to explore? Feel free to ask about any financial term or Obsidian Flux feature!`,
    category: 'guidance' as const,
    timestamp: new Date().toISOString(),
  });
}

function categorizeResponse(message: string, response: string): 'stocks' | 'trading' | 'investment' | 'analysis' | 'guidance' {
  const lowerMessage = message.toLowerCase();
  const lowerResponse = response.toLowerCase();
  
  // Platform guidance takes priority
  if (lowerMessage.includes('obsidian') || lowerMessage.includes('active hub') || 
      lowerMessage.includes('profiling') || lowerMessage.includes('recommendation') ||
      lowerMessage.includes('platform') || lowerMessage.includes('feature') ||
      lowerMessage.includes('navigate') || lowerMessage.includes('how to')) {
    return 'guidance';
  }
  
  // Financial categorization
  if (lowerMessage.includes('trade') || lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
    return 'trading';
  }
  if (lowerMessage.includes('invest') || lowerMessage.includes('portfolio') || lowerMessage.includes('dividend')) {
    return 'investment';
  }
  if (lowerMessage.includes('stock') || lowerMessage.includes('share') || lowerMessage.includes('equity')) {
    return 'stocks';
  }
  if (lowerMessage.includes('ratio') || lowerMessage.includes('analysis') || lowerMessage.includes('metric')) {
    return 'analysis';
  }
  
  return 'guidance';
}
