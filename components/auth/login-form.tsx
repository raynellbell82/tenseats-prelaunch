"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";

import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { signIn, authClient } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";
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

const PENDING_PROFILE_KEY = "pendingProfile";

export function LoginForm() {
  const router = useRouter();
  const createProfile = useMutation(api.users.createProfileForAuthUser);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    const isEmail = data.emailOrPhone.includes("@");

    if (!isEmail) {
      // Phone login not yet supported
      form.setError("emailOrPhone", {
        type: "manual",
        message: "Phone login coming soon. Please use your email address.",
      });
      return;
    }

    try {
      const result = await signIn.email({
        email: data.emailOrPhone,
        password: data.password,
      });

      if (result.error) {
        const errorCode = result.error.code?.toLowerCase() || "";
        const errorMessage = result.error.message?.toLowerCase() || "";

        // Redirect unverified users to verification page
        if (
          errorCode.includes("not_verified") ||
          errorCode.includes("email_verification") ||
          errorMessage.includes("verify") ||
          errorMessage.includes("verification")
        ) {
          // Store email for verify page
          sessionStorage.setItem("otp-verify-email", data.emailOrPhone);
          // Store OTP sent timestamp for countdown timer
          sessionStorage.setItem("otp-sent-ts", Date.now().toString());
          router.push("/verify-email");
          return;
        }

        form.setError("root", {
          type: "manual",
          message: result.error.message || "Invalid email or password",
        });
        return;
      }

      // Check if email is verified before proceeding to feed
      const { data: currentSession } = await authClient.getSession();
      if (currentSession?.user && !currentSession.user.emailVerified) {
        sessionStorage.setItem("otp-verify-email", data.emailOrPhone);
        sessionStorage.setItem("otp-sent-ts", Date.now().toString());
        // Send verification OTP
        await authClient.emailOtp.sendVerificationOtp({
          email: data.emailOrPhone,
          type: "email-verification",
        });
        router.push("/verify-email");
        return;
      }

      // Check for pending profile from signup flow
      const pendingProfileStr = sessionStorage.getItem(PENDING_PROFILE_KEY);
      if (pendingProfileStr) {
        try {
          const pendingProfile = JSON.parse(pendingProfileStr);
          // Create the profile (idempotent - returns existing if already created)
          const profileResult = await createProfile({
            username: pendingProfile.username,
            firstName: pendingProfile.firstName,
            lastName: pendingProfile.lastName,
            dateOfBirth: pendingProfile.dateOfBirth,
            city: pendingProfile.city,
            country: pendingProfile.country,
          });

          if (profileResult.success) {
            // Clear pending profile on success
            sessionStorage.removeItem(PENDING_PROFILE_KEY);
          } else {
            // Log error but don't block login - profile can be created later
            console.error("Failed to create profile:", profileResult.error);
          }
        } catch (e) {
          // Don't block login if profile creation fails
          console.error("Error creating profile:", e);
        }
      }

      router.push("/feed");
    } catch {
      form.setError("root", {
        type: "manual",
        message: "Invalid email or password",
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
          name="emailOrPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or phone</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Email or phone number"
                  autoComplete="username"
                  {...field}
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
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right">
          <a
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}
