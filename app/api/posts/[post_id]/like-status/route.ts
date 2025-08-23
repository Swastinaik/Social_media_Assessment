import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}:{params: {post_id: string}}){
    const supabase = await createClient()
    const { post_id } = params
    const {data:{user}, error: authError} = await supabase.auth.getUser()
    if(!user || authError){
        return NextResponse.json({error: "Unauthorized"})
    }
    const {data: likeData, error: likeDataError} = await supabase.from('likes').select().eq('post_id',post_id).eq('user_id', user.id)
    if(likeDataError){
        return NextResponse.json({error: "Error while fetching the like status"})
    }
    if(likeData.length > 0){
        return NextResponse.json({data: true, message: "like status true"})
    }
    return NextResponse.json({data: false, message: "like status false"})
}