import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

function LoginContent({ searchParams }: { searchParams: { reset?: string } }) {
  const showResetSuccess = searchParams.reset === "success";

  return (
    <div className="space-y-6">
      {showResetSuccess && (
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-700 dark:text-green-300 text-center">
          Password reset successful! Please sign in with your new password.
        </div>
      )}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to your account
        </p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-primary hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent searchParams={params} />
    </Suspense>
  );
}
