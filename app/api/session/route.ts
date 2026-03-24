import { NextResponse } from 'next/server';
import { getOrCreateSession, saveSession } from '../../../lib/server/session-store';
import { supabase } from '../../../lib/server/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || undefined;
    const session = getOrCreateSession(sessionId);

    if (supabase) {
      try {
        await supabase.from('sessions').upsert({ id: session.sessionId, payload: session });
      } catch (e) {
        console.warn("Supabase save failed on init, probably table missing:", e);
      }
    }

    return NextResponse.json(saveSession(session));
  } catch (err: any) {
    console.error('Session route error:', err.message, err.stack);
    return NextResponse.json(
      { error: 'Internal server error', detail: err.message },
      { status: 500 }
    );
  }
}
