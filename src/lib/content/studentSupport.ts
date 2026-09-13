import type { IconName } from "@/components/ui/Icon";
import type { Locale } from "@/i18n/locales";

/**
 * Student Support: guidance and practical orientation for moving to Germany.
 * Wording is deliberately "guidance/support" — landlords, banks, providers and authorities make the decisions.
 */
export type SupportArea = { id: string; icon: IconName; title: string; intro: string; points: string[] };

const areas: Record<Locale, SupportArea[]> = {
  en: [
    {
      id: "pre-departure",
      icon: "luggage",
      title: "Pre-departure support",
      intro: "The weeks before you fly are busy. We help you get the order right.",
      points: ["Travel preparation for Germany", "Guidance on booking flights and travel tickets", "Travel planning around your semester start", "A document checklist for your carry-on", "Departure preparation", "Planning your first days after landing"],
    },
    {
      id: "accommodation",
      icon: "home",
      title: "Accommodation guidance",
      intro: "Finding a room in a German university city takes time. We help you search smarter and avoid common traps.",
      points: ["How to search for student housing", "Understanding the options — dorms, shared flats and private rentals", "What landlords usually ask for", "Preparing your documents for renting in Germany", "Practical tips for spotting unrealistic offers"],
    },
    {
      id: "arrival",
      icon: "plane",
      title: "Arrival support",
      intro: "Landing in a new country is easier with a plan.",
      points: ["Guidance for your airport arrival and onward travel", "Local orientation for your city", "How public transport and tickets work", "A practical checklist for your first day"],
    },
    {
      id: "anmeldung",
      icon: "file",
      title: "Anmeldung (address registration)",
      intro: "Registering your address is one of the first official steps in Germany — and many later steps depend on it.",
      points: ["What the Anmeldung is and why it matters", "How appointments and registration work", "Which documents to prepare, including your landlord's confirmation", "Practical support in understanding each step"],
    },
    {
      id: "bank",
      icon: "briefcase",
      title: "Bank account guidance",
      intro: "A German bank account makes rent, insurance and everyday payments simpler.",
      points: ["Options for opening a German bank account", "Which documents banks usually ask for", "Practical orientation on how accounts and cards work"],
    },
    {
      id: "sim",
      icon: "send",
      title: "SIM & mobile connection",
      intro: "Staying reachable from day one.",
      points: ["Guidance on buying a German SIM card", "Understanding prepaid and contract plans", "Basic setup help so you're connected quickly"],
    },
    {
      id: "settlement",
      icon: "compass",
      title: "Everyday settlement",
      intro: "The small things that make a new city feel manageable.",
      points: ["Essential information for your first weeks", "Public transport orientation", "Local practical information", "Understanding everyday systems — from waste separation to Sunday opening hours", "General settling-in guidance"],
    },
    {
      id: "academic",
      icon: "graduation",
      title: "Academic & student orientation",
      intro: "Getting ready for university life in Germany.",
      points: ["Preparing for your university arrival and enrollment", "Student life orientation", "Practical first steps after arrival", "Understanding important local processes, such as your residence permit appointment"],
    },
  ],
  de: [
    {
      id: "pre-departure",
      icon: "luggage",
      title: "Vorbereitung auf die Abreise",
      intro: "Die Wochen vor dem Flug sind voll. Wir helfen Ihnen, die richtige Reihenfolge einzuhalten.",
      points: ["Reisevorbereitung für Deutschland", "Orientierung bei der Buchung von Flügen und Tickets", "Reiseplanung passend zum Semesterbeginn", "Checkliste für die Unterlagen im Handgepäck", "Vorbereitung auf die Abreise", "Planung der ersten Tage nach der Landung"],
    },
    {
      id: "accommodation",
      icon: "home",
      title: "Orientierung bei der Wohnungssuche",
      intro: "Ein Zimmer in einer deutschen Hochschulstadt zu finden braucht Zeit. Wir helfen Ihnen, gezielter zu suchen und typische Fallen zu vermeiden.",
      points: ["So suchen Sie nach Wohnraum für Studierende", "Die Möglichkeiten verstehen – Wohnheim, WG und private Mietwohnung", "Was Vermieter üblicherweise verlangen", "Unterlagen für die Wohnungssuche in Deutschland vorbereiten", "Praktische Tipps, um unseriöse Angebote zu erkennen"],
    },
    {
      id: "arrival",
      icon: "plane",
      title: "Unterstützung bei der Ankunft",
      intro: "Mit einem Plan kommt man leichter in einem neuen Land an.",
      points: ["Orientierung für Ankunft am Flughafen und Weiterreise", "Erste Orientierung in Ihrer Stadt", "So funktionieren Nahverkehr und Tickets", "Eine praktische Checkliste für den ersten Tag"],
    },
    {
      id: "anmeldung",
      icon: "file",
      title: "Anmeldung (Wohnsitzanmeldung)",
      intro: "Die Anmeldung Ihres Wohnsitzes ist einer der ersten Behördengänge in Deutschland – und viele weitere Schritte hängen davon ab.",
      points: ["Was die Anmeldung ist und warum sie wichtig ist", "Wie Termin und Anmeldung ablaufen", "Welche Unterlagen Sie brauchen, einschließlich der Wohnungsgeberbestätigung", "Praktische Hilfe, jeden Schritt zu verstehen"],
    },
    {
      id: "bank",
      icon: "briefcase",
      title: "Orientierung zum Bankkonto",
      intro: "Ein deutsches Bankkonto erleichtert Miete, Versicherung und alltägliche Zahlungen.",
      points: ["Möglichkeiten zur Eröffnung eines deutschen Bankkontos", "Welche Unterlagen Banken üblicherweise verlangen", "Praktische Orientierung zu Konten und Karten"],
    },
    {
      id: "sim",
      icon: "send",
      title: "SIM-Karte & Mobilfunk",
      intro: "Vom ersten Tag an erreichbar.",
      points: ["Orientierung beim Kauf einer deutschen SIM-Karte", "Prepaid und Vertrag verständlich erklärt", "Hilfe bei der Einrichtung, damit Sie schnell verbunden sind"],
    },
    {
      id: "settlement",
      icon: "compass",
      title: "Ankommen im Alltag",
      intro: "Die kleinen Dinge, die eine neue Stadt überschaubar machen.",
      points: ["Wichtige Informationen für die ersten Wochen", "Orientierung im Nahverkehr", "Praktische Informationen vor Ort", "Alltagssysteme verstehen – von der Mülltrennung bis zu Öffnungszeiten am Sonntag", "Allgemeine Orientierung beim Ankommen"],
    },
    {
      id: "academic",
      icon: "graduation",
      title: "Orientierung für Studium & Studienalltag",
      intro: "Gut vorbereitet ins Studium in Deutschland.",
      points: ["Vorbereitung auf Ankunft an der Hochschule und Einschreibung", "Orientierung im Studierendenleben", "Praktische erste Schritte nach der Ankunft", "Wichtige Abläufe vor Ort verstehen, etwa den Termin für den Aufenthaltstitel"],
    },
  ],
};

export const getSupportAreas = (locale: Locale) => areas[locale];
