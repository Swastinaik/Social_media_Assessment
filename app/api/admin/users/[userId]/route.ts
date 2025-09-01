import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { isAdmin } from '@/app/lib/supabase/adminUtils';

// GET /api/admin/users/{user_id}/ - Get user details
export async function GET(request: NextRequest, params: {params: Promise<{userId: string}>}) {
  const supabase = await createClient();

  const { userId } = await params.params;

  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
