import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { isAdmin } from '@/app/lib/supabase/adminUtils';

// GET /api/admin/users/{user_id}/ - Get user details
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const supabase = await createClient();
  const authorized = await isAdmin(supabase);
  if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase.auth.admin.getUserById(params.userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
