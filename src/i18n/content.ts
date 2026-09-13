import type { Locale } from "./locales";

/**
 * Admin-managed content stores German next to English in `<field>De` properties
 * (e.g. description / descriptionDe). For German pages, filled German fields replace
 * the English ones; empty German fields fall back to English.
 */
export function tr<T extends object>(item: T, locale: Locale): T {
  if (locale !== "de") return item;
  const src = item as Record<string, unknown>;
  const out: Record<string, unknown> = { ...src };
  for (const key of Object.keys(src)) {
    if (key.endsWith("De")) continue;
    const de = src[`${key}De`];
    if ((typeof de === "string" && de.trim()) || (Array.isArray(de) && de.length > 0)) out[key] = de;
  }
  return out as T;
}

export const trAll = <T extends object>(items: T[], locale: Locale) => items.map((i) => tr(i, locale));

/** Display labels for stored English values (filters, countries, levels). Stored values stay English. */
const terms: Record<string, string> = {
  Germany: "Deutschland",
  Italy: "Italien",
  Poland: "Polen",
  Portugal: "Portugal",
  Austria: "Österreich",
  Pakistan: "Pakistan",
  India: "Indien",
  Bangladesh: "Bangladesch",
  "United Arab Emirates": "Vereinigte Arabische Emirate",
  "Saudi Arabia": "Saudi-Arabien",
  Qatar: "Katar",
  Oman: "Oman",
  Bahrain: "Bahrain",
  Other: "Anderes Land",
  "Not sure yet": "Noch unsicher",
  "Not decided": "Noch offen",
  Engineering: "Ingenieurwissenschaften",
  "Computer Science": "Informatik",
  Business: "Wirtschaft",
  Architecture: "Architektur",
  Design: "Design",
  "Natural Sciences": "Naturwissenschaften",
  "Medicine & Health": "Medizin & Gesundheit",
  "Social Sciences": "Sozialwissenschaften",
  Foundation: "Studienkolleg",
  Bachelor: "Bachelor",
  Master: "Master",
  PhD: "Promotion",
  English: "Englisch",
  German: "Deutsch",
  Italian: "Italienisch",
  Polish: "Polnisch",
  Portuguese: "Portugiesisch",
  Public: "Staatlich",
  Private: "Privat",
  Munich: "München",
  Vienna: "Wien",
  Milan: "Mailand",
  Warsaw: "Warschau",
  Lisbon: "Lissabon",
  Cologne: "Köln",
  Rome: "Rom",
  Padua: "Padua",
  "Kraków": "Krakau",
};

export const term = (value: string, locale: Locale) => (locale === "de" ? (terms[value] ?? value) : value);
