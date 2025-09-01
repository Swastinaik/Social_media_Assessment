import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';


// DELETE /api/admin/posts/{post_id}/ - Delete post
export async function GET(request: NextRequest, params:{params:Promise<{post_id: string}>}) {
  const supabase = await createClient();
   const { post_id} = await params.params
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', post_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Post deleted successfully' });
}
