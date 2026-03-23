import { NextResponse } from 'next/server';
import { getOrCreateSession, saveSession } from '../../../lib/server/session-store';
import { getSupabaseServerClient } from '../../../lib/server/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId') || undefined;
  const session = getOrCreateSession(sessionId);

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      await supabase.from('sessions').upsert({ id: session.sessionId, payload: session });
    } catch (e) {
      console.warn("Supabase save failed on init, probably table missing:", e);
    }
  }

  return NextResponse.json(saveSession(session));
}
