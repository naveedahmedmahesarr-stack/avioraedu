import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { getLocale } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { pageMeta } from "@/i18n/meta";
import { legalDocs } from "./docs";

const copy = {
  en: {
    title: "Legal Information",
    description: "Legal notice, privacy policy, terms, disclaimer and information about AVIORA EDU's planned presence in Karachi, Pakistan.",
    eyebrow: "Legal",
    h1: "Legal information.",
    intro: "Everything in one place: our legal notice and privacy policy for Germany, our terms and disclaimer, and clear information about the planned presence in Karachi.",
    germany: "Germany",
    germanyNote: "AVIORA EDU is based in Berlin. These documents apply to this website and our services.",
    pakistan: "Pakistan",
    pakistanNote: "A Karachi presence is planned and not yet operating. This page explains the current status.",
    draft: "Draft · details pending",
    open: "Open document",
  },
  de: {
    title: "Rechtliche Informationen",
    description: "Impressum, Datenschutzerklärung, AGB, Haftungsausschluss und Informationen zur geplanten Präsenz von AVIORA EDU in Karatschi, Pakistan.",
    eyebrow: "Rechtliches",
    h1: "Rechtliche Informationen.",
    intro: "Alles an einem Ort: Impressum und Datenschutzerklärung für Deutschland, unsere AGB und Hinweise sowie klare Informationen zur geplanten Präsenz in Karatschi.",
    germany: "Deutschland",
    germanyNote: "AVIORA EDU hat seinen Sitz in Berlin. Diese Dokumente gelten für diese Website und unsere Leistungen.",
    pakistan: "Pakistan",
    pakistanNote: "Eine Präsenz in Karatschi ist geplant und noch nicht in Betrieb. Diese Seite erklärt den aktuellen Stand.",
    draft: "Entwurf · Angaben ausstehend",
    open: "Dokument öffnen",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/legal", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function LegalIndexPage() {
  await connection();
  const locale = await getLocale();
  const c = copy[locale];
  const groups = [
    { key: "de" as const, title: c.germany, note: c.germanyNote },
    { key: "pk" as const, title: c.pakistan, note: c.pakistanNote },
  ];
  return (
    <>
      <PageHeader crumbs={[{ name: c.eyebrow, path: "/legal" }]} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} />
      <section className="bg-ivory py-20 md:py-28">
        <div className="container-x space-y-16">
          {groups.map((g) => (
            <div key={g.key} className="grid gap-8 border-t border-navy-900/15 pt-10 lg:grid-cols-[280px_1fr]">
              <div>
                <h2 className="text-4xl text-navy-900">{g.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-stone">{g.note}</p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {Object.entries(legalDocs)
                  .filter(([, d]) => d.region === g.key)
                  .map(([slug, d]) => (
                    <li key={slug}>
                      <Link
                        href={lp(locale, `/legal/${slug}`)}
                        className="group flex h-full flex-col rounded-3xl border border-navy-900/10 bg-white p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-[0_30px_60px_-40px_rgba(5,13,28,.45)]"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-navy-950 text-gold-300">
                            <Icon name="file" className="size-5" />
                          </span>
                          {d.draft && <span className="rounded-full bg-sand px-2.5 py-1 text-[0.68rem] font-semibold text-gold-600">{c.draft}</span>}
                        </span>
                        <span className="mt-5 block font-display text-2xl leading-tight text-navy-900">{d.title[locale]}</span>
                        <span className="mt-2 block flex-1 text-sm leading-relaxed text-stone">{d.summary[locale]}</span>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 group-hover:text-gold-600">
                          {c.open} <Icon name="arrowRight" className="size-4" />
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
