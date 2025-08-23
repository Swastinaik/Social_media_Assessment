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
    const [user, setUser] = useState<string|any>('')
    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                setIsLoading(true);
                const {post, likeData} = await getPostDetail({ post_id: postId });
                const commentsData = await getCommentsOfPost({ post_id: postId });
                const user = await getCurrentUser()
                setUser(user?.id)
                setPost(post);
                setComments(commentsData || []);
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
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-4 relative max-h-[80vh] overflow-y-auto">
                {isLoading ? (
                    <p>Loading...</p>
                ) : post ? (
                    <>
                        {post.image_url && (
                            <img
                                src={post.image_url}
                                alt="Post image"
                                className="w-full h-64 object-cover rounded-t-lg"
                            />
                        )}
                        <div className="p-4">
                            <p className="text-gray-800 mb-3">{post.content}</p>
                            <div className="flex items-center space-x-4 text-gray-500 mb-4">
                                <span className='flex gap-1 justify-center items-center'>{isLiked ? (
                                    <Heart size={16} className="text-red-500" />
                                ) : (
                                    <Heart size={16} />
                                )} {post.like_count} </span>
                                <span>Comments: {post.comment_count}</span>
                            </div>

                            {/* Comments List */}
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Comments</h3>
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="border-b py-2">
                                            <p className="font-bold">{comment.user?.username || 'Anonymous'}</p>
                                            <p>{comment.content}</p>
                                            <span className="text-xs text-gray-400">
                                                {new Date(comment.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                            </div>

                            {/* Comment Input */}
                            <div className="flex items-center border-t pt-4">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
                                />
                                <button
                                    onClick={handleAddComment}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-r"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Post not found.</p>
                )}
            </div>
        </div>
    );
}
