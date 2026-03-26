import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../../lib/server/supabase';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const { messages, profile, recommendations, 
            profilingComplete, answeredQuestions } = await req.json();

    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { error } = await supabase
      .from('user_sessions')
      .upsert({
        user_id: payload.userId,
        messages: messages || [],
        profile: profile || {},
        recommendations: recommendations || [],
        profiling_complete: profilingComplete || false,
        answered_questions: answeredQuestions || 0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Save session error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    await supabase
      .from('user_profiles')
      .update({ last_active: new Date().toISOString() })
      .eq('id', payload.userId);

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('Save session error:', err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
