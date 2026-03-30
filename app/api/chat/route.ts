import { NextResponse } from 'next/server';
import { getOrCreateSession, saveSession, getSession } from '../../../lib/server/session-store';
import { personalizeSession } from '../../../lib/server/personalization';
import { getSupabaseServerClient } from '../../../lib/server/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const sessionId = body.sessionId;
  
  let session = sessionId ? getSession(sessionId) : undefined;
  const supabase = getSupabaseServerClient();

  // Hydrate from DB if missing in memory
  if (!session && sessionId && supabase) {
    try {
      const { data } = await supabase.from('sessions').select('payload').eq('id', sessionId).single();
      if (data && data.payload) {
        session = data.payload;
        saveSession(session!);
      }
    } catch (e) {
      console.warn("Supabase check failed:", e);
    }
  }

  // Fallback
  if (!session) {
    session = getOrCreateSession(sessionId);
  }

  const updatedSession = await personalizeSession(session, body.message);
  saveSession(updatedSession);

  if (supabase) {
    try {
      await supabase.from('sessions').upsert({ id: updatedSession.sessionId, payload: updatedSession });
    } catch (e) {
      console.warn("Supabase save failed, probably table missing:", e);
    }
  }

  return NextResponse.json(updatedSession);
}
