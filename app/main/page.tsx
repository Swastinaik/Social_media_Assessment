import { createClient } from "../lib/supabase/server";
import PostCard from "../components/PostCard";
import { getPostDetail } from "../lib/action";
export default async function Feed(){
  const supabase = await createClient()
  const { data: posts } = await supabase.from('posts').select('id')
  return (
    <div>
      {await Promise.all(
        posts?.map(async post => {
          const { post: postData, likeData } = await getPostDetail({ post_id: post.id });
          return <PostCard post={postData} likeData={likeData} key={postData.id}/>;
        }) || []
      )}
    </div>
  )
}