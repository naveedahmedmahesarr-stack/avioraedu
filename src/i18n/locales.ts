/**
 * Locale routing. English lives at the root ("/about"), German under "/de" ("/de/about").
 * src/proxy.ts rewrites "/de/*" onto the same routes and sets LOCALE_HEADER, so every page
 * exists once and renders in either language.
 */
export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_HEADER = "x-aviora-locale";

export const isLocale = (v: unknown): v is Locale => v === "en" || v === "de";

/** Localized href: lp("de", "/about") → "/de/about"; external links and anchors are untouched. */
export function lp(locale: Locale, path: string) {
  if (locale === "en" || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === "/") return "/de";
  if (path.startsWith("/#") || path.startsWith("/?")) return `/de${path.slice(1)}`;
  return `/de${path}`;
}

/** "/de/about" → { locale: "de", path: "/about" } */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  if (pathname === "/de") return { locale: "de", path: "/" };
  if (pathname.startsWith("/de/")) return { locale: "de", path: pathname.slice(3) };
  return { locale: "en", path: pathname };
}

export const ogLocale: Record<Locale, string> = { en: "en_US", de: "de_DE" };
export const dateLocale: Record<Locale, string> = { en: "en-US", de: "de-DE" };
