import type { Metadata, Viewport } from "next";
import { Unbounded, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import { site } from "@/lib/content";

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});
const body = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});
const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://satva-club.vercel.app"),
  title: `${site.name} — ${site.tagline}`,
  description: `${site.name} (${site.expansion}) is a student coding club building the future with technology, computer vision and AI. ${site.tagline}.`,
  keywords: ["SATVA", "coding club", "AI", "computer vision", "hackathon", "technology"],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.expansion,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${code.variable}`}>
      <body className="antialiased">
        <Preloader />
        <SmoothScroll />
        <Cursor />
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
