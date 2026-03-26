import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSession, saveSession } from '@/lib/server/session-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, itemId, action } = body as { sessionId?: string; itemId?: string; action?: 'save' | 'remove' };

    if (!sessionId || !itemId || !action) {
      return NextResponse.json({ error: 'sessionId, itemId, and action are required' }, { status: 400 });
    }

    const session = getOrCreateSession(sessionId);
    session.savedTrack = session.savedTrack ?? [];

    if (action === 'save') {
      if (!session.savedTrack.includes(itemId)) session.savedTrack.push(itemId);
    } else if (action === 'remove') {
      session.savedTrack = session.savedTrack.filter((id) => id !== itemId);
    }

    saveSession(session);

    return NextResponse.json({ savedTrack: session.savedTrack });
  } catch (e) {
    console.error('Track POST error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId') || undefined;
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const session = getOrCreateSession(sessionId);
    return NextResponse.json({ savedTrack: session.savedTrack ?? [] });
  } catch (e) {
    console.error('Track GET error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
