import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { isAdmin } from '@/app/lib/supabase/adminUtils';

// GET /api/admin/stats/ - Basic stats (total users, posts, active today)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Calculate start of today in UTC
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [usersRes, postsRes] = await Promise.all([
    admin.listUsers(), // Total users
    supabase.from('posts').select('id', { count: 'exact', head: true }), // Total posts count
    // Assumes custom RPC
  ]);

  if (usersRes.error || postsRes.error ) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
  console.log(usersRes)
  return NextResponse.json({
    total_users: usersRes.data.users.length,
    total_posts: postsRes.count,
     // Adjust based on RPC response
  });
}
