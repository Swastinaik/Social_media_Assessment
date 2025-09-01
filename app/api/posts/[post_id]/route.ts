import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid'

export async function GET(request: NextRequest, {params}:{params: Promise<{post_id: string}>}){
    const supabase = await createClient()
    const { post_id } = await params
    const {data: postData, error: postError} = await supabase.from('posts').select().eq('id',post_id)
    if(!postData || postError){
        return NextResponse.json({error: "Error while fetching the post"})
    }
    return NextResponse.json({data: postData, message: "Successfully fetched the post."})
}

export async function PUT(request: NextRequest, {params}:{params: Promise<{post_id: string}>}){
    const supabase = await createClient()
    const {post_id} = await params
    const formData = await request.formData()
    const {data: {user},error: userError} = await supabase.auth.getUser()
    if(!user || userError){
        return NextResponse.json({error: "Unauthorize"})
    }
    const content = formData?.get('content')
    const image = formData?.get('image') as File | null
    const category = formData?.get('category')
    if(image){
        const {data: postUrl, error: postError} = await supabase.from('posts').select("image_url").eq("id", post_id).eq("author", user.id)
        if(postError){
            return NextResponse.json({error: "failed to fetch the post"})
        }
        await supabase.storage.from('post_images').remove([`${postUrl}`])
        const image_path = `post-images/${user.id}/${uuidv4()}.${image.name.split('.').pop()}`
        const {data: imageData, error:imageError} = await supabase.storage.from('post_images').upload(image_path, image)
        if(imageError){
            return NextResponse.json({error: "Error uploading the post image"})
        }
        const {data, error: postInsertError} = await supabase.from('posts').update({image_url: imageData.path}).eq('id',post_id).eq("author", user.id)
        if(postInsertError){
            return NextResponse.json({error: "falied to create post"})
        }
        return NextResponse.json({message: "Successfully created the posts"})
    }
    const { data, error: postError} = await supabase.from('posts').update({content: content, category: category, author: user.id}).eq('id',post_id).eq("author", user.id)
    if(postError){
        return NextResponse.json({error: "falied to create post"})
    }
    return NextResponse.json({message: "Successfully updated the post", data: data})
}


export async function DELETE(request: NextRequest, {params}:{params: {post_id: string}}){
    const {post_id} = params
    const supabase = await createClient()
    const {data:{user}, error: authError} = await supabase.auth.getUser()
    if(!user || authError){
        return NextResponse.json({error: "Unauthorized"})
    }
    const {data: postUrl, error: postError} = await supabase.from('posts').select("image_url").eq("id", post_id)
     if(postError){
            return NextResponse.json({error: "failed to fetch the post to delete"})
    }
    await supabase.storage.from('post_images').remove([`${postUrl}`])
    const respone = await supabase.from('posts').delete().eq("id", post_id)
    if(respone.status != 204){
        return NextResponse.json({error: "falied to delete post"})
    }
    return NextResponse.json({message: "Successfully deleted the post"})

}