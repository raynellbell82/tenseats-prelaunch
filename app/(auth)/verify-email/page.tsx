"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/login");
      } else if (session.user.emailVerified) {
        router.push("/"); // Pre-launch: redirect to homepage, not /feed
      }
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session?.user || session.user.emailVerified) {
    return null; // Will redirect
  }

  // Get email from session, URL params, or sessionStorage fallback
  const emailFromStorage =
    typeof window !== "undefined"
      ? sessionStorage.getItem("otp-verify-email")
      : null;
  const email =
    session?.user?.email ||
    searchParams.get("email") ||
    emailFromStorage ||
    "";

  // If no email available, redirect to signup
  if (!email) {
    router.push("/signup");
    return null;
  }

  // Get initialCode from URL params (for magic link auto-fill)
  const initialCode = searchParams.get("code") || undefined;

  return <VerifyEmailForm email={email} initialCode={initialCode} />;
}
