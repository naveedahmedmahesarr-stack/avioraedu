import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { Icon } from "@/components/ui/Icon";
import { guides as guidesEn } from "@/lib/content/guides";
import { getGuideLocalized, getGuides } from "@/lib/content/guides.de";
import { getSite, orgRef } from "@/lib/site";
import { getLocale, getUi } from "@/i18n/server";
import { dateLocale, lp } from "@/i18n/locales";
import { pageMeta } from "@/i18n/meta";

export function generateStaticParams() {
  return guidesEn.map((g) => ({ slug: g.slug }));
}

const copy = {
  en: { guides: "Guides", nextStep: "Next step", instead: "Considering study instead?", studyCta: "Get guidance for your German university application.", compareCta: "Compare university pathways in Germany with a consultation.", process: "How our process works", studyIn: "Study in Germany", notFound: "Guide not found" },
  de: { guides: "Ratgeber", nextStep: "Nächster Schritt", instead: "Doch lieber studieren?", studyCta: "Lassen Sie sich bei Ihrer Bewerbung an einer deutschen Hochschule beraten.", compareCta: "Vergleichen Sie in einer Beratung die Studienwege in Deutschland.", process: "So funktioniert unser Ablauf", studyIn: "Studium in Deutschland", notFound: "Ratgeber nicht gefunden" },
};

export async function generateMetadata(props: PageProps<"/guides/[slug]">): Promise<Metadata> {
  await connection();
  const [{ slug }, locale] = await Promise.all([props.params, getLocale()]);
  const g = getGuideLocalized(slug, locale);
  if (!g) return { title: copy[locale].notFound };
  return pageMeta(locale, `/guides/${g.slug}`, g.metaTitle, g.description, { type: "article" });
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  await connection();
  const [{ slug }, { locale, t }] = await Promise.all([props.params, getUi()]);
  const g = getGuideLocalized(slug, locale);
  if (!g) notFound();
  const c = copy[locale];

  const site = await getSite();
  const url = `${site.url}${lp(locale, `/guides/${g.slug}`)}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: g.title,
      description: g.description,
      dateModified: g.reviewed,
      inLanguage: locale,
      mainEntityOfPage: url,
      author: orgRef(site),
      publisher: orgRef(site),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: g.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  const others = getGuides(locale).filter((o) => o.slug !== g.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader
        crumbs={[
          { name: c.guides, path: "/guides" },
          { name: g.title, path: `/guides/${g.slug}` },
        ]}
        eyebrow={g.eyebrow}
        title={g.title}
        intro={g.intro}
      />
      <article className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_320px]">
          <div className="prose-legal max-w-3xl">
            <p className="!mt-0 text-sm text-stone">
              {t.common.lastReviewed}: <time dateTime={g.reviewed}>{new Date(g.reviewed).toLocaleDateString(dateLocale[locale], { day: "numeric", month: "long", year: "numeric" })}</time>. {t.common.rulesChange}
            </p>
            {g.sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.bullets && (
                  <ul className="list-disc pl-6">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <section>
              <h2>{t.common.faq}</h2>
              {g.faqs.map((f) => (
                <div key={f.q} className="mt-6">
                  <h3 className="font-display text-2xl text-navy-900">{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>
            <section>
              <h2>{t.common.sources}</h2>
              <ul className="list-disc pl-6">
                {g.sources.map((s) => (
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
              <p className="eyebrow text-gold-300">{g.relatedService === "study" ? c.nextStep : c.instead}</p>
              <p className="mt-3 font-display text-2xl leading-snug">{g.relatedService === "study" ? c.studyCta : c.compareCta}</p>
              <Link href={lp(locale, "/contact#consultation")} className="btn btn-gold mt-6 w-full">
                {t.nav.book}
              </Link>
            </div>
            <nav aria-label={t.common.related} className="rounded-3xl border border-navy-900/10 bg-white p-7">
              <p className="eyebrow text-gold-600">{t.common.related}</p>
              <ul className="mt-4 space-y-3 text-sm">
                {[{ href: "/study-in-germany", label: c.studyIn }, { href: "/how-it-works", label: c.process }, ...others.map((o) => ({ href: `/guides/${o.slug}`, label: o.title }))].map((x) => (
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
      <ConsultationCTA defaultDestination="Germany" />
    </>
  );
}
