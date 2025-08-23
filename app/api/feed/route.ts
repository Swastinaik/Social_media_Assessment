import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const supabase = await createClient()
    const {data:{user}, error: authError} = await supabase.auth.getUser()
    if(!user || authError){
        return NextResponse.json({error: "Unauthorized"})
    }
    let query = supabase.from('posts')
    .select(`
      id,
      author,
      created_at,
      content,  // Add your post fields here
      like_count,
      image_url
    `)
    .or(`author.eq.${user.id}, author.in.(
      (select user_id from follow where follower_id = ${user.id})
    )`)
    .order('created_at', { ascending: false })
    .limit(10);

    const {data, error} = await query
    if(error){
        return NextResponse.json({error: "failed to query the data"})
    }
    return NextResponse.json({data: data, message: "Successfully fetched the feed"})
}
