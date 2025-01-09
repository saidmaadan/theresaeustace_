"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { NewPasswordSchema } from "@/schemas";
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
import { AuthCard } from "./auth-card";
import { toast } from "sonner";

export const NewPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!token) {
      toast.error("Missing reset token");
      router.push("/reset");
    }
  }, [token, router]);

  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      token: token || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    if (!token) {
      toast.error("Missing reset token");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/new-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: values.password,
            token: values.token,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Something went wrong");
          return;
        }

        toast.success(data.message || "Password reset successfully!");
        router.push("/login?reset=true");
      } catch (error) {
        console.error("Password reset error:", error);
        toast.error("Something went wrong during password reset");
      }
    });
  };

  return (
    <AuthCard
      header={
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="••••••••"
                    type="password"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />
          {form.formState.errors.root && (
            <div className="text-sm text-red-500">
              {form.formState.errors.root.message}
            </div>
          )}
          <Button type="submit" disabled={isPending || !token}>
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
