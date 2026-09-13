import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { UniversityExplorer } from "@/components/sections/UniversityExplorer";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/i18n/meta";
import { trAll } from "@/i18n/content";

const copy = {
  en: {
    title: "Universities in Germany & Europe",
    description: "Explore well-known universities in Germany and Europe, including TUM, RWTH Aachen and TU Berlin, by degree level, field of study, language and city.",
    eyebrow: "Universities",
    h1: "Universities worth considering.",
    intro: "A starting point for your shortlist. Filter by country, degree, field and language — then talk to us about which ones actually fit your grades, budget and plans.",
    listTitle: "University search and results",
  },
  de: {
    title: "Hochschulen in Deutschland & Europa",
    description: "Bekannte Hochschulen in Deutschland und Europa entdecken, darunter TUM, RWTH Aachen und TU Berlin – nach Abschluss, Fachrichtung, Sprache und Stadt.",
    eyebrow: "Hochschulen",
    h1: "Hochschulen, die sich lohnen.",
    intro: "Ein Ausgangspunkt für Ihre Auswahl. Filtern Sie nach Land, Abschluss, Fachrichtung und Sprache – und sprechen Sie dann mit uns darüber, welche wirklich zu Ihren Noten, Ihrem Budget und Ihren Plänen passen.",
    listTitle: "Hochschulsuche und Ergebnisse",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/universities", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function UniversitiesPage() {
  await connection();
  const [universities, locale] = await Promise.all([list("universities", { publishedOnly: true }), getLocale()]);
  const c = copy[locale];
  return (
    <>
      <PageHeader crumbs={[{ name: c.eyebrow, path: "/universities" }]} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} skyline="AT" />
      <section aria-labelledby="university-results" className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          {/* Keeps the heading outline intact (h1 → h2 → university cards as h3) for screen readers. */}
          <h2 id="university-results" className="sr-only">
            {c.listTitle}
          </h2>
          <UniversityExplorer universities={trAll(universities, locale)} />
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
