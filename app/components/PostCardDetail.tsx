'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle } from "lucide-react";

// Assume these are your server actions/helpers (import from your lib)
import { getPostDetail, getCommentsOfPost, addCommentToPost, getCurrentUser } from '@/app/lib/action';

interface PostCardDetailProps {
    postId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function PostCardDetail({ postId, isOpen, onClose }: PostCardDetailProps) {
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<string | any>('')
    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                setIsLoading(true);
                const { post, likeData } = await getPostDetail({ post_id: postId });
                const commentsData = await getCommentsOfPost({ post_id: postId });
                const user = await getCurrentUser()
                setUser(user?.id)
                setPost(post);
                console.log(commentsData)
                setComments(commentsData || []);
                console.log(commentsData)
                setIsLiked((likeData?.length ?? 0) > 0 ? true : false)
                setIsLoading(false);
            };
            fetchData();
        }
    }, [isOpen, postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const optimisticComment = {
            id: Date.now().toString(), // Temporary ID
            content: newComment,
            created_at: new Date().toISOString(),
            // Assume user data; adjust based on your schema
            user: { username: 'Current User' }, // Placeholder
        };

        // Optimistic update: Add to local state immediately
        setComments((prev) => [...prev, optimisticComment]);

        try {
            // Call server action to add comment
            await addCommentToPost({ post_id: postId, content: newComment, author: user });
        } catch (error) {
            // Rollback on error
            setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
            console.error('Failed to add comment:', error);
            // Optionally show error toast
        }
        setNewComment('')
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
       <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
  onClick={handleOverlayClick}
>
  {isLoading ? <h2 className="text-xl font-semibold text-white">Loading...</h2> : (
    <div className="flex flex-1 max-w-5xl w-full max-h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="flex flex-col w-1/2 h-full bg-gray-50">
        {post?.image_url ? (
          <img
            src={post?.image_url}
            className="h-full w-full object-cover"
            alt="Post Image"
          />
        ) : <p className="p-4 text-center text-gray-500">No Post Image</p>}
        <div className="flex gap-4 p-4 bg-white border-t">
          <div className="flex items-center gap-1">
            <Heart
              className={`cursor-pointer w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
              onClick={() => setIsLiked(!isLiked)}
            />
            <p className="font-bold text-gray-700">{post?.like_count}</p>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-6 h-6 text-gray-500" />
            <p className="font-bold text-gray-700">{post?.comment_count}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/2 min-h-full p-4 bg-white">
        <h3 className="font-bold text-xl text-gray-800 mb-4">Comments</h3>
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(80vh-200px)] pr-2">
          {comments.length > 0 ? comments.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                  {comment?.author?.[0] ?? 'U'} {/* Simple avatar placeholder */}
                </div>
                <p className="font-semibold text-gray-800">{comment?.author_username ?? "User"}</p>
              </div>
              <p className="text-gray-700">{comment?.content}</p>
              <p className="text-sm text-gray-500 mt-1">{comment?.created_at}</p>
            </div>
          )) : (
            <p className="text-center text-gray-500">No comments yet.</p>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4 p-2 bg-gray-50 rounded-lg border border-gray-300">
          <input
            type="text"
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
            placeholder="Add a comment..."
            className="flex-1 h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleAddComment}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )}
</div>

    );
}
