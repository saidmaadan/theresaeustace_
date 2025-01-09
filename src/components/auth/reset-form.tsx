"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ResetSchema } from "@/schemas";
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

export const ResetForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [success, setSuccess] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: any) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const data = await response.json();
          form.setError("root", {
            message: data.error || "Something went wrong",
          });
          return;
        }

        setSuccess(true);
      } catch (error) {
        form.setError("root", {
          message: "Something went wrong",
        });
      }
    });
  };

  return (
    <AuthCard
      header={
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to reset your password
          </p>
        </div>
      }
      footer={
        <div className="text-center text-sm">
          <Link
            href="/login"
            className="underline hover:text-primary"
          >
            Back to login
          </Link>
        </div>
      }
    >
      {success ? (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Check your email for a reset link
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-sm text-red-500">
                {form.formState.errors.root.message}
              </div>
            )}
            <Button type="submit" disabled={isPending}>
              Send reset link
            </Button>
          </form>
        </Form>
      )}
    </AuthCard>
  );
};
