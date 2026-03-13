"use client";

import { ThemeProvider } from "next-themes";
import { ConvexClientProvider } from "@/lib/convex";
import { type PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ConvexClientProvider>
        {children}
      </ConvexClientProvider>
    </ThemeProvider>
  );
}
