import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic API functionality
    return NextResponse.json({ 
      success: true, 
      message: 'Financial Chat API is working correctly',
      timestamp: new Date().toISOString(),
      debug: {
        environment: process.env.NODE_ENV,
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        nodeVersion: process.version
      }
    });
  } catch (error) {
    console.error('Debug API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
