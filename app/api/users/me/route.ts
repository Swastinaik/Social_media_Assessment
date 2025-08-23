import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { v4 as uuidv4 } from 'uuid';
import { console } from "inspector";
export async function PUT(request: NextRequest) {
    const supabase = await createClient()
    const formData = await request.formData()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: "User is not authenticated" })
    }
    const bio = formData?.get('bio') as string | null
    const website = formData?.get('website') as string | null
    const location = formData?.get('location') as string | null
    const new_avatar = formData?.get('new_avatar') as File | null
    if (new_avatar) {
        try {
            const { data: image_url, error: imageError } = await supabase.from('profiles').select('image_url').eq('id', user.id)
            if(image_url){
                await supabase.storage.from('avatar_images').remove([`${image_url}`])
            }
            const new_url = `avatar-images/${user.id}/${uuidv4()}.${new_avatar.name.split('.').pop()}`
            const { data: new_url_data, error: new_url_error } = await supabase.storage.from('avatar_images').upload(new_url, new_avatar)
            await supabase.from('profiles').update({ image_url: new_url_data?.path }).eq('id', user.id)
        } catch (e: any) {
            throw new Error(e.message)
        }
    }
    const { data, error } = await supabase.from('profiles').update({ bio: bio, website: website, location: location }).eq('id', user.id)
    if (error) {
        return NextResponse.json({ error: "Error while updating the data" })
    }
    return NextResponse.json({ data: data, message: "Succesfully updated" })
}


export async function GET(request: NextRequest){
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: "User is not authenticated" })
    }
    const {data: profileData, error: profileDataError} = await supabase.from('profiles').select("*").eq("id",user.id)
    if(profileDataError){
       return NextResponse.json({ error: "failed to fetch user" }) 
    }
    return NextResponse.json({ data: profileData, message: "Succesfull fetched user" })

}