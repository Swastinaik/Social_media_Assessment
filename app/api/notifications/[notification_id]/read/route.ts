import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

// POST /api/notifications/{notification_id}/read/ - Mark single notification as read
export async function POST(request: NextRequest, { params }: { params: { notification_id: string } }) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', params.notification_id)
    .eq('recipient', user.id);  // RLS ensures ownership

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Notification marked as read' });
}
