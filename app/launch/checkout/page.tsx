import { Suspense } from "react";
import { LandingHeader } from "@/components/landing/landing-header";
import { CheckoutPageContent } from "./checkout-page-content";
import { Skeleton } from "@/components/ui/skeleton";

function CheckoutSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <LandingHeader />
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutPageContent />
      </Suspense>
    </>
  );
}
