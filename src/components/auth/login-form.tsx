"use client";

import * as React from "react";
import { useSearchParams,  useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
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
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import type * as z from "zod";

type LoginFormValues = z.infer<typeof LoginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const verified = searchParams.get("verified");
  const registered = searchParams.get("registered");

  React.useEffect(() => {
    if (verified) {
      toast.success("Email verified successfully! You can now log in.");
    }
    if (registered) {
      toast.success("Registration successful! Please check your email to verify your account.");
    }
  }, [verified, registered]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsPending(true);

      const result = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "EmailNotVerified") {
          toast.error("Please verify your email before logging in.");
        } else {
          toast.error(result.error || "Invalid credentials");
        }
        return;
      }

      toast.success("Successfully logged in!");
      
      // Get the user session to check role
      const session = await fetch("/api/auth/session").then(res => res.json());
      
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsPending(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signIn("google", { 
        callbackUrl,
        redirect: false 
      });
      
      if (result?.error) {
        toast.error(result.error || "Failed to login with Google");
        return;
      }

      toast.success("Successfully logged in with Google!");
      
      // Get the user session to check role
      const session = await fetch("/api/auth/session").then(res => res.json());
      
      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
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
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in to your account
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between flex-wrap">
              <Link href="/reset" className="text-sm underline underline-offset-4 hover:text-primary">Forgot password?</Link>
            
              <Button
                type="submit"
                className=""
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </div>
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
        Don&#39;t have an account?{" "}
        <Link
          href="/register"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};
