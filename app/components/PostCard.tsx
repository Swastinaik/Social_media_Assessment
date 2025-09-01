"use client"
import { useState } from 'react';
import { Heart, MessageCircle } from "lucide-react";
import { likePost } from '../lib/action';
import { toast } from 'react-toastify';
import PostCardDetail from './PostCardDetail';

const PostCard = ({ post, likeData }: { post: any, likeData: any }) => {
  const isLikeData = likeData.length > 0 ? true : false
  const [likeCount, setLikeCount] = useState(post?.like_count)
  const [isLiked, setIsLiked] = useState<boolean>(isLikeData)
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const handleLike = async () => {
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setLikeCount((prev: number) => (newLikeStatus ? prev + 1 : prev - 1));

    try {
      await likePost({ post, newLiked: newLikeStatus });

    } catch (error) {

      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      console.log('Like action failed:', error);
      toast.error('Failed to update like status. Please try again.');
    }
  };

  return (
    <>
      {isDetailOpen ? (
        <PostCardDetail postId={post.id} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)}  />
      ) : (
        <div
          key={post.id}
          className="border border-gray-300 w-[300px] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {post?.image_url && (
            <div onClick={() => setIsDetailOpen(true)} className='cursor-pointer'>
              <img
                src={post?.image_url}
                alt="Post image"
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <p className="text-gray-800 mb-3">{post?.content}</p>
            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center space-x-1" onClick={handleLike} style={{ cursor: 'pointer' }}>
                {isLiked ? (
                  <Heart size={16} className="text-red-500" />
                ) : (
                  <Heart size={16} />
                )}
                <span>{likeCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={16} />
                <span>{post?.comment_count}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PostCard