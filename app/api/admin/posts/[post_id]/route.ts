import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { isAdmin } from '@/app/lib/supabase/adminUtils';

// DELETE /api/admin/posts/{post_id}/ - Delete post
export async function DELETE(request: NextRequest, { params }: { params: { post_id: string } }) {
  const supabase = await createClient();
 

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', params.post_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Post deleted successfully' });
}
