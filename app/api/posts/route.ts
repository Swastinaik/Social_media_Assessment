import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest){
    const supabase = await createClient()
    const formData = await request.formData()
    const {data:{user}, error: authError} = await supabase.auth.getUser()
    if(!user || authError){
        return NextResponse.json({error: "Unauthorized"})
    }
    const content = formData.get('content')
    const image = formData?.get('image') as File | null
    const category = formData?.get('category') as string | null
    if(image){
        const image_path = `post-images/${user.id}/${uuidv4()}.${image.name.split('.').pop()?.toLowerCase()}`
        const {data: imageData, error:imageError} = await supabase.storage.from('post_images').upload(image_path, image, {
          cacheControl: '3600',
          upsert: false
        })
        if(imageError){
            return NextResponse.json({error: "Error uploading the post image",errorMessage: imageError})
        }
        const {data, error: postError} = await supabase.from('posts').insert({content: content, image_url: imageData.path, category: category, author: user.id }).select()
        if(postError){
            return NextResponse.json({error: "falied to create post"})
        }
        return NextResponse.json({message: "Successfully created the posts",data: data})
    }
    const { data, error: postError} = await supabase.from('posts').insert({content: content, category: category}).select()
    if(postError){
        return NextResponse.json({error: "falied to create post"})
    }
    return NextResponse.json({message: "Successfully created the posts",data: data})
}


export async function GET(request: NextRequest){
    const supabase = await createClient()
    const {data:{user}, error: authError} = await supabase.auth.getUser()
    if(!user || authError){
        return NextResponse.json({error: "Unauthorized"})
    }
    const { data: posts, error: postError } = await supabase.from('posts').select().eq('author',user.id)
    if(postError){
        return NextResponse.json({error: "No post found"})
    }
    return NextResponse.json({data: posts, message: "Successfully retrieved all posts"})
}



