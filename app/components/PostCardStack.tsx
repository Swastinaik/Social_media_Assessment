'use client'
import { useState } from "react";
import PostCard from "./Post";
export default function PostCardStack({ posts }: { posts: Array<{ id: number; content: string; image_url?: string; like_count: number; comment_count: number }> }) {
    const [allPosts, setAllPosts] = useState(posts)
  return (
    <div className="flex flex-col space-y-6 gap-3 max-w-md mx-auto">
      {allPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
