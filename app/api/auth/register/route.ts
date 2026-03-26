import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../../lib/server/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { success: false, error: 'All fields required' }, 
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }

    // Check if email or username already exists
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email or username already taken' },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from('user_profiles')
      .insert({ 
        email: email as any, 
        username: username as any, 
        password_hash: password_hash as any 
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Account created. Please login.' 
    });

  } catch (err: any) {
    console.error('Register error:', err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
