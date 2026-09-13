import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { connection } from "next/server";
import { siteConfig } from "@/lib/config";
import { getSettings } from "@/lib/content/store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Germany Education Consultant — Study in Germany & Europe | AVIORA EDU",
    template: "%s | AVIORA EDU",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "AVIORA EDU — Your journey to Europe starts here",
    description: siteConfig.description,
    url: "/",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVIORA EDU — Study in Germany & Europe",
    description: siteConfig.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#050d1c",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Business contact settings are read per request so Admin changes appear immediately.
  await connection();
  const settings = await getSettings();
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ivory focus:px-5 focus:py-3 focus:text-navy-950"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton number={settings.whatsappNumber} message={settings.whatsappMessage} />
        <CookieBanner />
      </body>
    </html>
  );
}
