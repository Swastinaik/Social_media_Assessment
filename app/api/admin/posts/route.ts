import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { isAdmin } from '@/app/lib/supabase/adminUtils';

// GET /api/admin/posts/ - List all posts
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const authorized = await isAdmin(supabase);
  if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
