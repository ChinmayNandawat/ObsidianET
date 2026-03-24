import { NextResponse } from 'next/server';
import { registerUser } from '../../../../../lib/server/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    // Validate inputs
    if (!email || !password || !username) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }

    // Basic validation
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const result = await registerUser(email, password, username);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Registration successful',
        userId: result.userId
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Register error full:', JSON.stringify(error, null, 2));
    console.error('Register error message:', error.message);
    console.error('Register error stack:', error.stack);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Registration failed',
      detail: error.toString()
    }, { status: 500 });
  }
}
