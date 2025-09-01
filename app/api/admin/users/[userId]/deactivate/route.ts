import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { isAdmin } from '@/app/lib/supabase/adminUtils';

// POST /api/admin/users/{user_id}/deactivate/ - Deactivate user
export async function POST(request: NextRequest, params: { params: Promise<{ userId: string }> }) {
  const supabase = await createClient();

  const { userId } = await params.params;

  


  return NextResponse.json({ message: 'User deactivated successfully' });
}
