import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

// POST /api/auth/password-reset-confirm/ - Confirm reset with tokens and new password
export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token, new_password } = await request.json();
    if (!access_token || !refresh_token || !new_password) {
      return NextResponse.json({ error: 'Access token, refresh token, and new password are required' }, { status: 400 });
    }

    const supabase = await createClient();
    // Set the session using both tokens
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (sessionError) {
      console.error('Session error:', sessionError); // Log for debugging
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Update the password
    const { error } = await supabase.auth.updateUser({ password: new_password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Request error:', err); // Log for debugging
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
