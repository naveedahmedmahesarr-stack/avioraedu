import type { Metadata } from "next";
import { connection } from "next/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesList } from "@/components/sections/ServicesList";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { getServices } from "@/lib/content/services.de";
import { getSite, orgRef } from "@/lib/site";
import { getLocale } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { pageMeta } from "@/i18n/meta";

const copy = {
  en: {
    title: "Services: University Admission & Visa Guidance",
    description: "Profile review, German university applications, student visa preparation, arrival guidance and honest advice on other European study destinations.",
    eyebrow: "Services",
    h1: "Six things we do, and do carefully.",
    intro: "Every service starts with the same question: what will actually get you admitted, and what is a waste of your time and money? Open any service to see exactly what's included.",
    note: "Universities decide on admission and German authorities decide on visas. We don't sell guarantees — we make sure your application is the best version of itself.",
  },
  de: {
    title: "Leistungen: Hochschulzulassung & Visumberatung",
    description: "Profilanalyse, Bewerbungen an deutschen Hochschulen, Vorbereitung auf das Studentenvisum, Hilfe bei der Ankunft und ehrliche Beratung zu weiteren Ländern.",
    eyebrow: "Leistungen",
    h1: "Sechs Leistungen – sorgfältig umgesetzt.",
    intro: "Jede Leistung beginnt mit derselben Frage: Was bringt Sie wirklich zur Zulassung – und was kostet nur Zeit und Geld? Öffnen Sie eine Leistung, um genau zu sehen, was enthalten ist.",
    note: "Über die Zulassung entscheiden die Hochschulen, über Visa die deutschen Behörden. Wir verkaufen keine Garantien – wir sorgen dafür, dass Ihre Bewerbung so stark wie möglich ist.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/services", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function ServicesPage() {
  await connection();
  const [site, locale] = await Promise.all([getSite(), getLocale()]);
  const c = copy[locale];
  const jsonLd = getServices(locale).map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.what,
    url: `${site.url}${lp(locale, "/services")}#${s.slug}`,
    provider: orgRef(site),
    inLanguage: locale,
  }));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader crumbs={[{ name: c.eyebrow, path: "/services" }]} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} />
      <section className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          <ServicesList />
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-stone">{c.note}</p>
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
