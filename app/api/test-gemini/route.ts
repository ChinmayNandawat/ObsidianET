import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    
    const result = await model.generateContent('Hello! Can you explain what a P/E ratio is in simple terms?');
    const response = result.response.text();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Gemini API is working!',
      sampleResponse: response 
    });
  } catch (error) {
    console.error('Gemini API Test Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
