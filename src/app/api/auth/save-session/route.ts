import { NextResponse } from 'next/server';
import { verifyToken, saveUserSession } from '../../../../../lib/server/supabase';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const sessionData = await request.json();
    
    // Validate required fields
    if (!sessionData.messages || !sessionData.profile || !sessionData.recommendations === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required session data' },
        { status: 400 }
      );
    }

    const result = await saveUserSession(decoded.userId, {
      messages: sessionData.messages || [],
      profile: sessionData.profile || {},
      recommendations: sessionData.recommendations || [],
      profilingComplete: sessionData.profilingComplete || false,
      answeredQuestions: sessionData.answeredQuestions || 0
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save session' },
      { status: 500 }
    );
  }
}
