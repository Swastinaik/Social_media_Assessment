"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  content: z.string().min(1, "Content is required"),
  image: z.custom<File>().optional(),
  category: z.enum(["general", "announcement", "question"]),
});

export default function CreatePost() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      image: undefined,
      category: "general",
    },
  });

  // Show image preview while selecting
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("content", values.content);
    formData.append("category", values.category);
    if (values.image) formData.append("image", values.image);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create post");
      toast.success("Post created successfully!");
      form.reset();  // Reset form after success
      setImagePreview(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="flex flex-col p-6 min-w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10"
        >
          <h3 className="font-bold text-xl mb-4">Create Post</h3>
          
          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's on your mind?"
                    {...field}
                    className="resize-none min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="rounded-md max-h-48 object-contain"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Radio */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6"
                  >
                    <FormItem>
                      <RadioGroupItem value="general" id="general" />
                      <FormLabel htmlFor="general" className="ml-2">General</FormLabel>
                    </FormItem>
                    <FormItem>
                      <RadioGroupItem value="announcement" id="announcement" />
                      <FormLabel htmlFor="announcement" className="ml-2">Announcement</FormLabel>
                    </FormItem>
                    <FormItem>
                      <RadioGroupItem value="question" id="question" />
                      <FormLabel htmlFor="question" className="ml-2">Question</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="flex md:justify-start justify-center">
          <Button type="submit" className="flex justify-center items-center self:start bg-black text-white min-w-69  h-12 text-lg">
            Submit
          </Button>
          </div>
        </form>
      </Form>
      <ToastContainer />
    </div>
  );
}
