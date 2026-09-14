import type { Metadata } from "next";
import { lp, ogLocale, type Locale } from "./locales";

type Localized = Record<Locale, string>;

/**
 * Per-page metadata for both languages: self-referencing canonical, hreflang alternates
 * (en, de, x-default) and Open Graph / Twitter tags in the page language.
 */
export function pageMeta(locale: Locale, path: string, title: Localized | string, description: Localized | string, opts: { type?: "website" | "article"; robots?: Metadata["robots"] } = {}): Metadata {
  const t = typeof title === "string" ? title : title[locale];
  const d = typeof description === "string" ? description : description[locale];
  const canonical = lp(locale, path);
  // A page-level openGraph/twitter object replaces the parent's, which drops the root opengraph-image.
  // Setting the shared brand card explicitly keeps a preview image on every page (resolved via metadataBase).
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: "AVIORA EDU — Study in Germany & Europe", type: "image/png" };
  return {
    title: t,
    description: d,
    alternates: { canonical, languages: { en: path, de: lp("de", path), "x-default": path } },
    openGraph: {
      type: opts.type ?? "website",
      siteName: "AVIORA EDU",
      title: t,
      description: d,
      url: canonical,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[locale === "de" ? "en" : "de"]],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: t, description: d, images: [image] },
    ...(opts.robots ? { robots: opts.robots } : {}),
  };
}
