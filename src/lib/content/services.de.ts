import type { Locale } from "@/i18n/locales";
import { services, type Service } from "./services";

const de: Record<string, Omit<Service, "slug">> = {
  "profile-and-shortlist": {
    title: "Profilanalyse & Hochschulauswahl",
    summary: "Finden Sie heraus, wo Sie realistisch passen – bevor Sie Geld für Bewerbungen ausgeben.",
    what: "Eine strukturierte Prüfung Ihrer Noten, Abschlüsse, Sprachnachweise und Ihres Budgets anhand der Zulassungsregeln deutscher und europäischer Hochschulen.",
    who: "Schulabgänger und Absolventen, die im Ausland studieren möchten, aber nicht wissen, welche Studiengänge sie zulassen würden.",
    how: [
      "Prüfen, ob Ihr Zeugnis einen direkten Zugang ermöglicht oder ein Studienkolleg nötig ist",
      "Staatliche und private Optionen vergleichen – inklusive der tatsächlichen Gesamtkosten",
      "Eine ausgewogene Auswahl erstellen: ambitionierte, realistische und sichere Optionen",
    ],
    next: { label: "Kostenlose Erstberatung buchen", href: "/contact#consultation" },
  },
  "german-university-admissions": {
    title: "Zulassung an deutschen Hochschulen",
    summary: "Vollständige, korrekte Bewerbungen über Hochschulportale und uni-assist.",
    what: "Praktische Unterstützung bei der Vorbereitung und Einreichung Ihrer Bewerbungen an deutschen Hochschulen – vom Lebenslauf bis zum letzten Upload.",
    who: "Studierende mit einer Auswahlliste, deren Bewerbungen korrekt, fristgerecht und überzeugend sein sollen.",
    how: [
      "Unterlagen-Checkliste pro Studiengang, inklusive Beglaubigungen und Übersetzungen",
      "Feedback zu Lebenslauf und Motivationsschreiben – von Ihnen geschrieben, mit uns geschärft",
      "Fristenüberwachung für Winter- und Sommersemester",
    ],
    next: { label: "Mehr zum Studium in Deutschland", href: "/study-in-germany" },
  },
  "student-visa-preparation": {
    title: "Vorbereitung auf das Studentenvisum",
    summary: "Wissen, was die deutsche Vertretung erwartet – vor Ihrem Termin.",
    what: "Orientierung zum nationalen Visum zu Studienzwecken: Unterlagen, Finanzierungsnachweis, Krankenversicherung und der Termin selbst.",
    who: "Zugelassene Studierende, die ihren Visumantrag vorbereiten – und alle, die die Finanzierung früh planen möchten.",
    how: [
      "Persönliche Unterlagen-Checkliste nach Staatsangehörigkeit und Wohnort",
      "Sperrkonto und Versicherung Schritt für Schritt erklärt",
      "Vorbereitung auf das Gespräch. Die Entscheidung liegt immer bei den Behörden.",
    ],
    next: { label: "Ratgeber Studentenvisum lesen", href: "/guides/germany-student-visa" },
  },
  "pre-departure-and-arrival": {
    title: "Abreise & Ankunft",
    summary: "Die praktischen Wochen zwischen Visum und erster Vorlesung.",
    what: "Vorbereitung auf Reise, Unterkunft und die ersten Behördengänge in Deutschland oder anderswo in Europa.",
    who: "Studierende mit Visum, deren erster Monat ruhig statt chaotisch verlaufen soll.",
    how: [
      "Tipps zur Wohnungssuche und worauf Sie achten sollten",
      "Anmeldung, Bankkonto und Einschreibung verständlich erklärt",
      "Ein Ansprechpartner, wenn etwas Unerwartetes passiert",
    ],
    next: { label: "Zum Studierenden-Service", href: "/student-support" },
  },
  "europe-destinations": {
    title: "Italien, Polen, Portugal & Österreich",
    summary: "Wenn ein anderes europäisches Land besser zu Profil oder Budget passt.",
    what: "Derselbe sorgfältige Ablauf für unsere vier weiteren Studienziele – jeweils mit eigenen Zulassungsregeln und Kosten.",
    who: "Studierende, bei denen Fach, Budget oder Sprachkenntnisse für ein anderes Land als Deutschland sprechen.",
    how: [
      "Direkter Vergleich mit Ihren Optionen in Deutschland",
      "Länderspezifische Orientierung zu Bewerbung und Visum",
      "Ehrliche Einschätzung, ob Deutschland die bessere Wahl ist – oder nicht",
    ],
    next: { label: "Studienziele vergleichen", href: "/destinations" },
  },
  "pathway-advice": {
    title: "Wegberatung: Studium, Ausbildung oder Chancenkarte",
    summary: "Ein ehrliches Gespräch darüber, welcher Weg nach Deutschland zu Ihnen passt.",
    what: "Ein Erstgespräch, das ein Hochschulstudium mit der Ausbildung und der Chancenkarte vergleicht. Anträge für Ausbildung oder Chancenkarte bearbeiten wir nicht; dafür verweisen wir auf die offiziellen Verfahren.",
    who: "Menschen, die unsicher sind, ob ein Studium der richtige Weg nach Deutschland ist.",
    how: [
      "Voraussetzungen und Vor- und Nachteile jedes Weges erklären",
      "Auf die offiziellen Quellen für Wege außerhalb des Studiums verweisen",
      "Volle Unterstützung, wenn sich ein Studium als richtiger Weg herausstellt",
    ],
    next: { label: "Ratgeber Chancenkarte lesen", href: "/guides/germany-opportunity-card" },
  },
};

export const getServices = (locale: Locale): Service[] => services.map((s) => (locale === "de" && de[s.slug] ? { ...s, ...de[s.slug] } : s));
