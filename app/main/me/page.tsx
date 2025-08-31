"use client"
import { useState, useEffect } from "react"
import Link from "next/link";
import EditProfile from "@/app/components/EditProfile";
interface profileData{
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    website?: string;
    bio?: string;
    avatar_url?:string;
    location?:string;
}
export default function Me(){
    const [profile, setProfile] = useState<profileData|null>(null);
    const [followers, setFollowers] = useState<number>(0)
    const [followings, setFollowings] = useState(0)
    const [editing, setEditing] = useState(false)
    const [error, setError] = useState()
    const controller = new AbortController()
    useEffect(() => {
        async function getProfileUser() {
            try {
                const response = await fetch('/api/users/me',{method: "GET", credentials:"include"})
                if(!response.ok){
                    throw new Error("Failed to get the user")
                }
                const data = await response.json()
                console.log(data)
                setProfile(data.data)
                const [followerRes, followingRes] = await Promise.all([
                    fetch(`/api/users/${data?.data?.id}/followers`,{method: "GET", credentials:"include"}),
                    fetch(`/api/users/${data?.data?.id}/following`,{method: "GET", credentials:"include"})
                ])
                const followers = await followerRes.json()
                console.log(followers)
                setFollowers(followers.data.length)
                
                if(!response.ok){
                    throw new Error("Failed to get the user")
                }
                const followings = await followingRes.json()
                console.log(followings.data)
                setFollowings(followings.data.length)
            } catch (error:any) {
                console.log(error)
                setError(error.message)
            }
        }
        getProfileUser()

        return ()=>{
            controller.abort()
        }
    },[])
    return(
            <div className="min-w-full p-3">
            {!editing ?(
            <div className="flex flex-col space-y-4">
                <h3 className="text-black font-bold text-2xl">Profile</h3>
                <div className="flex items-center justify-evenly mt-4">
                    <img
                        src={profile?.avatar_url}
                        className="h-16 w-16 rounded-[50%]"
                        alt="Avatar"
                        />
                    <div className="flex flex-col items-center justify-around space-x-2">
                        <p >Username :<span className="font-bold"> {profile?.username}</span></p>
                        <div className="flex space-x-6">
                        <p >Followers : <span className="font-bold">{followers}</span></p>
                        <p >Followings :<span className="font-bold"> {followings}</span></p>
                        </div>
                    </div>
                </div>   
                <div className="flex flex-col gap-2">
                    <p className="font-bold self-start">Bio:</p>
                    <div className="p-2 rounded-md bg-slate-100">
                        <p className="text-gray-700">{profile?.bio ?? "No Bio"}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold self-start">Website:</p>
                    <div className="p-2 rounded-md bg-slate-100">
                        <p className="text-gray-700">{profile?.website ?? 'Insert your website...'}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold self-start">Location:</p>
                    <div className="p-2 rounded-md bg-slate-100">
                        <p className="text-gray-700">{profile?.location ?? 'USA'}</p>
                    </div>
                </div>
                <div className="flex justify-between">      
                <button className="mt-4 flex self-start h-12 w-36 items-center justify-center bg-blue-500 text-white rounded-[6px] cursor-pointer" onClick={()=> setEditing(true)}>
                    Edit
                </button>
                <Link href="/change-password" className="mt-4 flex self-start h-12 w-36 items-center justify-center bg-blue-500 text-white rounded-[6px] cursor-pointer">Change Password</Link>
                </div>
            </div>
            ):<EditProfile initialProfile={profile} setEditing={setEditing}/>}
        </div>
            
    )
}