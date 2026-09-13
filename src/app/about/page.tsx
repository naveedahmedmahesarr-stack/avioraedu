import type { Metadata } from "next";
import { connection } from "next/server";
import { getHomepage, list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { AboutSection } from "@/components/sections/AboutSection";
import { FounderTeaser } from "@/components/sections/FounderTeaser";
import { TrustSection } from "@/components/sections/TrustSection";
import { Locations } from "@/components/sections/Locations";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { getSite } from "@/lib/site";
import { getLocale, getUi } from "@/i18n/server";
import { pageMeta } from "@/i18n/meta";
import { tr } from "@/i18n/content";

const copy = {
  en: {
    title: "About Us — Education Consultancy in Berlin",
    description: "AVIORA EDU is a Berlin-based education consultancy founded by Naveed Ahmed, helping international students apply to universities in Germany and Europe.",
    h1: "Focused. Honest. European.",
  },
  de: {
    title: "Über uns – Bildungsberatung in Berlin",
    description: "AVIORA EDU ist eine Bildungsberatung aus Berlin, gegründet von Naveed Ahmed. Wir begleiten internationale Studierende auf dem Weg an Hochschulen in Europa.",
    h1: "Fokussiert. Ehrlich. Europäisch.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/about", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function AboutPage() {
  await connection();
  const [homeRaw, team, site, { locale, t }] = await Promise.all([getHomepage(), list("team", { publishedOnly: true }), getSite(), getUi()]);
  const home = tr(homeRaw, locale);
  const founderRaw = [...team].sort((a, b) => a.order - b.order)[0];
  const location = locale === "de" ? site.location.replace("Germany", "Deutschland") : site.location;
  return (
    <>
      <PageHeader crumbs={[{ name: t.nav.about, path: "/about" }]} eyebrow={t.nav.about} title={copy[locale].h1} intro={home.aboutWho} />
      <AboutSection home={home} />
      <FounderTeaser founder={founderRaw ? tr(founderRaw, locale) : undefined} location={location} />
      <Locations location={site.location || undefined} />
      <TrustSection />
      <ConsultationCTA />
    </>
  );
}
