import { NextResponse } from 'next/server';
import { getOrCreateSession, saveSession } from '../../../lib/server/session-store';
import { personalizeSession } from '../../../lib/server/personalization';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = getOrCreateSession(body.sessionId);
    const updatedSession = await personalizeSession(session, body.message);
    saveSession(updatedSession);

    return NextResponse.json(updatedSession);
  } catch (err: any) {
    console.error('Chat route error:', err.message);
    console.error('Chat route stack:', err.stack);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
