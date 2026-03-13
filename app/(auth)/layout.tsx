import Link from "next/link";
import { LandingHeader } from "@/components/landing/landing-header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingHeader />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          <Link href="/" className="block text-center mb-8">
            <span className="text-2xl font-bold text-foreground">Tenseats</span>
          </Link>
          {children}
        </div>
      </div>
    </>
  );
}
