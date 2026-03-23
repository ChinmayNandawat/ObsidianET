import { NextResponse } from 'next/server';
import { getOrCreateSession, saveSession } from '../../../lib/server/session-store';
import { personalizeSession } from '../../../lib/server/personalization';
import { getSupabaseServerClient } from '../../../lib/server/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const session = getOrCreateSession(body.sessionId);
  const updatedSession = await personalizeSession(session, body.message);
  saveSession(updatedSession);

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      await supabase.from('sessions').upsert({ id: updatedSession.sessionId, payload: updatedSession });
    } catch (e) {
      console.warn("Supabase save failed, probably table missing:", e);
    }
  }

  return NextResponse.json(updatedSession);
}
