"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn, fixUploadUrl } from "@/lib/utils";

export function LandingHeader() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoUrl = useQuery(api.platformSettings.getLogoUrl);
  const darkLogoUrl = useQuery(api.platformSettings.getDarkLogoUrl);
  const platformName = useQuery(api.platformSettings.getPlatformName);

  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {logoUrl ? (
              <>
                <Image
                  src={fixUploadUrl(logoUrl)}
                  alt={platformName || "Tenseats"}
                  width={120}
                  height={40}
                  className={cn(
                    "h-11 w-auto object-contain",
                    darkLogoUrl && "dark:hidden"
                  )}
                  priority
                />
                {darkLogoUrl && (
                  <Image
                    src={fixUploadUrl(darkLogoUrl)}
                    alt={platformName || "Tenseats"}
                    width={120}
                    height={40}
                    className="hidden dark:block h-11 w-auto object-contain"
                    priority
                  />
                )}
              </>
            ) : (
              <span className="text-2xl font-semibold tracking-tight text-foreground">
                {platformName || "Tenseats"}
              </span>
            )}
          </Link>

          {/* Right side: desktop nav + theme toggle + mobile menu */}
          <div className="flex items-center gap-1">
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/join">
                <Button
                  variant="ghost"
                  className="text-base text-amber-400 hover:text-amber-300"
                >
                  Join
                </Button>
              </Link>
              <Link href="/why-tenseats">
                <Button
                  variant="ghost"
                  className="text-base text-muted-foreground hover:text-foreground"
                >
                  Why Tenseats
                </Button>
              </Link>
              <Link href="/cities">
                <Button
                  variant="ghost"
                  className="text-base text-muted-foreground hover:text-foreground"
                >
                  Cities
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-base text-muted-foreground hover:text-foreground"
                >
                  Log in
                </Button>
              </Link>
            </div>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Mobile hamburger menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <nav className="flex flex-col pt-14 px-6 gap-2">
                  <SheetClose asChild>
                    <Link
                      href="/join"
                      className="flex items-center rounded-md px-4 py-3 text-base font-medium text-amber-400 hover:text-amber-300 hover:bg-muted transition-colors"
                    >
                      Join
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/why-tenseats"
                      className="flex items-center rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      Why Tenseats
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/cities"
                      className="flex items-center rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      Cities
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="flex items-center rounded-md px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      Log in
                    </Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
