import type { Metadata } from "next";
import { connection } from "next/server";
import { getSite, orgRef } from "@/lib/site";
import { getSupportAreas } from "@/lib/content/studentSupport";
import { getLocale, getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { pageMeta } from "@/i18n/meta";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";

const copy = {
  en: {
    title: "Student Support — Arrival Guidance for Germany",
    description:
      "Practical guidance beyond admission: travel preparation, housing search, Anmeldung, bank account, SIM card and everyday orientation in Germany.",
    eyebrow: "Student Support",
    h1: "More than admission support.",
    intro:
      "From travel preparation and accommodation guidance to Anmeldung, SIM setup and everyday orientation, we help you understand the essential first steps of starting life in Germany.",
    journeyEyebrow: "Your move, step by step",
    journeyTitle: "From home to settled in Germany.",
    areasEyebrow: "What's included",
    areasTitle: "Practical guidance for the moments that matter.",
    honestTitle: "What we can — and can't — promise",
    honest:
      "We provide guidance and practical support. We can't guarantee accommodation, a bank account, a mobile contract or a registration appointment — landlords, banks, providers and authorities make those decisions. What we can do is make sure you understand each step and arrive prepared.",
    howTitle: "How support fits into your plan",
    how: "We talk through the support you need during your consultation, so it matches your city, your timeline and your budget.",
    serviceName: "Student arrival and settling-in guidance for Germany",
  },
  de: {
    title: "Studierenden-Service – Ankommen in Deutschland",
    description:
      "Praktische Orientierung über die Zulassung hinaus: Reisevorbereitung, Wohnungssuche, Anmeldung, Bankkonto, SIM-Karte und der Alltag in Deutschland.",
    eyebrow: "Studierenden-Service",
    h1: "Mehr als Hilfe bei der Zulassung.",
    intro:
      "Von der Reisevorbereitung und Wohnungssuche bis zur Anmeldung, SIM-Karte und Orientierung im Alltag – wir helfen Ihnen, die wichtigsten ersten Schritte für Ihr Leben in Deutschland zu verstehen.",
    journeyEyebrow: "Ihr Umzug, Schritt für Schritt",
    journeyTitle: "Von zu Hause bis zum Ankommen in Deutschland.",
    areasEyebrow: "Was dazugehört",
    areasTitle: "Praktische Orientierung für die entscheidenden Momente.",
    honestTitle: "Was wir versprechen können – und was nicht",
    honest:
      "Wir bieten Orientierung und praktische Unterstützung. Eine Wohnung, ein Bankkonto, einen Mobilfunkvertrag oder einen Anmeldetermin können wir nicht garantieren – darüber entscheiden Vermieter, Banken, Anbieter und Behörden. Wir sorgen aber dafür, dass Sie jeden Schritt verstehen und gut vorbereitet ankommen.",
    howTitle: "Wie der Service in Ihren Plan passt",
    how: "Welche Unterstützung Sie brauchen, besprechen wir in Ihrer Beratung – passend zu Ihrer Stadt, Ihrem Zeitplan und Ihrem Budget.",
    serviceName: "Orientierung für Ankunft und Start in Deutschland",
  },
};

const journeyIcons: IconName[] = ["globe", "luggage", "plane", "home", "file", "send", "compass"];

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/student-support", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function StudentSupportPage() {
  await connection();
  const [{ locale, t }, site] = await Promise.all([getUi(), getSite()]);
  const c = copy[locale];
  const areas = getSupportAreas(locale);
  const steps = t.supportTeaser.steps;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: c.serviceName,
    description: c.description,
    url: `${site.url}${lp(locale, "/student-support")}`,
    provider: orgRef(site),
    areaServed: { "@type": "Country", name: "Germany" },
    inLanguage: locale,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c") }} />
      <PageHeader crumbs={[{ name: c.eyebrow, path: "/student-support" }]} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} />

      {/* Journey */}
      <section aria-labelledby="journey" className="relative isolate overflow-hidden bg-navy-950 py-24 text-ivory md:py-32">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(194,154,82,.14),transparent_70%)]" />
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow flex items-center justify-center gap-3 text-gold-300">
              <span className="h-px w-8 bg-gold-300/60" aria-hidden /> {c.journeyEyebrow}
            </p>
            <h2 id="journey" className="mt-5 text-[clamp(2.4rem,4.8vw,4rem)] leading-[1.02]">
              {c.journeyTitle}
            </h2>
          </Reveal>
          <ol className="relative mx-auto mt-16 grid max-w-6xl gap-4 lg:grid-cols-7 lg:gap-0">
            <span aria-hidden className="absolute left-[2.1rem] top-0 h-full w-px bg-gradient-to-b from-gold-300/10 via-gold-300/50 to-gold-300/10 lg:left-0 lg:right-0 lg:top-[2.1rem] lg:h-px lg:w-full lg:bg-gradient-to-r" />
            {steps.map((s, i) => (
              <Reveal as="li" key={s} delay={i * 80} className="relative flex items-center gap-5 lg:flex-col lg:text-center">
                <span className="relative z-10 inline-flex size-[4.2rem] shrink-0 items-center justify-center rounded-full border border-gold-300/40 bg-navy-900 text-gold-300 shadow-[0_0_0_8px_rgba(5,13,28,1),0_20px_40px_-20px_rgba(194,154,82,.5)]">
                  <Icon name={journeyIcons[i] ?? "check"} className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.62rem] font-semibold tracking-[0.22em] text-navy-300 lg:mt-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block font-display text-2xl leading-tight lg:text-xl">{s}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Areas */}
      <section aria-labelledby="areas" className="bg-ivory py-24 md:py-32">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <p className="eyebrow flex items-center gap-3 text-gold-600">
              <span className="h-px w-8 bg-gold-600/60" aria-hidden /> {c.areasEyebrow}
            </p>
            <h2 id="areas" className="mt-5 text-[clamp(2.4rem,4.8vw,4rem)] leading-[1.02] text-navy-900">
              {c.areasTitle}
            </h2>
          </Reveal>
          <ul className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {areas.map((a, i) => (
              <Reveal as="li" key={a.id} delay={(i % 4) * 70} className="h-full">
                <article
                  id={a.id}
                  className="group relative flex h-full scroll-mt-28 flex-col rounded-3xl border border-navy-900/10 bg-white p-7 shadow-[0_1px_0_rgba(255,255,255,.8)_inset] transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_40px_70px_-45px_rgba(5,13,28,.5)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-navy-950 text-gold-300 shadow-[0_18px_30px_-18px_rgba(5,13,28,.8)] transition-transform duration-500 group-hover:-rotate-3">
                      <span aria-hidden className="absolute inset-1 rounded-xl border border-gold-300/20" />
                      <Icon name={a.icon} className="relative size-6" />
                    </span>
                    <span className="font-display text-2xl text-navy-900/20">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-6 text-[1.7rem] leading-tight text-navy-900 [hyphens:auto]">{a.title}</h3>
                  <p className="mt-3 leading-relaxed text-stone">{a.intro}</p>
                  <ul className="mt-5 space-y-2.5 border-t border-navy-900/10 pt-5">
                    {a.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm leading-relaxed text-navy-900/80">
                        <Icon name="check" className="mt-0.5 size-4 shrink-0 text-gold-600" /> {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </ul>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-3xl border border-gold-500/30 bg-sand/60 p-8 md:p-10">
              <p className="eyebrow flex items-center gap-2 text-gold-600">
                <Icon name="shield" className="size-4" /> {c.honestTitle}
              </p>
              <p className="mt-4 leading-relaxed text-navy-900/85">{c.honest}</p>
            </Reveal>
            <Reveal delay={100} className="rounded-3xl bg-navy-950 p-8 text-ivory md:p-10">
              <p className="eyebrow text-gold-300">{c.howTitle}</p>
              <p className="mt-4 leading-relaxed text-ivory/80">{c.how}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <ConsultationCTA defaultDestination="Germany" />
    </>
  );
}
