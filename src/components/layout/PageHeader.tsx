import Link from "next/link";
import { CitySkyline } from "@/components/brand/CitySkyline";
import { getSite } from "@/lib/site";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";

export async function PageHeader({
  eyebrow,
  title,
  intro,
  skyline = "DE",
  crumbs,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  skyline?: string;
  /** Breadcrumb trail after Home (unprefixed paths), e.g. [{ name: "Destinations", path: "/destinations" }] — also emitted as BreadcrumbList. */
  crumbs?: { name: string; path: string }[];
}) {
  const [{ url: base }, { locale, t }] = await Promise.all([getSite(), getUi()]);
  const trail = crumbs?.length ? [{ name: t.nav.home, path: "/" }, ...crumbs] : [];
  const breadcrumbJsonLd = trail.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((c, i) => {
          const p = lp(locale, c.path);
          return { "@type": "ListItem", position: i + 1, name: c.name, item: `${base}${p === "/" ? "" : p}` };
        }),
      }
    : null;
  return (
    <header className="relative overflow-hidden bg-navy-950 pb-20 pt-40 text-ivory md:pb-28 md:pt-48 print:bg-white print:pb-6 print:pt-0 print:text-black">
      {breadcrumbJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_80%_at_80%_0%,rgba(194,154,82,.18),transparent_60%)] print:hidden" />
      <CitySkyline code={skyline} className="pointer-events-none absolute -bottom-2 right-0 w-[min(760px,90vw)] text-gold-400/25 print:hidden" />
      <div className="container-x relative">
        {trail.length ? (
          <nav aria-label={t.common.breadcrumb} className="animate-fade-up mb-8 text-xs text-navy-300 print:hidden">
            <ol className="flex flex-wrap items-center gap-2">
              {trail.map((c, i) => (
                <li key={c.path} className="flex items-center gap-2">
                  {i < trail.length - 1 ? (
                    <>
                      <Link href={lp(locale, c.path)} className="transition-colors hover:text-gold-300">
                        {c.name}
                      </Link>
                      <span aria-hidden>/</span>
                    </>
                  ) : (
                    <span aria-current="page" className="text-ivory/70">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <p className="eyebrow animate-fade-up flex items-center gap-3 text-gold-300 print:text-black">
          <span className="h-px w-10 bg-gold-300/60" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="animate-fade-up mt-6 max-w-4xl text-[clamp(2.6rem,6.6vw,5.6rem)] leading-[0.98] [hyphens:auto]" style={{ animationDelay: "120ms" }}>
          {title}
        </h1>
        {intro ? (
          <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-navy-300 print:text-black" style={{ animationDelay: "240ms" }}>
            {intro}
          </p>
        ) : null}
      </div>
    </header>
  );
}
