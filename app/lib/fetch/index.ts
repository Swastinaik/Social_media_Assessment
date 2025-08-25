'use client'
import { createClient } from "../supabase/server";
import { useState } from "react";
async function useFetch({url, method, options}:{url: string, method: string, options?: RequestInit}) {
    const [error, setError] = useState<Error | null>(null);

    const supabase = await createClient()
    const {data: {session}, error: sessionError} = await supabase.auth.getSession()
    if(!session ||sessionError){
        setError(sessionError)
        return { data: null, error: sessionError }
    }
    const access_token = session.access_token

    const response = await fetch(url, {
        method,
        headers: {
            ...options?.headers,
            Authorization: `Bearer ${access_token}`
        },
        ...options
    })

    if (!response.ok) {
        setError(new Error("Error while fetching data"))
        return { data: null, error: new Error("Error while fetching data") }
    }
    const data = await response.json()
    return { data, error: null }
}


export default useFetch