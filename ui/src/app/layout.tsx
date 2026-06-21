import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GlobalNavDock } from "@/components/global-nav-dock";

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zyphra | Premium Digital Newspaper",
    template: "%s | Zyphra"
  },
  description: "Experience high-end journalism, tech tutorials, and curated lifestyle content.",
  openGraph: {
    title: "Zyphra | Premium Digital Newspaper",
    description: "Experience high-end journalism, tech tutorials, and curated lifestyle content.",
    url: "https://zyphra.digital",
    siteName: "Zyphra",
    images: [
      {
        url: "/og-image.jpg", // Placeholder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${serif.variable} ${sans.variable} font-sans antialiased bg-stone-50 text-stone-900 pb-32`}
      >
        {children}
        <GlobalNavDock />
        <Toaster />
      </body>
    </html>
  );
}
