import type { Metadata } from "next";
import { connection } from "next/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { Locations } from "@/components/sections/Locations";
import { getSite } from "@/lib/site";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/i18n/meta";

const copy = {
  en: {
    title: "Contact & Book a Consultation",
    description: "Book a free first consultation with AVIORA EDU in Berlin and get a realistic view of your options for studying in Germany or elsewhere in Europe.",
    eyebrow: "Contact",
    h1: "Start the conversation.",
    intro: "Send us your details and a consultant will reply personally — usually with a few questions and a realistic first view of your options.",
  },
  de: {
    title: "Kontakt & Beratung buchen",
    description: "Buchen Sie eine kostenlose Erstberatung bei AVIORA EDU in Berlin und erhalten Sie eine realistische Einschätzung Ihrer Studienmöglichkeiten in Europa.",
    eyebrow: "Kontakt",
    h1: "Lassen Sie uns sprechen.",
    intro: "Senden Sie uns Ihre Angaben – Sie erhalten eine persönliche Antwort, meist mit einigen Rückfragen und einer realistischen ersten Einschätzung Ihrer Möglichkeiten.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/contact", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function ContactPage(props: PageProps<"/contact">) {
  await connection();
  const [sp, site, locale] = await Promise.all([props.searchParams, getSite(), getLocale()]);
  const destination = typeof sp.destination === "string" ? sp.destination : undefined;
  const c = copy[locale];
  return (
    <>
      <PageHeader crumbs={[{ name: c.eyebrow, path: "/contact" }]} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} />
      <ConsultationCTA defaultDestination={destination} />
      <Locations location={site.location || undefined} />
    </>
  );
}
