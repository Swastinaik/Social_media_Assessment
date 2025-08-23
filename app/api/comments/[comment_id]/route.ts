import { createClient } from "@/app/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, {params}:{params: {comment_id: string}}){
    const supabase = await createClient()
    const { comment_id } = params
    const {data:{user}, error: authError} = await supabase.auth.getUser()
    if(!user || authError){
        return NextResponse.json({error: "Unauthorized"})
    }
    const {data: deleteComment, error: deleteCommentError} = await supabase.from('comment').delete().eq('id', comment_id).eq('author',user.id)
    if(deleteCommentError){
        return NextResponse.json({error: "error while deleting the post or unauthorized"})
    }
    return NextResponse.json({message: "successfull deleted comment"})
}