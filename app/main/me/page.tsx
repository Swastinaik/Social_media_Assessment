import { createClient } from "@/app/lib/supabase/server";
import EditProfile from "@/app/components/EditProfile";
import { getUserProfile } from "@/app/lib/action";
export default async function Me(){
    const supabase = await createClient();
    const {data: {user},error: userError} = await supabase.auth.getUser()
    if(!user || userError){
        console.error(userError)
        return;
    }
    const profileData = await getUserProfile()
    const {data: followerCount,error: followerCountError} = await supabase.from('follow').select('*', { count: 'exact', head: true }).eq('user_id',user.id)
    if(followerCountError){
        console.log(followerCountError)
        return;
    }
    const {data: followingCount, error: followingCountError} = await supabase.from('follow').select('*', { count: 'exact', head: true }).eq('follower_id',user.id)
    if(followingCountError){
        console.log(followingCountError)
        return;
    }
    return(
        <EditProfile
      initialProfile={profileData}
      initialFollowerCount={followerCount || 0}
      initialFollowingCount={followingCount || 0}
    />
    )
}