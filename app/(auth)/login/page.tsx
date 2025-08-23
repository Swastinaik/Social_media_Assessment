"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ToastContainer, toast } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { useRouter} from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const formSchema = z.object({

  email: z.email("Enter proper emial"),
  password: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function ProfileForm() {
    const router = useRouter()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
          const formData = new FormData()
          Object.entries(values).forEach(([key, value]) => {
              formData.set(key, value)
          })
          try {
              const response = await fetch('api/auth/login', {
                  method: 'POST',
                  body: formData
              })
              if (!response.ok) {
                  throw new Error("login fail")
              }
              const supabase =  createClient();
              const { data: { session } } = await supabase.auth.getSession();
              if(session){
                  toast.success('Signup successful! Please confirm your email.', {
                      position: 'top-right',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'colored', // Built-in theme for colored background
                      style: { background: '#22c55e', color: '#fff' }, // Custom green style for success
                  });
              }
  
              router.push('/main')
          } catch (error) {
              console.log(error)
              toast.error('Signup failed! Please try again.', {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: 'colored', // Built-in theme for colored background
                  style: { background: '#ef4444', color: '#fff' }, // Custom red style for error
              });
          };
  
      }
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-slate-50 shadow-2xl">
    <Form {...form}>
        
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col w-89 h-auto p-5  rounded-2xl space-y-4 bg-white">
        <h3 className="font-bold text-xl mb-6">Login</h3>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="alex123@gmail.com" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="*****" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    <ToastContainer />
    </div>
  )
}