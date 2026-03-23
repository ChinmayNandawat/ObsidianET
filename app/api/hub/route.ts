import { NextResponse } from 'next/server';
import { getOrCreateSession } from '../../../lib/server/session-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = getOrCreateSession(searchParams.get('sessionId') || undefined);
  return NextResponse.json({ hubItems: session.hubItems, profile: session.profile });
}
