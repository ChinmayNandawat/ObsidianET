import { NextResponse } from 'next/server';
import { verifyToken, loadUserSession } from '../../../../../lib/server/supabase';

export async function GET(request: Request) {
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

    // Load user session
    const session = await loadUserSession(decoded.userId);

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        username: decoded.username
      },
      session
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
