"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  bio: z.string().optional(),
  image: z.custom<File>().optional(),
  username: z.string().optional(),
  location: z.string().optional()
});
interface MeClientProps  {
  initialProfile: any;
  setEditing: (arg0: boolean)=> void;
};

type ProfileFormValues = z.infer<typeof formSchema>;
export default  function EditProfile({initialProfile, setEditing}: MeClientProps){
  const router = useRouter()
  const [profile, setProfile] = useState(initialProfile);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialProfile,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    form.setValue("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
        const formData = new FormData()
        Object.entries(values).forEach(([key, value])=>{
            formData.set(key, value)
        })
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        body: formData,
        credentials:"include"
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      router.refresh()
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.log(error)
      toast.error('Error updating profile');
    }
    finally{
      setEditing(false)
    }
    }
    return (
    
        <div className="m-w-full p-3">
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about yourself" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={handleImageChange} />
                    </FormControl>
                    {imagePreview && (
                      <div className="mt-2">
                        <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-full" />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Your city or country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button type="submit" className="bg-green-500 text-white">
                  Save Changes
                </Button>
               
              </div>
            </form>
          </Form>
          </div>
        )}
    
