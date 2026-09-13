import { CitySkyline } from "@/components/brand/CitySkyline";
import { siteConfig } from "@/lib/config";

export function PageHeader({
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
  /** Breadcrumb trail after Home, e.g. [{ name: "Destinations", path: "/destinations" }] — emitted as BreadcrumbList structured data. */
  crumbs?: { name: string; path: string }[];
}) {
  const base = siteConfig.url.replace(/\/$/, "");
  const breadcrumbJsonLd = crumbs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: `${base}${c.path === "/" ? "" : c.path}`,
        })),
      }
    : null;
  return (
    <header className="relative overflow-hidden bg-navy-950 pb-20 pt-40 text-ivory md:pb-28 md:pt-48">
      {breadcrumbJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      )}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_80%_at_80%_0%,rgba(194,154,82,.18),transparent_60%)]" />
      <CitySkyline code={skyline} className="pointer-events-none absolute -bottom-2 right-0 w-[min(760px,90vw)] text-gold-400/25" />
      <div className="container-x relative">
        <p className="eyebrow animate-fade-up flex items-center gap-3 text-gold-300">
          <span className="h-px w-10 bg-gold-300/60" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="animate-fade-up mt-6 max-w-4xl text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.98]" style={{ animationDelay: "120ms" }}>
          {title}
        </h1>
        {intro ? (
          <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-navy-300" style={{ animationDelay: "240ms" }}>
            {intro}
          </p>
        ) : null}
      </div>
    </header>
  );
}
