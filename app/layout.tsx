import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tenseats",
  description: "The food-focused social marketplace launching in 32 US cities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
