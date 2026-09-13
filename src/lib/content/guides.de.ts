import type { Locale } from "@/i18n/locales";
import { guides, type Guide } from "./guides";

/** German versions of the guides. Facts match the English guides; links point to German official pages where available. */
const de: Record<string, Omit<Guide, "slug" | "reviewed" | "relatedService">> = {
  "germany-student-visa": {
    title: "Studentenvisum für Deutschland: Voraussetzungen und Ablauf",
    metaTitle: "Studentenvisum Deutschland: Voraussetzungen & Ablauf",
    description:
      "So funktioniert das Studentenvisum für Deutschland: Zulassung, Sperrkonto, Krankenversicherung, APS wo nötig, die Schritte und die Zeit nach der Ankunft.",
    eyebrow: "Ratgeber · Studentenvisum",
    intro:
      "Die meisten Studierenden aus Nicht-EU-Staaten brauchen vor der Einreise ein nationales Visum zu Studienzwecken. Dieser Ratgeber erklärt die üblichen Voraussetzungen und Schritte, damit Sie sich frühzeitig vorbereiten können.",
    sections: [
      {
        heading: "Wer braucht ein Studentenvisum für Deutschland?",
        body: [
          "Staatsangehörige der EU/des EWR und der Schweiz benötigen für ein Studium in Deutschland kein Visum. Die meisten anderen – etwa aus Pakistan, Indien, Bangladesch, Saudi-Arabien und den VAE – beantragen ein nationales Visum (Typ D) zu Studienzwecken bei der deutschen Botschaft oder dem Konsulat, das für ihren Wohnort zuständig ist.",
          "Prüfen Sie die aktuellen Regeln für Ihre Staatsangehörigkeit immer auf der Website der deutschen Vertretung in Ihrem Land.",
        ],
      },
      {
        heading: "Typische Unterlagen",
        body: ["Die genauen Anforderungen legt die zuständige deutsche Vertretung fest. Häufig verlangt werden:"],
        bullets: [
          "Gültiger Reisepass und ausgefülltes Antragsformular",
          "Zulassungsbescheid einer deutschen Hochschule (oder eines Studienkollegs bzw. eine bedingte Zulassung, wo akzeptiert)",
          "Finanzierungsnachweis – häufig ein Sperrkonto mit dem jährlich von der Bundesregierung festgelegten Betrag oder eine förmliche Verpflichtungserklärung",
          "Nachweis über eine Krankenversicherung",
          "Zeugnisse und, wo erforderlich, Sprachnachweise",
          "APS-Zertifikat für Bewerberinnen und Bewerber aus Ländern mit APS-Verfahren – zum Beispiel Indien",
        ],
      },
      {
        heading: "Die Schritte",
        body: [],
        bullets: [
          "Zulassung sichern (oder ein Visum zur Studienbewerbung beantragen, falls Ihre Vertretung das anbietet)",
          "Finanzierungsnachweis und Krankenversicherung organisieren",
          "Visumtermin früh buchen – an stark nachgefragten Standorten gibt es lange Wartezeiten",
          "Mit vollständigen Unterlagen zum Termin gehen",
          "Nach der Ankunft: Wohnsitz anmelden (Anmeldung) und den Aufenthaltstitel bei der Ausländerbehörde beantragen",
        ],
      },
      {
        heading: "Arbeiten während des Studiums",
        body: [
          "Internationale Studierende dürfen neben dem Studium in begrenztem Umfang arbeiten. Die aktuellen Grenzen veröffentlichen die Bundesregierung und die Bundesagentur für Arbeit – prüfen Sie sie, bevor Sie einen Job annehmen.",
        ],
      },
    ],
    faqs: [
      { q: "Kann AVIORA EDU ein deutsches Studentenvisum garantieren?", a: "Nein. Über das Visum entscheiden allein die deutschen Behörden. Wir helfen Ihnen, die Anforderungen zu verstehen und einen vollständigen, gut organisierten Antrag vorzubereiten." },
      { q: "Wie viel Geld muss auf dem Sperrkonto sein?", a: "Der erforderliche Betrag wird von der Bundesregierung festgelegt und regelmäßig angepasst. Prüfen Sie den aktuellen Betrag beim Auswärtigen Amt oder auf der Website Ihrer deutschen Vertretung, bevor Sie ein Konto eröffnen." },
      { q: "Wann sollte ich das Visum beantragen?", a: "Sobald Sie Ihren Zulassungsbescheid haben. Die Wartezeiten auf Termine sind je nach Land verschieden – ein früher Start ist dringend zu empfehlen." },
    ],
    sources: [
      { label: "Auswärtiges Amt – Visa und Aufenthalt", url: "https://www.auswaertiges-amt.de/de/service/visa-und-aufenthalt" },
      { label: "Make it in Germany – Studium in Deutschland", url: "https://www.make-it-in-germany.com/de/studium-ausbildung/studium-in-deutschland" },
      { label: "DAAD – Studium planen", url: "https://www.daad.de/de/studieren-und-forschen-in-deutschland/" },
    ],
  },
  "germany-opportunity-card": {
    title: "Die Chancenkarte (Opportunity Card) einfach erklärt",
    metaTitle: "Chancenkarte Deutschland (Opportunity Card) – Überblick",
    description:
      "Was die Chancenkarte ist, wer sie beantragen kann, wie das Punktesystem funktioniert und worin sie sich von einem Studium in Deutschland unterscheidet.",
    eyebrow: "Ratgeber · Chancenkarte",
    intro:
      "Mit der Chancenkarte können qualifizierte Fachkräfte aus Nicht-EU-Staaten zur Arbeitssuche nach Deutschland kommen. Das ist ein anderer Weg als ein Studium – dieser Überblick zeigt den Unterschied.",
    sections: [
      {
        heading: "Was ist die Chancenkarte?",
        body: [
          "Die im Juni 2024 eingeführte Chancenkarte ist ein Aufenthaltstitel zur Arbeitssuche für Menschen aus Nicht-EU-Staaten. Sie erlaubt einen befristeten Aufenthalt in Deutschland, um eine qualifizierte Beschäftigung zu suchen, und während der Suche – im gesetzlichen Rahmen – eine Teilzeit- oder Probebeschäftigung.",
        ],
      },
      {
        heading: "Wer kann sie beantragen?",
        body: ["Es gibt zwei Hauptwege:"],
        bullets: [
          "Menschen, deren ausländische Berufs- oder Hochschulqualifikation in Deutschland vollständig anerkannt ist",
          "Menschen mit einer im Herkunftsland anerkannten Qualifikation, die die erforderliche Punktzahl erreichen – etwa für Deutsch- oder Englischkenntnisse, Berufserfahrung, Alter und frühere Aufenthalte in Deutschland – und die grundlegenden Sprach- und Finanzierungsvoraussetzungen erfüllen",
        ],
      },
      {
        heading: "Chancenkarte oder Studium in Deutschland?",
        body: [
          "Die Chancenkarte richtet sich an Menschen, die bereits eine Qualifikation haben und arbeiten möchten. Wer zuerst einen deutschen Abschluss erwerben will, braucht ein Studentenvisum – Absolventinnen und Absolventen deutscher Hochschulen können anschließend einen Aufenthaltstitel zur Arbeitssuche beantragen.",
          "AVIORA EDU konzentriert sich auf Studienwege. Für Anträge auf die Chancenkarte nutzen Sie bitte die unten verlinkten offiziellen Informationen.",
        ],
      },
    ],
    faqs: [
      { q: "Bearbeitet AVIORA EDU Anträge auf die Chancenkarte?", a: "Nein. Unsere Leistungen konzentrieren sich auf ein Hochschulstudium in Deutschland und ausgewählten europäischen Ländern. Diese Seite dient der allgemeinen Information; für Anträge nutzen Sie bitte die offiziellen Quellen." },
      { q: "Kann ich mit der Chancenkarte studieren?", a: "Die Chancenkarte ist für die Arbeitssuche gedacht. Wenn ein Abschluss Ihr Hauptziel ist, beantragen Sie stattdessen ein Studentenvisum." },
    ],
    sources: [
      { label: "Make it in Germany – Chancenkarte", url: "https://www.make-it-in-germany.com/de/visum-aufenthalt/arten/chancenkarte" },
      { label: "Auswärtiges Amt – Visa und Aufenthalt", url: "https://www.auswaertiges-amt.de/de/service/visa-und-aufenthalt" },
    ],
  },
  "ausbildung-germany": {
    title: "Ausbildung in Deutschland: die duale Berufsausbildung erklärt",
    metaTitle: "Ausbildung in Deutschland: duale Berufsausbildung erklärt",
    description:
      "So funktioniert die duale Ausbildung in Deutschland: Betrieb und Berufsschule, Vergütung, Sprachanforderungen, Visum und der Vergleich mit dem Studium.",
    eyebrow: "Ratgeber · Ausbildung",
    intro:
      "Die Ausbildung ist Deutschlands duales Berufsbildungssystem: bezahlte Arbeit in einem Betrieb, kombiniert mit Unterricht an der Berufsschule. Für viele Berufe ist sie eine Alternative zum Studium.",
    sections: [
      {
        heading: "So funktioniert die duale Ausbildung",
        body: [
          "Eine Ausbildung dauert meist zwei bis dreieinhalb Jahre. Auszubildende arbeiten einen Teil der Woche im Ausbildungsbetrieb und lernen den anderen Teil an der Berufsschule; der Betrieb zahlt eine monatliche Ausbildungsvergütung.",
        ],
      },
      {
        heading: "Typische Voraussetzungen für internationale Bewerber",
        body: [],
        bullets: [
          "Ein Ausbildungsvertrag mit einem deutschen Betrieb",
          "Ein als gleichwertig anerkannter Schulabschluss",
          "Deutschkenntnisse – viele Betriebe erwarten ein mittleres Niveau, weil Ausbildung und Berufsschule auf Deutsch stattfinden",
          "Ein Visum zur Berufsausbildung, sofern Ihre Staatsangehörigkeit das erfordert",
        ],
      },
      {
        heading: "Ausbildung oder Studium?",
        body: [
          "Ein Studium führt zu einem akademischen Abschluss und wird im Master oft auch auf Englisch angeboten. Eine Ausbildung führt zu einem anerkannten Berufsabschluss und findet fast immer auf Deutsch statt. Welcher Weg passt, hängt von Ihren Zielen, Ihrer Vorbildung und Ihren Sprachkenntnissen ab.",
          "AVIORA EDU konzentriert sich auf Studienwege. Wenn Sie unsicher sind, welcher Weg zu Ihnen passt, hilft ein Beratungsgespräch, Ihre Studienoptionen zu vergleichen.",
        ],
      },
    ],
    faqs: [
      { q: "Vermittelt AVIORA EDU Ausbildungsplätze?", a: "Nein. Wir konzentrieren uns auf die Hochschulzulassung. Dieser Ratgeber dient der allgemeinen Information, damit Sie die Wege vergleichen können." },
      { q: "Gibt es Ausbildungen auf Englisch?", a: "Selten. Ausbildung und Berufsschule finden in der Regel auf Deutsch statt." },
    ],
    sources: [
      { label: "Make it in Germany – Ausbildung in Deutschland", url: "https://www.make-it-in-germany.com/de/studium-ausbildung/ausbildung-in-deutschland" },
      { label: "Bundesagentur für Arbeit – Ausbildung", url: "https://www.arbeitsagentur.de/bildung/ausbildung" },
    ],
  },
};

export const getGuides = (locale: Locale): Guide[] => guides.map((g) => (locale === "de" && de[g.slug] ? { ...g, ...de[g.slug] } : g));
export const getGuideLocalized = (slug: string, locale: Locale) => getGuides(locale).find((g) => g.slug === slug) ?? null;
