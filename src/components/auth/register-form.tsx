"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import type * as z from "zod";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export const RegisterForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsPending(true);
      console.log("Submitting registration form...");
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      let data;
      const text = await response.text();
      console.log("Raw response:", text);

      try {
        data = text ? JSON.parse(text) : null;
        console.log("Parsed response:", data);
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Server returned an invalid response");
      }

      if (!data) {
        throw new Error("No response data received");
      }

      if (!response.ok) {
        const errorMessage = data.error || data.message || "Registration failed";
        console.error("Registration failed:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("Registration successful:", data);
      toast.success(data.message || "Registration successful! Please check your email to verify your account.");
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to register";
      toast.error(errorMessage);
      form.setError("root", { 
        message: errorMessage
      });
    } finally {
      setIsPending(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Something went wrong with Google login");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your information below to create your account
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      disabled={isPending}
                      autoComplete="name"
                    />
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
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                      disabled={isPending}
                      autoComplete="email"
                    />
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
                    <Input
                      {...field}
                      placeholder="••••••••"
                      type="password"
                      disabled={isPending}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          disabled={isGoogleLoading}
          onClick={loginWithGoogle}
        >
          {isGoogleLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <FcGoogle className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Login
        </Link>
      </div>
    </div>
  );
};
