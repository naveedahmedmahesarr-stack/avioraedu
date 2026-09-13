import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { getGuides } from "@/lib/content/guides.de";
import { getLocale } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { pageMeta } from "@/i18n/meta";

const copy = {
  en: {
    title: "Germany Guides: Student Visa, Opportunity Card, Ausbildung",
    description: "Clear, source-linked guides for international students on the German student visa, the Opportunity Card and Ausbildung compared with university study.",
    eyebrow: "Guides",
    h1: "Germany, explained clearly.",
    intro: "Independent, plain-language overviews with links to official sources — so you can plan with confidence.",
    read: "Read guide",
  },
  de: {
    title: "Ratgeber: Studentenvisum, Chancenkarte, Ausbildung",
    description: "Verständliche Ratgeber mit offiziellen Quellen: Studentenvisum, Chancenkarte und Ausbildung im Vergleich zum Studium in Deutschland.",
    eyebrow: "Ratgeber",
    h1: "Deutschland, klar erklärt.",
    intro: "Unabhängige, verständliche Überblicke mit Links zu offiziellen Quellen – damit Sie mit Zuversicht planen können.",
    read: "Ratgeber lesen",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/guides", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function GuidesPage() {
  await connection();
  const locale = await getLocale();
  const c = copy[locale];
  const guides = getGuides(locale);
  return (
    <>
      <PageHeader crumbs={[{ name: c.eyebrow, path: "/guides" }]} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} />
      <section className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          <ul className="grid gap-6 md:grid-cols-3">
            {guides.map((g, i) => (
              <Reveal as="li" key={g.slug} delay={i * 80}>
                <Link
                  href={lp(locale, `/guides/${g.slug}`)}
                  className="group flex h-full flex-col rounded-3xl border border-navy-900/10 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_30px_60px_-35px_rgba(5,13,28,.45)]"
                >
                  <span className="eyebrow text-gold-600">{g.eyebrow.split(" · ")[1] ?? g.eyebrow}</span>
                  <h2 className="mt-4 text-3xl leading-tight text-navy-900 [hyphens:auto]">{g.title}</h2>
                  <p className="mt-3 flex-1 leading-relaxed text-stone">{g.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 group-hover:text-gold-600">
                    {c.read} <Icon name="arrowRight" className="size-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <ConsultationCTA defaultDestination="Germany" />
    </>
  );
}
