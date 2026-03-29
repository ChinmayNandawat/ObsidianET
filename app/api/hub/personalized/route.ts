import { NextResponse } from 'next/server';
import { getOrCreateSession } from '../../../../lib/server/session-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = getOrCreateSession(searchParams.get('sessionId') || undefined);
    
    return NextResponse.json({
      isPersonalized: session.profilingComplete,
      profileSummary: session.profilingComplete ? {
        name: session.profile.name,
        persona: session.profile.persona,
        riskTolerance: session.profile.riskTolerance,
        primaryGoal: session.profile.primaryGoal,
        investmentHorizon: session.profile.investmentHorizon,
        completionPercentage: session.profile.profileCompletion,
      } : undefined,
      journeyPath: session.profilingComplete ? [
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
      ] : undefined,
      nextBestAction: session.profilingComplete ? {
        action: 'Explore your personalized ET recommendations',
        urgency: 'medium' as const
      } : null,
      missedOpportunities: session.profilingComplete ? [
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
      ] : []
    });
  } catch (error) {
    console.error('Hub Personalized Error:', error);
    return NextResponse.json({
      isPersonalized: false,
      profileSummary: undefined,
      journeyPath: undefined,
      nextBestAction: null,
      missedOpportunities: []
    });
  }
}
