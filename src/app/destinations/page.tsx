import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { DestinationExplorer } from "@/components/sections/DestinationExplorer";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/i18n/meta";
import { trAll } from "@/i18n/content";

const copy = {
  en: {
    title: "Study Destinations in Europe",
    description: "Study in Germany, Italy, Poland, Portugal or Austria — compare European study opportunities for international students.",
    eyebrow: "Destinations",
    h1: "Where students study.",
    intro: "Germany is our primary focus. Italy, Poland, Portugal and Austria complete a carefully chosen set of European destinations.",
  },
  de: {
    title: "Studienziele in Europa",
    description: "Studieren in Deutschland, Italien, Polen, Portugal oder Österreich – europäische Studienmöglichkeiten für internationale Studierende im Vergleich.",
    eyebrow: "Studienziele",
    h1: "Wo Studierende studieren.",
    intro: "Deutschland ist unser Schwerpunkt. Italien, Polen, Portugal und Österreich ergänzen eine sorgfältig ausgewählte Reihe europäischer Studienziele.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/destinations", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function DestinationsPage() {
  await connection();
  const [destinations, locale] = await Promise.all([list("destinations", { publishedOnly: true }), getLocale()]);
  const c = copy[locale];
  return (
    <>
      <PageHeader crumbs={[{ name: c.eyebrow, path: "/destinations" }]} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} skyline="IT" />
      <section className="bg-ivory py-24 md:py-32">
        <div className="container-x">
          <DestinationExplorer destinations={trAll(destinations, locale)} />
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
