"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, ResetPasswordFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  // No token - show error state
  if (!token) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-destructive">Invalid link</h2>
        <p className="text-muted-foreground">
          This password reset link is invalid or has already been used.
        </p>
        <div className="flex flex-col gap-2">
          <a href="/forgot-password" className="text-primary hover:underline">
            Request a new link
          </a>
          <a href="/login" className="text-muted-foreground hover:underline text-sm">
            Back to login
          </a>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    const { error } = await authClient.resetPassword({
      newPassword: data.newPassword,
      token,
    });

    if (error) {
      // Token expired or invalid
      if (error.code === "INVALID_TOKEN" || error.code === "TOKEN_EXPIRED") {
        form.setError("root", {
          message: "This link has expired. Please request a new one.",
        });
      } else {
        form.setError("root", {
          message: error.message || "Failed to reset password",
        });
      }
      return;
    }

    // Success - redirect to login with message
    router.push("/login?reset=success");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {form.formState.errors.root.message}
            {form.formState.errors.root.message?.includes("expired") && (
              <a
                href="/forgot-password"
                className="block mt-2 text-primary hover:underline"
              >
                Request a new link
              </a>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Resetting...
            </>
          ) : (
            "Set new password"
          )}
        </Button>
      </form>
    </Form>
  );
}
