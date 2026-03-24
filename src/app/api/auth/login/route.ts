import { NextResponse } from 'next/server';
import { loginUser } from '../../../../../lib/server/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    if (result.success) {
      return NextResponse.json({
        success: true,
        token: result.token,
        user: result.user
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Login error full:', JSON.stringify(error, null, 2));
    console.error('Login error message:', error.message);
    console.error('Login error stack:', error.stack);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Login failed',
      detail: error.toString()
    }, { status: 500 });
  }
}
