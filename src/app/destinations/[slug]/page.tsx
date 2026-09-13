import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { UniversityExplorer } from "@/components/sections/UniversityExplorer";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/ui/Flag";
import { getLocale } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { pageMeta } from "@/i18n/meta";
import { term, tr, trAll } from "@/i18n/content";

async function getDestination(slug: string) {
  const all = await list("destinations", { publishedOnly: true });
  return all.find((d) => d.slug === slug) ?? null;
}

const copy = {
  en: { studyIn: (n: string) => `Study in ${n}`, eyebrow: (n: string) => `Study destination · ${n}`, destinations: "Destinations", benefits: "Study benefits", lifestyle: "Lifestyle", cities: "Major student cities", unis: "Universities", unisIn: (n: string) => `Universities in ${n}`, desc: (tag: string, n: string) => `${tag} Universities, study benefits and student life in ${n} for international students.`, notFound: "Destination not found" },
  de: { studyIn: (n: string) => `Studieren in ${n}`, eyebrow: (n: string) => `Studienziel · ${n}`, destinations: "Studienziele", benefits: "Vorteile für Studierende", lifestyle: "Lebensgefühl", cities: "Wichtige Studentenstädte", unis: "Hochschulen", unisIn: (n: string) => `Hochschulen in ${n}`, desc: (tag: string, n: string) => `${tag} Hochschulen, Vorteile und Studierendenleben in ${n} für internationale Studierende.`, notFound: "Studienziel nicht gefunden" },
};

export async function generateMetadata(props: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  await connection();
  const [{ slug }, locale] = await Promise.all([props.params, getLocale()]);
  const raw = await getDestination(slug);
  const c = copy[locale];
  if (!raw) return { title: c.notFound };
  const d = tr(raw, locale);
  return pageMeta(locale, `/destinations/${d.slug}`, c.studyIn(d.name), c.desc(d.tagline, d.name));
}

export default async function DestinationPage(props: PageProps<"/destinations/[slug]">) {
  await connection();
  const [{ slug }, locale] = await Promise.all([props.params, getLocale()]);
  if (slug === "germany") redirect(lp(locale, "/study-in-germany"));
  const raw = await getDestination(slug);
  if (!raw) notFound();
  const d = tr(raw, locale);
  const c = copy[locale];
  const universities = trAll((await list("universities", { publishedOnly: true })).filter((u) => u.country === raw.country), locale);

  return (
    <>
      <PageHeader
        crumbs={[
          { name: c.destinations, path: "/destinations" },
          { name: d.name, path: `/destinations/${d.slug}` },
        ]}
        eyebrow={c.eyebrow(d.name)}
        title={
          <span className="inline-flex flex-wrap items-center gap-5">
            <Flag code={d.flag} className="h-10 w-14" /> {c.studyIn(d.name)}.
          </span>
        }
        intro={d.tagline}
        skyline={d.flag}
      />
      <section className="bg-ivory py-24 md:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <p className="font-display text-3xl leading-snug text-navy-900 md:text-4xl">{d.description}</p>
            {d.gallery.length > 0 && (
              <ul className="mt-12 grid grid-cols-2 gap-4">
                {d.gallery.map((src, i) => (
                  <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image src={src} alt={`${d.name} — ${i + 1}`} fill sizes="(min-width:1024px) 30vw, 50vw" className="object-cover" />
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
          <Reveal delay={120} className="space-y-10">
            <div>
              <h2 className="eyebrow text-gold-600">{c.benefits}</h2>
              <ul className="mt-5 space-y-4">
                {d.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-stone">
                    <Icon name="check" className="mt-0.5 size-5 shrink-0 text-gold-600" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-gold-600">{c.lifestyle}</h2>
              <ul className="mt-5 space-y-3 text-stone">
                {d.lifestyle.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-gold-600">{c.cities}</h2>
              <p className="mt-5 font-display text-2xl text-navy-900">{d.cities.map((x) => term(x, locale)).join(" · ")}</p>
            </div>
          </Reveal>
        </div>
      </section>
      {universities.length > 0 && (
        <section className="bg-sand/50 py-24 md:py-32">
          <div className="container-x">
            <SectionHeading eyebrow={c.unis} title={c.unisIn(d.name)} />
            <div className="mt-12">
              <UniversityExplorer universities={universities} />
            </div>
          </div>
        </section>
      )}
      <ConsultationCTA defaultDestination={raw.country} />
    </>
  );
}
