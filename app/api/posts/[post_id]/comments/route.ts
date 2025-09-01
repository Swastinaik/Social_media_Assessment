import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, {params}:{params: Promise<{post_id: string}>}){
    const supabase = await createClient()
    const { post_id } = await params
    const formData = await request.formData()
    const content = formData.get('content')
    if(!content){
        return NextResponse.json({error: "Missing content field"})
    }
    const {data:{user}, error: authError} = await supabase.auth.getUser()
    if(!user || authError){
        return NextResponse.json({error: "Unauthorized"})
    }
    const {data: postData, error: postError} = await supabase.from('posts').select().eq('id',post_id)
    if(!postData || postError){
        return NextResponse.json({error: "Error while fetching the post"})
    }
    const {data: commentData, error: commentError} = await supabase.from('comment').insert({content: content, author: user.id, post: post_id})
    if(commentError){
        return NextResponse.json({error: "failed to create comment"})   
    }
    return NextResponse.json({data:commentData, message: "succefully added comment"})
}



export async function GET(request: NextRequest, {params}:{params: Promise<{post_id: string}>}){
    const supabase = await createClient()
    const { post_id } = await params
    const {data: commentData, error: commentError} = await supabase.from('comment').select("*").eq("post",post_id)
    if(commentError){
        return NextResponse.json({error: "failed to get comments"})
    }
    return NextResponse.json({data: commentData, message: "Fetched comments succesfully"})
}