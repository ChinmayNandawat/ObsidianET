import { NextResponse } from 'next/server';
import { getOrCreateSession, saveSession, getSession } from '../../../lib/server/session-store';
import { getSupabaseServerClient } from '../../../lib/server/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId') || undefined;
  
  let session = sessionId ? getSession(sessionId) : undefined;

  const supabase = getSupabaseServerClient();
  
  // Try to hydrate from DB if not in memory
  if (!session && sessionId && supabase) {
    try {
      const { data } = await supabase.from('sessions').select('payload').eq('id', sessionId).single();
      if (data && data.payload) {
        session = data.payload;
        saveSession(session!); // Restore to memory
      }
    } catch (e) {
      console.warn("Supabase load failed:", e);
    }
  }

  // Fallback to creating a new one
  if (!session) {
    session = getOrCreateSession(sessionId);
    if (supabase) {
      try {
        await supabase.from('sessions').upsert({ id: session.sessionId, payload: session });
      } catch (e) {
        console.warn("Supabase save failed:", e);
      }
    }
  }

  return NextResponse.json(saveSession(session));
}
