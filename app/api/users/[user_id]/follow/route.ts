import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function POST(request: NextRequest, {params}:{params:Promise<{user_id: string}>}){
    const {user_id: follow_id} = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: "User is not authenticated" })
    }
    const {data, error} = await supabase.from('follow').insert({user_id:user.id, follower_id: follow_id})
    if (error) {
        return NextResponse.json({ error: "Error while following a user" })
    }
    return NextResponse.json({ data: data, message: "Succesfully followed user" })
}

export async function DELETE(request: NextRequest, {params}:{params:Promise<{user_id: string}>}){
    const {user_id: follow_id} = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: "User is not authenticated" })
    }
    const {data, error} = await supabase.from('follow').delete().eq('user_id',follow_id).eq('follower_id',user.id)
    if (error) {
        return NextResponse.json({ error: "Error while unfollowong a user" })
    }
    return NextResponse.json({ data: data, message: "Succesfully unfollowed user" })
}