"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ToastContainer, toast } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import Link from "next/link";

const formSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

export default function ProfileForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.set(key, value);
        });

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: formData
            });
            console.log(response)
            const result = await response.json();

            if (!response.ok) {
                if (result.resend) {
                    toast.info('Please confirm your email to log in.', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: 'colored',
                    });
                    // Optionally, prompt to resend confirmation email
                    return;
                }
                throw new Error(result.error || "Login failed");
            }

            // Trust backend success response, no immediate getSession
            toast.success('Login successful!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'colored',
                style: { background: '#22c55e', color: '#fff' },
            });
            router.push('/main');
        } catch (error: any) {
            toast.error(error.message || 'Login failed! Please try again.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'colored',
                style: { background: '#ef4444', color: '#fff' },
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Optional: Listen for auth state changes to handle session globally
    useEffect( () => {
        const supabase = createClient();
        const { data: { subscription } } =  supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                console.log('User signed in:', session?.user);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-slate-50 shadow-2xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-80 h-auto p-5 rounded-2xl space-y-4 bg-white">
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
                                    <Input type="password" placeholder="*****" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Submit"}
                    </Button>
                    <Link href="/register" className="text-blue-500">
                    Don't have an account? Register
                </Link>
                </form>
                
            </Form>
            <ToastContainer />
        </div>
    );
}