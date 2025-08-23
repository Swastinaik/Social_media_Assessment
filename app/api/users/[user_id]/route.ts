import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function GET(request: NextRequest,{params}:{params: {user_id: string}}){
    const {user_id} = params
    const supabase = await createClient()
    const {data, error} = await supabase.from('profiles').select().eq('id',user_id)
    if(error){
        return NextResponse.json({error: "No data found for this user"})
    }
    return NextResponse.json({data: data})
}