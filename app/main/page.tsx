import { createClient } from "../lib/supabase/server";
import PostCard from "../components/PostCard";
import { getPostDetail } from "../lib/action";
export default async function Feed(){
  const supabase = await createClient()
  const { data: posts } = await supabase.from('posts').select('id')
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-6">Feed</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts?.map(async post => {
          const { post: postData, likeData } = await getPostDetail({ post_id: post.id });
          return <PostCard post={postData} likeData={likeData} key={postData.id}/>;
        })}
      </div>
    </div>
  )
}