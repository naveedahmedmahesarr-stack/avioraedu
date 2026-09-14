import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { CountryLinks } from "@/components/sections/CountryLinks";
import { Icon } from "@/components/ui/Icon";
import { markets } from "@/lib/content/markets";
import { getMarket, marketName } from "@/lib/content/markets.de";
import { getGuides } from "@/lib/content/guides.de";
import { getSite, orgRef } from "@/lib/site";
import { getLocale, getUi } from "@/i18n/server";
import { lp, type Locale } from "@/i18n/locales";
import { pageMeta } from "@/i18n/meta";

export function generateStaticParams() {
  return markets.map((m) => ({ country: m.slug }));
}

const labels = (locale: Locale, inCountry: string) =>
  locale === "de"
    ? {
        eligibility: "Ermöglicht Ihr Abschluss den Zugang zu deutschen Hochschulen?",
        visa: `Das Studentenvisum aus ${inCountry} beantragen`,
        missions: `Deutsche Vertretungen für Bewerberinnen und Bewerber aus ${inCountry}:`,
        notes: "Gut zu wissen vor der Bewerbung",
        help: `So unterstützt AVIORA EDU Studierende aus ${inCountry}`,
        services: [
          "Prüfung Ihres Profils anhand der deutschen Zulassungsvoraussetzungen",
          "Eine realistische Auswahl an Hochschulen und Studiengängen",
          "Hilfe bei Lebenslauf, Motivationsschreiben und Unterlagenprüfung",
          "Unterstützung bei der Bewerbung über Hochschulportale und uni-assist",
          "Vorbereitung auf das Visum: Unterlagen-Checklisten und Vorbereitung auf das Gespräch",
          "Orientierung vor der Abreise und in der ersten Woche nach der Ankunft",
        ],
        remote: "Wir betreuen Studierende aus der Ferne – per WhatsApp, E-Mail und Videoanruf. Über die Zulassung entscheiden die Hochschulen, über Visa die deutschen Behörden – beides versprechen wir nie. Sehen Sie,",
        process: "wie unser Ablauf funktioniert",
        faq: "Häufige Fragen",
        sources: "Offizielle Quellen",
        sourcesNote: "Regeln ändern sich. Prüfen Sie die aktuellen Anforderungen vor Ihrer Bewerbung immer bei diesen Quellen.",
        asideEyebrow: "Kostenlose Erstberatung",
        asideText: "Unsicher, wo Ihr Abschluss hinpasst? Senden Sie uns Ihre Angaben – wir prüfen das.",
        related: "Weiterlesen",
        overview: "Studium in Deutschland – Überblick",
        unis: "Deutsche Hochschulen entdecken",
        support: "Studierenden-Service",
        studyIn: "Studium in Deutschland",
      }
    : {
        eligibility: "Does your qualification give access to German universities?",
        visa: `Applying for the student visa from ${inCountry}`,
        missions: `German missions that serve applicants in ${inCountry}:`,
        notes: "Worth knowing before you apply",
        help: `How AVIORA EDU helps students from ${inCountry}`,
        services: [
          "Profile review against German entry requirements",
          "A realistic shortlist of universities and programs",
          "Help with CVs, motivation letters and document checks",
          "Application support through university portals and uni-assist",
          "Visa preparation: document checklists and interview preparation",
          "Pre-departure and first-week guidance after arrival",
        ],
        remote: "We work with students remotely by WhatsApp, email and video call. Universities decide admission and German authorities decide visas — we never promise either. See",
        process: "how our process works",
        faq: "Frequently asked questions",
        sources: "Official sources",
        sourcesNote: "Rules change. Always confirm current requirements with these sources before applying.",
        asideEyebrow: "Free first consultation",
        asideText: "Not sure where your qualification fits? Send us your details and we'll check.",
        related: "Related",
        overview: "Study in Germany overview",
        unis: "Explore German universities",
        support: "Student Support",
        studyIn: "Study in Germany",
      };

export async function generateMetadata(props: PageProps<"/study-in-germany/from/[country]">): Promise<Metadata> {
  await connection();
  const [{ country }, locale] = await Promise.all([props.params, getLocale()]);
  const m = getMarket(country, locale);
  if (!m) return { title: locale === "de" ? "Seite nicht gefunden" : "Page not found" };
  return pageMeta(locale, `/study-in-germany/from/${m.slug}`, m.metaTitle, m.description);
}

export default async function MarketPage(props: PageProps<"/study-in-germany/from/[country]">) {
  await connection();
  const [{ country }, { locale }] = await Promise.all([props.params, getUi()]);
  const m = getMarket(country, locale);
  if (!m) notFound();
  const site = await getSite();
  const path = `/study-in-germany/from/${m.slug}`;
  const l = labels(locale, m.inCountry);
  const guides = getGuides(locale);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: m.h1,
      serviceType: "Education consulting for university admission in Germany",
      description: m.description,
      url: `${site.url}${lp(locale, path)}`,
      provider: orgRef(site),
      areaServed: { "@type": "Country", name: markets.find((x) => x.slug === m.slug)?.country ?? m.country },
      inLanguage: locale,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: m.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader
        crumbs={[
          { name: l.studyIn, path: "/study-in-germany" },
          { name: marketName(m.slug, locale, "from"), path },
        ]}
        eyebrow={`${l.studyIn} · ${marketName(m.slug, locale, "short")}`}
        title={m.h1}
        intro={m.intro}
      />
      <article className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_340px]">
          <div className="prose-legal max-w-3xl">
            <section>
              <h2 className="!mt-0">{l.eligibility}</h2>
              {m.eligibility.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
            <section>
              <h2>{l.visa}</h2>
              {m.visa.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>{l.missions}</p>
              <ul className="list-disc pl-6">
                {m.missions.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2>{l.notes}</h2>
              {m.notes.map((n) => (
                <div key={n.title}>
                  <h3 className="mt-6 font-display text-2xl text-navy-900">{n.title}</h3>
                  <p>{n.body}</p>
                </div>
              ))}
            </section>
            <section>
              <h2>{l.help}</h2>
              <ul className="list-disc pl-6">
                {l.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p>
                {l.remote}{" "}
                <Link href={lp(locale, "/how-it-works")} className="text-navy-900 underline underline-offset-4 hover:text-gold-600">
                  {l.process}
                </Link>
                .
              </p>
            </section>
            <section>
              <h2>{l.faq}</h2>
              {m.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="mt-6 font-display text-2xl text-navy-900">{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>
            <section>
              <h2>{l.sources}</h2>
              <p className="text-sm">{l.sourcesNote}</p>
              <ul className="list-disc pl-6">
                {m.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-navy-900 underline underline-offset-4 hover:text-gold-600">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-navy-950 p-7 text-ivory">
              <p className="eyebrow text-gold-300">{l.asideEyebrow}</p>
              <p className="mt-3 font-display text-2xl leading-snug">{l.asideText}</p>
              <Link href="#consultation" className="btn btn-gold mt-6 w-full">
                {locale === "de" ? "Beratung buchen" : "Book a Consultation"}
              </Link>
            </div>
            <nav aria-label={l.related} className="rounded-3xl border border-navy-900/10 bg-white p-7">
              <p className="eyebrow text-gold-600">{l.related}</p>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  { href: "/study-in-germany", label: l.overview },
                  { href: "/universities", label: l.unis },
                  { href: "/student-support", label: l.support },
                  { href: "/dream-stories", label: locale === "de" ? "Visum-Erfolgsgeschichten" : "Student visa success stories" },
                  ...guides.map((g) => ({ href: `/guides/${g.slug}`, label: g.title })),
                ].map((x) => (
                  <li key={x.href}>
                    <Link href={lp(locale, x.href)} className="inline-flex items-start gap-2 text-navy-900 hover:text-gold-600">
                      <Icon name="arrowRight" className="mt-0.5 size-4 shrink-0" /> {x.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </article>
      <CountryLinks exclude={m.slug} />
      <ConsultationCTA defaultDestination="Germany" />
    </>
  );
}
