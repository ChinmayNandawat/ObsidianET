import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSession } from '../../../lib/server/session-store';
import { HubState, HubItem } from '../../../types';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId');
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const session = getOrCreateSession(sessionId);
    
    // Use existing hub items from dummy data
    const personalizedItems = session.hubItems.map((item: HubItem) => ({
      ...item,
      relevanceScore: item.matchScore * 100,
      priorityLabel: item.matchScore >= 0.9 ? 'Best Match' : 
                     item.matchScore >= 0.8 ? 'Strong Match' : 'Explore Next',
      matchReason: `Based on your interest in ${item.tags.join(', ')}`
    }));

    // Build sectionScores
    const sectionScores = personalizedItems.map((item: any) => ({
      category: item.category || 'ALL',
      score: item.relevanceScore || 0,
    }));

    const isPersonalized = session.profilingComplete === true && session.profile != null;

    // Create additional data for complete hub experience
    const profileSummary = isPersonalized ? {
      name: session.profile.name,
      persona: session.profile.persona,
      riskTolerance: session.profile.riskTolerance,
      primaryGoal: session.profile.primaryGoal,
      investmentHorizon: session.profile.investmentHorizon,
      completionPercentage: session.profile.profileCompletion,
    } : undefined;

    const journeyPath = isPersonalized ? [
      {
        id: '1',
        title: 'Complete Profile Assessment',
        description: 'Answer all profiling questions to get personalized recommendations',
        status: 'completed' as const,
        category: 'onboarding'
      },
      {
        id: '2', 
        title: 'Review Personalized Content',
        description: 'Explore ET recommendations tailored to your profile',
        status: 'current' as const,
        category: 'discovery'
      },
      {
        id: '3',
        title: 'Track Progress',
        description: 'Monitor your financial journey and achievements',
        status: 'upcoming' as const,
        category: 'growth'
      }
    ] : undefined;

    const nextBestAction = isPersonalized ? {
      action: 'Explore your personalized ET recommendations',
      urgency: 'medium' as const
    } : undefined;

    const missedOpportunities = isPersonalized ? [
      {
        category: 'ET Prime',
        title: 'Institutional Flow Analysis',
        teaser: 'Discover where smart money is moving this week',
        unlockHint: 'Complete 3 more interactions to unlock'
      },
      {
        category: 'ET Markets',
        title: 'Pre-Market Movers',
        teaser: 'Get ahead of market opening with our analysis',
        unlockHint: 'Engage with 5 market articles to unlock'
      }
    ] : [];

    const payload: HubState = {
      items: personalizedItems,
      hubItems: personalizedItems,
      savedTrack: session.savedTrack || [],
      sectionScores,
      isPersonalized,
      profileSummary,
      journeyPath,
      nextBestAction,
      missedOpportunities,
    };

    return NextResponse.json(payload);
  } catch (e) {
    console.error('Hub route error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
