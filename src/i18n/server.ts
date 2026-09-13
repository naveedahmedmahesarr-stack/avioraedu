import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { LOCALE_HEADER, type Locale } from "./locales";
import { ui } from "./ui";

/** Current request locale, set by src/proxy.ts (incoming copies of the header are stripped there). */
export const getLocale = cache(async (): Promise<Locale> => {
  const h = await headers();
  return h.get(LOCALE_HEADER) === "de" ? "de" : "en";
});

export async function getUi() {
  const locale = await getLocale();
  return { locale, t: ui[locale] };
}
