import Link from "next/link";
import { LandingHeader } from "@/components/landing/landing-header";

export default function VendorSuccessPage() {
  return (
    <>
      <LandingHeader />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <p className="text-muted-foreground">
          Vendor success page coming soon.
        </p>
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
