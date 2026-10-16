import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";

const dmSans=DM_Sans({subsets:["latin"],variable:"--font-body"});
const sora=Sora({subsets:["latin"],variable:"--font-heading"});

export const metadata: Metadata = {
  title: "Magnetic Shades — Automotive Accessories Prototype",
  description: "Premium automotive eCommerce prototype with vehicle fitment configurator, custom sign studio and admin portal.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${sora.variable} antialiased`}>{children}</body>
    </html>
  );
}
