"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "email-verification",
      });
      sessionStorage.setItem("otp-verify-email", data.email);
      sessionStorage.setItem("otp-sent-ts", Date.now().toString());
      router.push("/verify-email");
    } catch {
      form.setError("root", {
        type: "manual",
        message: "Failed to send verification code. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div className="text-sm font-medium text-destructive text-center">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
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
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending code...
            </>
          ) : (
            "Continue with email"
          )}
        </Button>
      </form>
    </Form>
  );
}
