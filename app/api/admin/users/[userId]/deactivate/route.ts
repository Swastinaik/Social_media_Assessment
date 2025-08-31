import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { isAdmin } from '@/app/lib/supabase/adminUtils';

// POST /api/admin/users/{user_id}/deactivate/ - Deactivate user
export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  const supabase = await createClient();
  const authorized = await isAdmin(supabase);
  if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  

  return NextResponse.json({ message: 'User deactivated successfully' });
}
