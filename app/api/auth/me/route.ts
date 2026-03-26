import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../../lib/server/supabase';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    console.log('Auth me - payload:', payload);
    console.log('Auth me - userId:', payload?.userId);

    if (!payload?.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { data: user } = await supabase
      .from('user_profiles')
      .select('id, email, username')
      .eq('id', payload.userId as string)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const { data: session } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({ 
      user, 
      session: session ? {
        messages: session.messages || [],
        profile: session.profile || null,
        recommendations: session.recommendations || [],
        profilingComplete: session.profiling_complete || false,
        answeredQuestions: session.answered_questions || 0
      } : null
    });

  } catch (err: any) {
    console.error('Me error:', err.message);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
