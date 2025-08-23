
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
export async function POST(request: NextRequest){
    const formData = await  request.formData()
    const supabase = await createClient()
    const email = formData.get('email')
    const password = formData.get('password')
    if(typeof email !== "string" || typeof password !== "string"){
        return NextResponse.json({error:"Invalid field type"})
    }
    if(!email || !password){
        return NextResponse.json({error:"Missing field values"})
    }
    const { data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    
    if (error?.code === 'email_not_confirmed') {
      // Suggest resending confirmation
      return NextResponse.json({
        error: 'Email not confirmed. Resend confirmation?',
        resend: true // Flag for frontend to show resend button
      }, { status: 400 });
    }
    return NextResponse.json({data: data, message: "Successfull signin"})
}