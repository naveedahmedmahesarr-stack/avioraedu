import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { connection } from "next/server";
import { getSite } from "@/lib/site";
import { getLocale } from "@/i18n/server";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { pageMeta } from "@/i18n/meta";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "latin-ext"], display: "swap" });

const description = {
  en: "Education consultancy in Berlin for studying in Germany and Europe: university admission, student visa preparation and arrival guidance.",
  de: "Bildungsberatung aus Berlin für ein Studium in Deutschland und Europa: Hochschulzulassung, Vorbereitung auf das Studentenvisum und Orientierung bei der Ankunft.",
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  const title = { en: `Education Consultant in Berlin – Study in Germany | ${site.name}`, de: `Studienberatung in Berlin – Studieren in Deutschland | ${site.name}` };
  const base = pageMeta(locale, "/", title, description);
  return {
    ...base,
    metadataBase: new URL(site.url),
    title: { default: title[locale], template: `%s | ${site.name}` },
    applicationName: site.name,
  };
}

export const viewport: Viewport = {
  themeColor: "#050d1c",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Business contact settings are read per request so Admin changes appear immediately.
  await connection();
  const [{ settings }, locale] = await Promise.all([getSite(), getLocale()]);
  const waMessage = locale === "de" && settings.whatsappMessageDe ? settings.whatsappMessageDe : settings.whatsappMessage;
  return (
    <html lang={locale} className={`${cormorant.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-dvh">
        <LocaleProvider locale={locale}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ivory focus:px-5 focus:py-3 focus:text-navy-950"
          >
            {locale === "de" ? "Zum Inhalt springen" : "Skip to content"}
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton number={settings.whatsappNumber} message={waMessage} />
          <CookieBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
