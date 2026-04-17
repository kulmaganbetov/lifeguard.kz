import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeGuard KZ — AI-негізіндегі өмірді сақтандыру платформасы",
  description:
    "Қазақстандағы өмірді сақтандыру тәуекелін бағалайтын AI платформа. Актуарлық есептеу, ҚР заңнамасына сәйкес, 3 сақтандыру компаниясының ұсыныстары.",
  keywords: [
    "өмірді сақтандыру",
    "Қазақстан",
    "LifeGuard",
    "AI сақтандыру",
    "страхование жизни",
    "актуарлық",
  ],
  openGraph: {
    title: "LifeGuard KZ",
    description: "AI-негізіндегі өмірді сақтандыру платформасы Қазақстан үшін",
    type: "website",
    locale: "kk_KZ",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="kk"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <div
          className="ambient-blob"
          style={{
            top: "-20%",
            left: "-10%",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle, #10b981, transparent 60%)",
          }}
        />
        <div
          className="ambient-blob"
          style={{
            bottom: "-25%",
            right: "-10%",
            width: "55vw",
            height: "55vw",
            background: "radial-gradient(circle, #0ea5e9, transparent 60%)",
          }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
