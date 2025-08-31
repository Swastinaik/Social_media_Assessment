import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

// POST /api/auth/change-password/ - Authenticated user changes password
export async function POST(request: NextRequest) {
  try {
    const { new_password } = await request.json();
    if (!new_password) {
      return NextResponse.json({ error: 'New password is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    if (getUserError || !user) {
      return NextResponse.json({ error: 'Unauthorized - You must be logged in' }, { status: 401 });
    }

    // Update the password
    const { error } = await supabase.auth.updateUser({ password: new_password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
