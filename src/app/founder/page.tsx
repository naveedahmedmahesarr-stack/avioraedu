import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { getSite, orgRef } from "@/lib/site";
import { getUi, getLocale } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { pageMeta } from "@/i18n/meta";
import { tr } from "@/i18n/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { FounderVisual, FounderWordmark } from "@/components/brand/FounderVisual";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CITIES, project, routePath } from "@/lib/globe";

/**
 * Founder page. Uses only facts supplied by the owner (Admin → Team): name, role, location,
 * nationality and experience. No photograph, qualifications or achievements are invented.
 */
const copy = {
  en: {
    title: "Naveed Ahmed – Founder & Education Consultant",
    description: "Meet Naveed Ahmed, founder of AVIORA EDU in Berlin: a German and Pakistani national with more than 10 years of experience in education consultancy.",
    eyebrow: "Founder",
    crumb: "Founder",
    facts: { location: "Based in", nationality: "Nationality", experience: "Experience" },
    storyEyebrow: "Why AVIORA EDU exists",
    storyTitle: "Advice that starts with the truth.",
    story: [
      "Over the years, Naveed has seen the same pattern again and again: capable students losing months — and money — because nobody explained the German system to them clearly, or because they were told what they wanted to hear.",
      "AVIORA EDU is his answer to that. A small, focused consultancy where every student gets an honest first assessment, a plan built on their actual documents, and a contact who is still there once the visa is approved.",
    ],
    perspectiveEyebrow: "Germany · Pakistan",
    perspectiveTitle: "Two countries, one perspective.",
    perspectiveBody:
      "Being both German and Pakistani shapes how Naveed advises. He can explain German requirements in plain terms — and he understands the expectations, costs and family conversations that come with studying abroad from Pakistan and the wider region.",
    principlesEyebrow: "How Naveed works",
    principlesTitle: "Four principles behind every consultation.",
    principles: [
      { icon: "eye", title: "Honest first answers", body: "If Germany isn't realistic for your profile right now, you'll hear it in the first conversation — along with what would change that." },
      { icon: "file", title: "Plans built on your documents", body: "Advice starts with your actual certificates, grades and budget — not with a brochure." },
      { icon: "globe", title: "Both sides of the move", body: "An understanding of what families in Pakistan and the region ask, and of how German institutions work." },
      { icon: "users", title: "Reachable throughout", body: "Students get a contact who replies — before the application, during the visa process and after arrival." },
    ] as { icon: IconName; title: string; body: string }[],
    glanceEyebrow: "At a glance",
    glance: [
      { k: "10+ years", v: "Guiding students through education and study-abroad decisions" },
      { k: "Berlin", v: "Where AVIORA EDU is based" },
      { k: "Germany & Pakistan", v: "German and Pakistani nationality — at home in both systems" },
      { k: "Karachi", v: "A presence in Pakistan is being prepared — opening soon" },
    ],
    note: "AVIORA EDU is an education consultancy, not a law firm. For individual legal advice on residence law, please consult a lawyer admitted in Germany.",
    noteLink: "Read the disclaimer",
    cta: "Book a consultation with Naveed",
  },
  de: {
    title: "Naveed Ahmed – Gründer & Bildungsberater",
    description: "Naveed Ahmed, Gründer von AVIORA EDU in Berlin: deutscher und pakistanischer Staatsangehöriger mit über 10 Jahren Erfahrung in der Bildungsberatung.",
    eyebrow: "Gründer",
    crumb: "Gründer",
    facts: { location: "Sitz", nationality: "Staatsangehörigkeit", experience: "Erfahrung" },
    storyEyebrow: "Warum es AVIORA EDU gibt",
    storyTitle: "Beratung, die mit der Wahrheit beginnt.",
    story: [
      "Über die Jahre hat Naveed immer wieder dasselbe Muster erlebt: Fähige Studierende verlieren Monate – und Geld –, weil ihnen niemand das deutsche System klar erklärt hat oder weil man ihnen nur sagte, was sie hören wollten.",
      "AVIORA EDU ist seine Antwort darauf: eine kleine, fokussierte Beratung, in der jede und jeder eine ehrliche erste Einschätzung bekommt, einen Plan auf Grundlage der tatsächlichen Unterlagen – und einen Ansprechpartner, der auch nach der Visumerteilung noch da ist.",
    ],
    perspectiveEyebrow: "Deutschland · Pakistan",
    perspectiveTitle: "Zwei Länder, eine Perspektive.",
    perspectiveBody:
      "Deutsch und pakistanisch zugleich zu sein, prägt Naveeds Beratung. Er kann deutsche Anforderungen verständlich erklären – und kennt die Erwartungen, Kosten und Familiengespräche, die ein Auslandsstudium aus Pakistan und der Region mit sich bringt.",
    principlesEyebrow: "So arbeitet Naveed",
    principlesTitle: "Vier Grundsätze hinter jeder Beratung.",
    principles: [
      { icon: "eye", title: "Ehrliche erste Antworten", body: "Wenn Deutschland für Ihr Profil gerade nicht realistisch ist, erfahren Sie das im ersten Gespräch – zusammen mit dem, was das ändern würde." },
      { icon: "file", title: "Pläne auf Basis Ihrer Unterlagen", body: "Die Beratung beginnt mit Ihren tatsächlichen Zeugnissen, Noten und Ihrem Budget – nicht mit einer Broschüre." },
      { icon: "globe", title: "Beide Seiten des Weges", body: "Verständnis für die Fragen von Familien in Pakistan und der Region – und für die Arbeitsweise deutscher Institutionen." },
      { icon: "users", title: "Durchgehend erreichbar", body: "Studierende haben einen Ansprechpartner, der antwortet – vor der Bewerbung, während des Visumverfahrens und nach der Ankunft." },
    ] as { icon: IconName; title: string; body: string }[],
    glanceEyebrow: "Auf einen Blick",
    glance: [
      { k: "10+ Jahre", v: "Begleitung von Studierenden bei Bildungs- und Auslandsentscheidungen" },
      { k: "Berlin", v: "Sitz von AVIORA EDU" },
      { k: "Deutschland & Pakistan", v: "Deutsche und pakistanische Staatsangehörigkeit – in beiden Systemen zu Hause" },
      { k: "Karatschi", v: "Eine Präsenz in Pakistan wird vorbereitet – demnächst eröffnet" },
    ],
    note: "AVIORA EDU ist eine Bildungsberatung, keine Rechtsanwaltskanzlei. Für eine individuelle Rechtsberatung zum Aufenthaltsrecht wenden Sie sich bitte an eine in Deutschland zugelassene Rechtsanwältin oder einen Rechtsanwalt.",
    noteLink: "Zum Haftungsausschluss",
    cta: "Beratung mit Naveed buchen",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/founder", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description }, { type: "website" });
}

export default async function FounderPage() {
  await connection();
  const [{ locale, t }, site, team] = await Promise.all([getUi(), getSite(), list("team", { publishedOnly: true })]);
  const c = copy[locale];
  const raw = [...team].sort((a, b) => a.order - b.order)[0];
  const founder = raw ? tr(raw, locale) : null;
  const name = founder?.name ?? "Naveed Ahmed";
  const location = locale === "de" ? site.location.replace("Germany", "Deutschland") : site.location;
  const facts = [
    { label: c.facts.location, value: founder?.location || location },
    { label: c.facts.nationality, value: founder?.nationality ?? "" },
    { label: c.facts.experience, value: founder?.experience ?? "" },
  ].filter((f) => f.value);

  const berlin = project(CITIES.berlin.lon, CITIES.berlin.lat);
  const karachi = project(CITIES.karachi.lon, CITIES.karachi.lat);
  const route = routePath(CITIES.berlin, CITIES.karachi, 0.3);

  const personLd = raw
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: raw.name,
        jobTitle: raw.role,
        description: raw.bio,
        url: `${site.url}${lp(locale, "/founder")}`,
        worksFor: orgRef(site),
        nationality: [
          { "@type": "Country", name: "Germany" },
          { "@type": "Country", name: "Pakistan" },
        ],
        workLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Berlin", addressCountry: "DE" } },
      }
    : null;

  return (
    <>
      {personLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }} />}
      <PageHeader crumbs={[{ name: c.crumb, path: "/founder" }]} eyebrow={c.eyebrow} title={name} intro={founder?.role} />

      {/* Profile */}
      <section aria-labelledby="profile" className="relative overflow-hidden bg-ivory py-24 md:py-32">
        <div className="container-x grid items-center gap-16 lg:grid-cols-[26rem_1fr] lg:gap-20">
          <Reveal className="mx-auto w-full max-w-[26rem]">
            {founder ? <FounderVisual founder={founder} locale={locale} /> : <FounderWordmark name={name} locale={locale} />}
          </Reveal>
          <Reveal delay={120}>
            <h2 id="profile" className="sr-only">
              {name}
            </h2>
            <dl className="grid gap-px overflow-hidden rounded-3xl border border-navy-900/10 bg-navy-900/10 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="bg-white p-6">
                  <dt className="eyebrow !text-[0.62rem] text-stone">{f.label}</dt>
                  <dd className="mt-3 font-display text-2xl leading-tight text-navy-900">{f.value}</dd>
                </div>
              ))}
            </dl>
            {founder?.bio && <p className="mt-10 max-w-2xl font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-snug text-navy-900">{founder.bio}</p>}
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section aria-labelledby="story" className="bg-sand/50 py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-gold-600">
              <span className="h-px w-8 bg-gold-600/60" aria-hidden /> {c.storyEyebrow}
            </p>
            <h2 id="story" className="mt-5 text-[clamp(2.4rem,4.8vw,4rem)] leading-[1.02] text-navy-900">
              {c.storyTitle}
            </h2>
          </Reveal>
          <Reveal delay={100} className="space-y-6 text-lg leading-relaxed text-stone">
            {c.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Germany · Pakistan perspective */}
      <section aria-labelledby="perspective" className="relative isolate overflow-hidden bg-navy-950 py-24 text-ivory md:py-32">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_80%_40%,rgba(194,154,82,.16),transparent_70%)]" />
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-gold-300">
              <span className="h-px w-8 bg-gold-300/60" aria-hidden /> {c.perspectiveEyebrow}
            </p>
            <h2 id="perspective" className="mt-5 text-[clamp(2.4rem,4.8vw,4rem)] leading-[1.02]">
              {c.perspectiveTitle}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-300">{c.perspectiveBody}</p>
          </Reveal>
          <Reveal delay={120} className="[perspective:1400px]">
            <svg viewBox="-200 -200 400 330" aria-hidden className="w-full [transform:rotateX(18deg)]">
              <defs>
                <linearGradient id="fp-route" x1="0" x2="1">
                  <stop offset="0" stopColor="#9fb8dc" />
                  <stop offset="1" stopColor="#f3e2b8" />
                </linearGradient>
              </defs>
              <path d={route} fill="none" stroke="#e7cf9b" strokeOpacity=".25" strokeWidth="6" transform="scale(1.05)" />
              <path d={route} fill="none" stroke="url(#fp-route)" strokeWidth="1.8" pathLength={1} className="route-draw" transform="scale(1.05)" />
              <g transform="scale(1.05)">
                <circle cx={berlin.x} cy={berlin.y} r="5" fill="#cfe0ff" />
                <circle cx={berlin.x} cy={berlin.y} r="12" fill="none" stroke="#cfe0ff" strokeOpacity=".4" className="pulse-ring" />
                <text x={berlin.x - 14} y={berlin.y - 12} textAnchor="end" className="fill-ivory text-[13px] font-semibold tracking-[0.2em]">
                  BERLIN
                </text>
                <circle cx={karachi.x} cy={karachi.y} r="6" fill="#f3e2b8" />
                <circle cx={karachi.x} cy={karachi.y} r="14" fill="none" stroke="#e7cf9b" className="pulse-ring" />
                <text x={karachi.x - 4} y={karachi.y + 30} textAnchor="middle" className="fill-gold-300 text-[13px] font-semibold tracking-[0.2em]">
                  {t.karachi.karachi.toUpperCase()}
                </text>
              </g>
            </svg>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles" className="bg-ivory py-24 md:py-32">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <p className="eyebrow flex items-center gap-3 text-gold-600">
              <span className="h-px w-8 bg-gold-600/60" aria-hidden /> {c.principlesEyebrow}
            </p>
            <h2 id="principles" className="mt-5 text-[clamp(2.4rem,4.8vw,4rem)] leading-[1.02] text-navy-900">
              {c.principlesTitle}
            </h2>
          </Reveal>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-navy-900/10 sm:grid-cols-2">
            {c.principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 70} className="group bg-ivory p-8 transition-colors duration-500 hover:bg-white md:p-10">
                <span className="inline-flex size-12 items-center justify-center rounded-full border border-gold-500/40 text-gold-600 transition-colors group-hover:bg-navy-900 group-hover:text-gold-300">
                  <Icon name={p.icon} />
                </span>
                <h3 className="mt-6 text-3xl text-navy-900">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* At a glance */}
      <section aria-labelledby="glance" className="bg-sand/50 py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <h2 id="glance" className="eyebrow flex items-center gap-3 text-gold-600">
              <span className="h-px w-8 bg-gold-600/60" aria-hidden /> {c.glanceEyebrow}
            </h2>
          </Reveal>
          <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute left-0 right-0 top-3 hidden h-px bg-gradient-to-r from-gold-500/10 via-gold-500/60 to-gold-500/10 md:block" />
            {c.glance.map((g, i) => (
              <Reveal as="li" key={g.k} delay={i * 90} className="relative border-l border-gold-500/40 pl-6 md:border-l-0 md:pl-0">
                <span aria-hidden className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-gold-500 md:relative md:left-0 md:top-0 md:block md:size-6 md:rounded-full md:border md:border-gold-500/50 md:bg-ivory" />
                <p className="font-display text-[clamp(2rem,3.4vw,2.8rem)] leading-none text-navy-900 md:mt-6">{g.k}</p>
                <p className="mt-3 max-w-xs leading-relaxed text-stone">{g.v}</p>
              </Reveal>
            ))}
          </ol>
          <p className="mt-16 max-w-3xl border-t border-navy-900/10 pt-6 text-sm leading-relaxed text-stone">
            {c.note}{" "}
            <Link href={lp(locale, "/legal/disclaimer")} className="text-navy-900 underline underline-offset-4">
              {c.noteLink}
            </Link>
          </p>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
