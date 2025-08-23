"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    firstname: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    lastname: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
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
            username: "",
            firstname: "",
            lastname: "",
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
            const response = await fetch('api/auth/register', {
                method: 'POST',
                body: formData
            })
            if (!response.ok) {
                throw new Error("Register fail")
            }
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


            router.push('/login')
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

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-89 h-auto space-y-4 p-5 bg-white rounded-2xl ">

                <h3 className="font-bold text-xl">Register</h3>
                <div className="flex md:flex-row flex-col  space-y-2  md:space-y-0 md:space-x-2">
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="first name" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="alexCool" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
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