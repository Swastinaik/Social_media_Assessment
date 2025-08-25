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
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
            onClick={handleOverlayClick}
        >
        {isLoading ? <h2>Loading...</h2>: (
           <div className='flex flex-1 h-[500px] w-[1000px] justify-center items-center gap-2 bg-slate-50'>
            <div className='flex flex-col w-[50%] h-full'>
                {post?.image_url ? (
                    <img
                        src={post?.image_url}
                        className='h-full w-full  mb-2'
                        alt='Profile Image'
                    />
                ): <p>No Profile Image</p>}
                <div className='flex gap-3'>
                    <div className='flex gap-1 justify-items-start'>
                    <Heart
                        className={`cursor-pointer ${isLiked ? 'text-red-500': ''}`}
                        onClick={()=> setIsLiked(!isLiked)}
                    />
                    <p className='font-bold'>{post?.like_count}</p>
                    </div>
                    <div className='flex gap-1 justify-items-start'>
                    <MessageCircle/>
                    <p className='font-bold'>{post?.comment_count}</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center justify-between min
            
            -h-full pt-1'>
                <h3 className='font-bold text-xl'>Comments:</h3>
                <div className='flex flex-col gap-1 overflow-auto'>
                {comments.length > 0 && comments.map((comment)=>{
                    return <div className='flex flex-col border-b border-gray-500 w-full' key={comment.id}>
                        <p>{comment?.author ?? "User"}</p>
                        <p>{comment?.content}</p>
                        <p>{comment?.created_at}</p>
                    </div>
                })}
                </div>
                <div className='flex items-center justify-around gap-1 mt-1 w-full p-1'>
                <input
                    type='text'
                    onChange={(e)=>setNewComment(e.target.value)}
                    value={newComment}
                    placeholder='Add the comment'
                    className='w-full h-12 p-1 items-center justify-center border-gray-400'
                />
                <button className='bg-black text-white rounded-[2px] p-1' onClick={handleAddComment}>
                    Add
                </button>
            </div>
            </div>
            
           </div>
           )}
        </div>
    );
}
