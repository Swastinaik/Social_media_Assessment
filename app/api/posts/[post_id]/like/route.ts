import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, {params}:{params: {post_id: string}}){
    const supabase = await createClient()
    const { post_id } = params
    const {data:{user}, error: authError} = await supabase.auth.getUser()
    if(!user || authError){
        return NextResponse.json({error: "Unauthorized"})
    }
    const {data: like_countData, error: likeCountError} = await supabase.from('posts').select('like_count').eq('id',post_id)
    if(!like_countData || likeCountError){
        return NextResponse.json({error: "Error while fetching the like count the post"})
    }
    const {data: likeData, error: likeError} = await supabase.from('likes').insert({post_id: post_id, user_id: user.id})
    if(likeError){
        return NextResponse.json({error: "Error while creating the like"})
    }
    const updateLikeCount = like_countData[0].like_count + 1
    const {data: updateLike, error: updateLikeError} = await supabase.from('posts').update('like_count',updateLikeCount).eq('author',user.id)
    if(updateLikeError){
        return NextResponse.json({error: "failed to update like count in post"})
    }
    return NextResponse.json({data: likeData, message: "successfully liked the post"})
}

export async function DELETE(request: NextRequest, {params}:{params: {post_id: string}}){
    const supabase = await createClient()
    const { post_id } = params
    const {data:{user}, error: authError} = await supabase.auth.getUser()
    if(!user || authError){
        return NextResponse.json({error: "Unauthorized"})
    }
    const {data: like_countData, error: likeCountError} = await supabase.from('posts').select('like_count').eq('id',post_id)
    if(!like_countData || likeCountError){
        return NextResponse.json({error: "Error while fetching the like count the post"})
    }
    const {data: unLikeData, error: unLikeError} = await supabase.from('likes').delete().eq('post_id',post_id).eq('user_id',user.id)
    if(unLikeError){
        return NextResponse.json({error: "Error while creating the like"})
    }
    const updateLikeCount = like_countData[0].like_count  > 0 ? like_countData[0].like_count - 1: like_countData[0].like_count
    const {data: updateLike, error: updateLikeError} = await supabase.from('posts').update('like_count',updateLikeCount).eq('author',user.id)
    if(updateLikeError){
        return NextResponse.json({error: "failed to update like count in post"})
    }
    return NextResponse.json({data: unLikeData, message: "successfully unliked the post"})
}