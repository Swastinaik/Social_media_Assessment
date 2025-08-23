import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function POST(request: NextRequest){
    const supabase = await createClient()
    const formData = await request.formData()
    const firstName = formData?.get('first_name')
    const lastName = formData?.get('last_name')
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    if(typeof username !== "string" || typeof email !== "string" || typeof password !== "string"){
        return NextResponse.json({error:"Invalid input fields"})
    }
    if(!username || !email || !password){
        return NextResponse.json({error: "Missing Input fields"})
    }
    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password,
        options:{
            data:{
                first_name: firstName,
                last_name: lastName,
                username: username
            }
        }})
    if(error){
        return NextResponse.json({error:'Error while storing data to the database'})
    }

    return NextResponse.json({data: "Signup successfull"})
}
