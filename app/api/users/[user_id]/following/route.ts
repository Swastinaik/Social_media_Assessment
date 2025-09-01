import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";


export async function GET(request: NextRequest, {params}:{params:Promise<{user_id: string}>}){
    const {user_id} = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: "User is not authenticated" })
    }
    const {data, error} = await supabase.from('follow').select("user_id").eq('follower_id',user_id)
    if (error) {
        return NextResponse.json({ error: "Error while get followings of the user" })
    }
    return NextResponse.json({ data: data, message: "Succesfully got all the followings" })
}