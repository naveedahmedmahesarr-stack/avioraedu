import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { PrintButton } from "@/components/ui/PrintButton";
import { Icon } from "@/components/ui/Icon";
import { getSite } from "@/lib/site";
import { getLocale, getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { pageMeta } from "@/i18n/meta";
import { legalDocs } from "../docs";

export function generateStaticParams() {
  return Object.keys(legalDocs).map((doc) => ({ doc }));
}

export async function generateMetadata(props: PageProps<"/legal/[doc]">): Promise<Metadata> {
  await connection();
  const [{ doc }, locale] = await Promise.all([props.params, getLocale()]);
  const d = legalDocs[doc];
  if (!d) return {};
  // Drafts with open items stay out of the index (links still followed) until they are completed.
  return pageMeta(locale, `/legal/${doc}`, d.title[locale], d.summary[locale], d.draft ? { robots: { index: false, follow: true } } : {});
}

export default async function LegalPage(props: PageProps<"/legal/[doc]">) {
  await connection();
  const [{ doc }, { locale, t }, site] = await Promise.all([props.params, getUi(), getSite()]);
  const d = legalDocs[doc];
  if (!d) notFound();
  const sections = d.sections(site, locale);
  const legalLabel = locale === "de" ? "Rechtliches" : "Legal";
  return (
    <>
      <PageHeader crumbs={[{ name: legalLabel, path: "/legal" }, { name: d.title[locale], path: `/legal/${doc}` }]} eyebrow={legalLabel} title={d.title[locale]} intro={d.summary[locale]} />
      <section className="bg-ivory py-16 md:py-24 print:py-0">
        <div className="container-x">
          <article className="mx-auto max-w-3xl rounded-[1.75rem] border border-navy-900/10 bg-white p-6 shadow-[0_40px_80px_-60px_rgba(5,13,28,.5)] sm:p-10 md:p-14 print:border-0 print:p-0 print:shadow-none">
            <header className="flex flex-col gap-4 border-b border-navy-900/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow text-gold-600">{site.name}</p>
                <p className="mt-2 text-sm text-stone">{d.version[locale]}</p>
              </div>
              <PrintButton label={t.common.print} />
            </header>
            {d.draft && (
              <p className="mt-6 rounded-2xl border border-gold-500/30 bg-sand/50 p-4 text-sm text-navy-900 print:border-black">
                <strong>{locale === "de" ? "Entwurf." : "Draft."}</strong>{" "}
                {locale === "de"
                  ? "Markierte Angaben kann nur der Inhaber ergänzen (Admin → Settings). Bitte lassen Sie den finalen Text anwaltlich prüfen."
                  : "Highlighted items need information only the business owner can provide (Admin → Settings). Please have the final text reviewed by a lawyer."}
              </p>
            )}
            <ol className="prose-legal mt-4 [&_a]:text-navy-900 [&_a]:underline [&_a]:underline-offset-4">
              {sections.map((s, i) => (
                <li key={s.h} className="list-none">
                  <h2 className="flex gap-3 [hyphens:auto]">
                    <span className="font-display text-gold-600">{i + 1}.</span>
                    <span>{s.h}</span>
                  </h2>
                  {s.body}
                </li>
              ))}
            </ol>
          </article>
          <p className="mx-auto mt-8 max-w-3xl text-sm print:hidden">
            <Link href={lp(locale, "/legal")} className="inline-flex items-center gap-2 text-navy-900 hover:text-gold-600">
              <Icon name="arrowRight" className="size-4 rotate-180" /> {locale === "de" ? "Alle rechtlichen Informationen" : "All legal information"}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
