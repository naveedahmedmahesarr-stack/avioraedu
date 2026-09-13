import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { WhyGermany } from "@/components/sections/WhyGermany";
import { GermanyExperience } from "@/components/sections/GermanyExperience";
import { UniversityExplorer } from "@/components/sections/UniversityExplorer";
import { FaqList } from "@/components/sections/FaqList";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { CountryLinks } from "@/components/sections/CountryLinks";
import { SectionHeading } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { getSite, orgRef } from "@/lib/site";
import { markets } from "@/lib/content/markets";
import { getGuides } from "@/lib/content/guides.de";
import { getLocale } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { pageMeta } from "@/i18n/meta";
import { trAll } from "@/i18n/content";

const copy = {
  en: {
    title: "Study in Germany — University Admission Consultant",
    description: "Study in Germany with a Berlin-based education consultant: public university admission, tuition rules, English-taught programs, the student visa and arrival.",
    crumb: "Study in Germany",
    eyebrow: "Primary destination",
    h1a: "Study in",
    h1b: "Germany",
    intro: "Public universities, research excellence and a clear path from application to arrival — explained honestly.",
    unisEyebrow: "Universities in Germany",
    unisTitle: "Explore German universities.",
    faqEyebrow: "Questions",
    faqTitle: "Straight answers.",
    guidesEyebrow: "Guides",
    guidesTitle: "Plan the details.",
    serviceName: "Study in Germany admission guidance",
    serviceDesc: "Profile assessment, university and program selection, application documents, visa guidance and pre-departure support for studying in Germany. Admission and visa decisions are made by universities and authorities.",
  },
  de: {
    title: "Studium in Deutschland – Beratung zur Hochschulzulassung",
    description: "Studieren in Deutschland mit einer Bildungsberatung aus Berlin: Zulassung an staatlichen Hochschulen, Gebühren, englischsprachige Studiengänge und Visum.",
    crumb: "Studium in Deutschland",
    eyebrow: "Hauptstudienziel",
    h1a: "Studieren in",
    h1b: "Deutschland",
    intro: "Staatliche Hochschulen, exzellente Forschung und ein klarer Weg von der Bewerbung bis zur Ankunft – ehrlich erklärt.",
    unisEyebrow: "Hochschulen in Deutschland",
    unisTitle: "Deutsche Hochschulen entdecken.",
    faqEyebrow: "Fragen",
    faqTitle: "Klare Antworten.",
    guidesEyebrow: "Ratgeber",
    guidesTitle: "Die Details planen.",
    serviceName: "Beratung zur Zulassung für ein Studium in Deutschland",
    serviceDesc: "Profilanalyse, Auswahl von Hochschule und Studiengang, Bewerbungsunterlagen, Orientierung zum Visum und Vorbereitung auf die Abreise für ein Studium in Deutschland. Über Zulassung und Visum entscheiden Hochschulen und Behörden.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/study-in-germany", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function StudyInGermanyPage() {
  await connection();
  const [universities, faqs, site, locale] = await Promise.all([list("universities", { publishedOnly: true }), list("faqs", { publishedOnly: true }), getSite(), getLocale()]);
  const c = copy[locale];
  const guides = getGuides(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: c.serviceName,
            serviceType: "Education consulting for university admission in Germany",
            provider: orgRef(site),
            areaServed: markets.map((m) => ({ "@type": "Country", name: m.country })),
            description: c.serviceDesc,
            inLanguage: locale,
          }).replace(/</g, "\\u003c"),
        }}
      />
      <PageHeader
        crumbs={[{ name: c.crumb, path: "/study-in-germany" }]}
        eyebrow={c.eyebrow}
        title={
          <>
            {c.h1a} <span className="gold-text">{c.h1b}</span>.
          </>
        }
        intro={c.intro}
      />
      <WhyGermany />
      <GermanyExperience />
      <section aria-labelledby="de-unis" className="bg-sand/50 py-28 md:py-36">
        <div className="container-x">
          <SectionHeading eyebrow={c.unisEyebrow} title={<span id="de-unis">{c.unisTitle}</span>} />
          <div className="mt-12">
            <UniversityExplorer universities={trAll(universities, locale).filter((u) => u.country === "Germany")} />
          </div>
        </div>
      </section>
      <section aria-labelledby="faq" className="bg-ivory py-28 md:py-36">
        <div className="container-x">
          <SectionHeading eyebrow={c.faqEyebrow} title={<span id="faq">{c.faqTitle}</span>} />
          <div className="mt-12">
            <FaqList faqs={trAll(faqs, locale)} />
          </div>
        </div>
      </section>
      <CountryLinks tone="ivory" />
      <section aria-labelledby="guides" className="bg-sand/50 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={c.guidesEyebrow} title={<span id="guides">{c.guidesTitle}</span>} />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={lp(locale, `/guides/${g.slug}`)}
                  className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-navy-900/10 bg-white p-6 transition-colors hover:border-gold-500/40"
                >
                  <span>
                    <span className="block font-display text-2xl leading-tight text-navy-900">{g.title}</span>
                    <span className="mt-2 block text-sm text-stone">{g.eyebrow.split(" · ")[1] ?? g.eyebrow}</span>
                  </span>
                  <Icon name="arrowRight" className="mt-1 size-4 shrink-0 text-gold-600 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ConsultationCTA defaultDestination="Germany" />
    </>
  );
}
