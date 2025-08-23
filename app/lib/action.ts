"use server" 
import { createClient } from "./supabase/server"
export async function likePost({post, newLiked}: {post:any, newLiked:boolean}) {
        try {
            const supabase = await createClient()
            const user = await getCurrentUser()
            if(!newLiked) {
                const { error } = await supabase.from('likes').delete().match({ post_id: post.id, user_id: user?.id })
                await supabase.from('posts').update({ like_count: post.like_count > 0 ? post.like_count - 1 : 0 }).eq('id', post.id)
                if(error) throw error
            } else {
                const { error } = await supabase.from('likes').insert({ post_id: post.id, user_id: user?.id })
                await supabase.from('posts').update({ like_count: post.like_count + 1 }).eq('id', post.id)
                if(error) throw error
            }
        } catch (error) {
            console.log(error)
        }
}

export async function getCurrentUser(){
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()
    return user
}

export async function getUserProfile(){
    const user = await getCurrentUser()
    const supabase = await createClient()
    const {data: profile} = await supabase.from('profiles').select().eq('id', user?.id).single()
    if(!profile?.image_url) return profile
    const { data: urlData } = supabase.storage.from("avatar_images").getPublicUrl(profile?.image_url)
    profile.image_url = urlData.publicUrl
    return profile
}

export async function getPostDetail({post_id}:{post_id:string}){
    const user = await getCurrentUser()
    const supabase = await createClient()
    const {data: post} = await supabase.from('posts').select().eq('id', post_id).single()
    const {data: likeData} = await supabase.from('likes').select().eq('post_id',post_id).eq('user_id', user?.id)
    const { data: urlData } = supabase.storage
            .from("post_images") // Replace with your actual bucket name (e.g., 'images')
            .getPublicUrl(post?.image_url); // Pass the stored path (e.g., 'folder/image.png')
    post.image_url = urlData.publicUrl

    return { post, likeData }
}


export async function checkLikeStatus({post_id}:{post_id: string}){
    const user = await getCurrentUser()
    const supabase = await createClient()
    const {data: likeData, error: likeDataError} = await supabase.from('likes').select().eq('post_id',post_id).eq('user_id', user?.id)
    if(likeDataError){
        throw new Error("Error while fetching the like status")
    }
    return likeData.length > 0
}


export async function getCommentsOfPost({post_id}:{post_id: string}){
    const supabase = await createClient()
    const {data: comments, error} = await supabase.from('comment').select().eq('post', post_id)
    if(error) throw error
    return comments
}

export async function addCommentToPost({post_id, content, author}:{post_id: string, content: string, author: any}){
    const supabase = await createClient()
    const user = await getCurrentUser()
    const {data, error} = await supabase.from('comment').insert({post:post_id, author: user?.id, content:content})
    if(error) throw error
    // Fetch current comment_count
    const { data: postData } = await supabase.from('posts').select('comment_count').eq('id', post_id).single()
    const currentCount = postData?.comment_count || 0
    const {data:updateCommentCount} = await supabase.from('posts').update({comment_count: currentCount + 1}).eq('id', post_id)
    return updateCommentCount
}
/*
export async function likePost({post, isLiked}: {post:any, isLiked:boolean}) {

    try{
        const supabase = await createClient()
        const {data: {session}} = await supabase.auth.getSession()
        const response = await fetch(`/api/posts/${post.id}/like`, {
            method: isLiked ? 'DELETE' : 'POST',
            headers: {
                'Authorization': `Bearer ${session?.access_token}`
            },
        })
        if(!response.ok){
            throw new Error("Failed to like/unlike the post")
        }
    }catch(error){
        console.log(error)
    }
}

*/