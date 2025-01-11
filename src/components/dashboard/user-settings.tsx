"use client"

import { useState } from "react"
import Image from "next/image"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  image: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// interface UserProfileProps {
//   user: Pick<User, "id" | "name" | "email" | "image">
// }
interface UserProfileProps {
  children: React.ReactNode;
  user: User;
  onSuccess?: (user: User) => void;
}

export function UserSettings({ user }: UserProfileProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
    },
  })

//   async function onSubmit(data: ProfileFormValues) {
//     setIsLoading(true)

//     try {
//       const response = await fetch(`/api/users/${user.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       })

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error);
//       }

//       toast.success("Profile updated successfully")
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Something went wrong")
//     } finally {
//       setIsLoading(false)
//     }
    //   }
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
      }
      toast.success("User updated successfully"); 
    }catch (error) {
          toast.error(
          error instanceof Error ? error.message : "Something went wrong"
          );
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
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
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  )
}