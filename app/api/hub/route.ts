import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSession } from '@/lib/server/session-store';
import { buildJourneyPath, buildProfileSummary, getPersonalizedHubItems, getMissedOpportunities, getNextBestAction } from '@/lib/server/personalization';
import { HubState } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId');
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const session = getOrCreateSession(sessionId);
    const personalizedItems = getPersonalizedHubItems(session);
    const profileSummary = buildProfileSummary(session, personalizedItems.slice(0, 3));
    const journeyPath = buildJourneyPath(personalizedItems);

    // Build sectionScores (one per category)
    const sectionScores = personalizedItems.map((it) => ({
      category: it.category,
      score: it.relevanceScore ?? 0,
      priorityLabel: it.priorityLabel ?? (it.relevanceScore && it.relevanceScore >= 70 ? 'Best Match' : it.relevanceScore && it.relevanceScore >= 40 ? 'Strong Match' : 'Explore Next'),
      reason: it.matchReason ?? '',
    }));

    const missedOpportunities = getMissedOpportunities(session, personalizedItems);
    const nextBestAction = getNextBestAction(session, personalizedItems);

    const isPersonalized = session.profilingComplete === true && session.profile != null;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[hub] sessionId=${sessionId} items=${personalizedItems.length} personalized=${isPersonalized}`);
    }

    const payload = {
      hubItems: personalizedItems,
      ...(session.profile ? { profile: session.profile } : {}),
      ...(profileSummary ? { profileSummary } : {}),
      journeyPath,
      sectionScores,
      missedOpportunities,
      nextBestAction,
      savedTrack: session.savedTrack ?? [],
      isPersonalized,
    } satisfies HubState;

    return NextResponse.json(payload);
  } catch (e) {
    console.error('Hub route error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
