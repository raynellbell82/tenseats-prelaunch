import { LandingHeader } from "@/components/landing/landing-header";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <>
      <LandingHeader />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Welcome to Tenseats</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your founding membership is confirmed. We will be in touch as we
            prepare for launch.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block rounded-full bg-foreground text-background px-8 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </>
  );
}
