import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdmissionTimeline } from "@/components/sections/AdmissionTimeline";
import { FaqList } from "@/components/sections/FaqList";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { SectionHeading } from "@/components/ui/Reveal";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/i18n/meta";
import { trAll } from "@/i18n/content";

const copy = {
  en: {
    title: "How It Works — Applying to Universities in Germany",
    description: "Our nine-step process: consultation, profile assessment, university selection, documents, application, visa guidance, pre-departure and arrival.",
    eyebrow: "How it works",
    h1: "From first conversation to first semester.",
    intro: "A structured, transparent process — with clear explanations of what we do and what universities and authorities decide.",
    faqEyebrow: "FAQ",
    faqTitle: "Common questions",
  },
  de: {
    title: "Ablauf – Bewerbung an Hochschulen in Deutschland",
    description: "Unser Ablauf in neun Schritten: Beratung, Profilanalyse, Hochschulauswahl, Unterlagen, Bewerbung, Visum, Abreise und Ankunft.",
    eyebrow: "Ablauf",
    h1: "Vom ersten Gespräch bis zum ersten Semester.",
    intro: "Ein strukturierter, transparenter Ablauf – mit klaren Erklärungen, was wir übernehmen und was Hochschulen und Behörden entscheiden.",
    faqEyebrow: "FAQ",
    faqTitle: "Häufige Fragen",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/how-it-works", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function HowItWorksPage() {
  await connection();
  const [faqs, locale] = await Promise.all([list("faqs", { publishedOnly: true }), getLocale()]);
  const c = copy[locale];
  return (
    <>
      <PageHeader crumbs={[{ name: c.eyebrow, path: "/how-it-works" }]} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} skyline="PL" />
      <section className="bg-navy-950 py-24 md:py-36">
        <div className="container-x">
          <AdmissionTimeline />
        </div>
      </section>
      <section aria-labelledby="faq" className="bg-ivory py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={c.faqEyebrow} title={<span id="faq">{c.faqTitle}</span>} />
          <div className="mt-12">
            <FaqList faqs={trAll(faqs, locale)} />
          </div>
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
