import type { Locale } from "@/i18n/locales";
import { guides, type Guide } from "./guides";

/** German versions of the guides. Facts match the English guides; links point to German official pages where available. */
const de: Record<string, Omit<Guide, "slug" | "reviewed" | "relatedService">> = {
  "germany-student-visa": {
    title: "Studentenvisum für Deutschland: Voraussetzungen und Ablauf",
    metaTitle: "Studentenvisum Deutschland: Voraussetzungen",
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
    metaTitle: "Chancenkarte Deutschland: Überblick",
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
    metaTitle: "Ausbildung in Deutschland: So funktioniert sie",
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
  "blocked-account-germany": {
    title: "Sperrkonto für das Studium in Deutschland",
    metaTitle: "Sperrkonto für Studierende in Deutschland",
    description:
      "Was ein Sperrkonto ist, warum für das Studentenvisum meist ein Finanzierungsnachweis nötig ist, wie die Auszahlung abläuft und welche Alternativen es gibt.",
    eyebrow: "Ratgeber · Sperrkonto",
    intro:
      "Für ein Studentenvisum müssen Sie in der Regel nachweisen, dass Ihr Lebensunterhalt gesichert ist. Viele Studierende nutzen dafür ein Sperrkonto. Dieser Ratgeber erklärt den Ablauf ohne Beträge, die sich ändern – prüfen Sie den aktuellen Betrag immer bei den offiziellen Quellen unten.",
    sections: [
      {
        heading: "Was ist ein Sperrkonto?",
        body: [
          "Ein Sperrkonto ist ein spezielles Konto für internationale Studierende. Sie zahlen den für ein Jahr erforderlichen Betrag vor dem Visumantrag ein. Nach der Ankunft in Deutschland wird Ihnen monatlich ein fester Betrag ausgezahlt, sodass das Geld Ihren Lebensunterhalt über die Zeit deckt.",
          "Es ist einer der häufigsten Wege, den Finanzierungsnachweis zu erbringen, den deutsche Auslandsvertretungen für Studentenvisa verlangen.",
        ],
      },
      {
        heading: "Wie viel Geld ist erforderlich?",
        body: [
          "Der erforderliche Betrag wird von der Bundesregierung festgelegt und von Zeit zu Zeit angepasst. Weil er sich ändert, nennen wir hier keine Zahl. Prüfen Sie den aktuellen Betrag auf der Website des Auswärtigen Amts oder der für Sie zuständigen deutschen Auslandsvertretung, bevor Sie ein Konto eröffnen.",
        ],
      },
      {
        heading: "Der Ablauf Schritt für Schritt",
        body: [],
        bullets: [
          "Einen Anbieter wählen, den die zuständige deutsche Auslandsvertretung akzeptiert",
          "Das Konto online eröffnen und die Identitätsprüfung abschließen",
          "Den erforderlichen Betrag überweisen – internationale Überweisungen können mehrere Tage dauern",
          "Die Bestätigung erhalten und dem Visumantrag beilegen",
          "Nach der Ankunft: Auszahlungen auf ein deutsches Bankkonto aktivieren und den monatlichen Betrag erhalten",
        ],
      },
      {
        heading: "Alternativen zum Sperrkonto",
        body: ["Je nach Situation akzeptieren deutsche Auslandsvertretungen auch andere Finanzierungsnachweise, zum Beispiel:"],
        bullets: [
          "Eine Verpflichtungserklärung einer in Deutschland lebenden Person",
          "Einen Stipendiennachweis, der den Lebensunterhalt abdeckt",
        ],
      },
      {
        heading: "Häufige Fehler vermeiden",
        body: [],
        bullets: [
          "Weniger als den vollen aktuellen Betrag überweisen",
          "Zu lange warten – Konto und Überweisung sollten vor dem Visumtermin abgeschlossen sein",
          "Einen Anbieter nutzen, den die zuständige Auslandsvertretung nicht akzeptiert",
          "Sperrkonto und Krankenversicherung verwechseln – die Versicherung ist eine eigene Voraussetzung",
        ],
      },
    ],
    faqs: [
      {
        q: "Ist ein Sperrkonto für das Studentenvisum Pflicht?",
        a: "Nicht immer. Es ist der häufigste Finanzierungsnachweis, aber Auslandsvertretungen können Alternativen wie eine Verpflichtungserklärung oder ein Stipendium akzeptieren. Prüfen Sie die Anforderungen der für Sie zuständigen Vertretung.",
      },
      {
        q: "Kann AVIORA EDU ein Sperrkonto für mich eröffnen?",
        a: "Nein. Sie eröffnen das Konto selbst bei einem Anbieter. Wir erklären, wie der Finanzierungsnachweis in Ihren Visumantrag passt, und helfen Ihnen, vollständige Unterlagen vorzubereiten.",
      },
      {
        q: "Wann sollte ich ein Sperrkonto eröffnen?",
        a: "Sobald Sie Ihre Zulassung haben – oder früher, wenn Ihr Visumtermin bald ist. Kontoeröffnung und Überweisung können Zeit brauchen.",
      },
    ],
    sources: [
      { label: "Auswärtiges Amt – Visa und Aufenthalt", url: "https://www.auswaertiges-amt.de/de/service/visa-und-aufenthalt" },
      { label: "DAAD – Studium planen (englisch)", url: "https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/" },
    ],
  },
  "public-vs-private-universities-germany": {
    title: "Staatliche und private Hochschulen in Deutschland",
    metaTitle: "Staatliche vs. private Hochschulen",
    description:
      "Wie sich staatliche und private Hochschulen bei Studiengebühren, Anerkennung, Zulassung und Studienangebot unterscheiden – und was Sie prüfen sollten.",
    eyebrow: "Ratgeber · Hochschulen",
    intro:
      "In Deutschland gibt es staatliche und private Hochschulen. Beide können anerkannte Abschlüsse verleihen, unterscheiden sich aber bei Kosten, Größe und Bewerbung. Dieser Ratgeber erklärt die Unterschiede, damit Sie eine realistische Auswahl treffen können.",
    sections: [
      {
        heading: "Staatliche Hochschulen",
        body: [
          "Die meisten Studierenden in Deutschland sind an staatlichen Hochschulen eingeschrieben, die von den Bundesländern finanziert werden. An den meisten staatlichen Hochschulen fallen für Bachelor- und viele Masterstudiengänge keine Studiengebühren an; alle Studierenden zahlen jedoch einen Semesterbeitrag für Verwaltung und oft ein Semesterticket.",
          "Es gibt Ausnahmen: Einige Bundesländer erheben für bestimmte Gruppen Studiengebühren. Baden-Württemberg etwa verlangt von den meisten Studierenden aus Nicht-EU-Staaten Gebühren. Prüfen Sie immer die aktuellen Regeln der Hochschule und des Bundeslandes.",
        ],
      },
      {
        heading: "Private Hochschulen",
        body: [
          "Private Hochschulen finanzieren sich überwiegend über Studiengebühren. Sie sind oft kleiner, bieten mitunter mehr englischsprachige Studiengänge und teils flexiblere Starttermine.",
          "Prüfen Sie vor der Bewerbung, ob die Hochschule staatlich anerkannt ist. Abschlüsse staatlich anerkannter privater Hochschulen sind rechtlich gleichwertig mit denen staatlicher Hochschulen.",
        ],
      },
      {
        heading: "Die wichtigsten Unterschiede",
        body: [],
        bullets: [
          "Kosten: Staatliche Hochschulen erheben selten Studiengebühren, private in der Regel schon",
          "Anerkennung: Staatliche Hochschulen sind automatisch anerkannt, private müssen staatlich anerkannt sein",
          "Zulassung: Beliebte staatliche Studiengänge sind oft sehr gefragt; private Hochschulen haben meist eigene Auswahlverfahren",
          "Größe: Staatliche Hochschulen sind oft groß, private lehren meist in kleineren Gruppen",
        ],
      },
      {
        heading: "Anerkennung prüfen und Studiengänge finden",
        body: [
          "Der Hochschulkompass der Hochschulrektorenkonferenz listet staatliche und staatlich anerkannte Hochschulen mit ihren Studiengängen. Für englischsprachige Studiengänge sind die Informationen des DAAD ein guter Ausgangspunkt.",
        ],
      },
      {
        heading: "Was passt zu Ihnen?",
        body: [
          "Wenn die Kosten entscheidend sind und Ihr Profil wettbewerbsfähig ist, sind staatliche Hochschulen meist die erste Wahl. Brauchen Sie einen bestimmten englischsprachigen Studiengang, einen flexiblen Studienbeginn oder kleinere Gruppen, kann eine staatlich anerkannte private Hochschule sinnvoll sein.",
          "Für ein Studentenvisum brauchen Sie eine Zulassung an einer anerkannten Hochschule und müssen die Visumvoraussetzungen erfüllen, einschließlich des Finanzierungsnachweises.",
        ],
      },
    ],
    faqs: [
      {
        q: "Sind Abschlüsse privater Hochschulen in Deutschland anerkannt?",
        a: "Abschlüsse staatlich anerkannter privater Hochschulen sind rechtlich gleichwertig mit denen staatlicher Hochschulen. Prüfen Sie die Anerkennung vor der Bewerbung im Hochschulkompass.",
      },
      {
        q: "Ist das Studium an einer staatlichen Hochschule kostenlos?",
        a: "An den meisten staatlichen Hochschulen fallen für die meisten Studiengänge keine Studiengebühren an. Sie zahlen aber einen Semesterbeitrag, und einige Bundesländer erheben Gebühren für bestimmte internationale Studierende. Prüfen Sie die Regeln Ihrer Hochschule.",
      },
      {
        q: "Arbeitet AVIORA EDU mit bestimmten Hochschulen zusammen?",
        a: "Wir beraten zu staatlichen und staatlich anerkannten privaten Hochschulen passend zu Ihrem Profil. Partnerschaften mit Hochschulen behaupten wir nicht.",
      },
    ],
    sources: [
      { label: "Hochschulkompass – Hochschulrektorenkonferenz", url: "https://www.hochschulkompass.de" },
      { label: "DAAD – Studium planen (englisch)", url: "https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/" },
    ],
  },
  "studienkolleg-germany": {
    title: "Studienkolleg: Vorbereitung auf das Studium in Deutschland",
    metaTitle: "Studienkolleg in Deutschland erklärt",
    description:
      "Was ein Studienkolleg ist, wer es braucht, welche Kursarten es gibt und wie Feststellungsprüfung und Bewerbung für internationale Studierende ablaufen.",
    eyebrow: "Ratgeber · Studienkolleg",
    intro:
      "Wenn Ihr Schulabschluss keinen direkten Zugang zu einer deutschen Hochschule ermöglicht, kann ein Studienkolleg Ihr Weg ins Studium sein. Dieser Ratgeber erklärt, wer eines braucht, wie die Kurse funktionieren und was Sie vorbereiten sollten.",
    sections: [
      {
        heading: "Was ist ein Studienkolleg?",
        body: [
          "Ein Studienkolleg ist ein Vorbereitungskurs für internationale Bewerberinnen und Bewerber, deren Schulabschluss nicht als gleichwertig mit der deutschen Hochschulzugangsberechtigung anerkannt ist. Er bereitet auf das Studium in Ihrem Fachbereich vor und dauert in der Regel zwei Semester.",
        ],
      },
      {
        heading: "Wer braucht ein Studienkolleg?",
        body: [
          "Ob Sie eines brauchen, hängt von Ihrem Schulabschluss, Ihrem Herkunftsland und teils von einem bisherigen Studium ab. Manche können direkt an die Hochschule, etwa nach einem teilweise abgeschlossenen Studium im Heimatland.",
          "Die Datenbank anabin und die Zulassungsinformationen des DAAD zeigen, wie Abschlüsse aus vielen Ländern bewertet werden. Die endgültige Entscheidung trifft die Hochschule, an der Sie sich bewerben.",
        ],
      },
      {
        heading: "Kursarten",
        body: ["Die Kurse richten sich nach dem geplanten Studienfach. Übliche Kursarten sind:"],
        bullets: [
          "T-Kurs – technische, mathematische und naturwissenschaftliche Fächer",
          "M-Kurs – medizinische, biologische und pharmazeutische Fächer",
          "W-Kurs – wirtschafts- und sozialwissenschaftliche Fächer",
          "G-Kurs – geisteswissenschaftliche Fächer und Germanistik",
          "S-Kurs – Sprachen",
        ],
      },
      {
        heading: "Die Feststellungsprüfung",
        body: [
          "Der Kurs endet mit der Feststellungsprüfung. Wer sie besteht, erhält Zugang zu Studiengängen im Fachbereich des Kurses.",
        ],
      },
      {
        heading: "Zulassung und Sprachanforderungen",
        body: [
          "Für ein Studienkolleg bewerben Sie sich meist über eine Hochschule oder direkt beim Studienkolleg und legen eine Aufnahmeprüfung ab, die in der Regel Deutsch und oft Mathematik prüft. Der Unterricht findet auf Deutsch statt, gute Deutschkenntnisse sind daher unerlässlich.",
          "Staatliche Studienkollegs erheben in der Regel keine Studiengebühren, ein Semesterbeitrag fällt aber an. Private Anbieter verlangen Gebühren.",
        ],
      },
    ],
    faqs: [
      {
        q: "Wird im Studienkolleg auf Englisch unterrichtet?",
        a: "An staatlichen Studienkollegs wird auf Deutsch unterrichtet. Wenn Sie auf Englisch studieren möchten, prüfen Sie, ob Ihr Abschluss eine direkte Zulassung zu einem englischsprachigen Studiengang ermöglicht.",
      },
      {
        q: "Bekomme ich für ein Studienkolleg ein Studentenvisum?",
        a: "Studienvorbereitende Maßnahmen wie ein Studienkolleg können ein Zweck des Studentenvisums sein. Prüfen Sie die aktuellen Voraussetzungen bei der für Sie zuständigen deutschen Auslandsvertretung.",
      },
      {
        q: "Hilft AVIORA EDU bei Fragen zum Studienkolleg?",
        a: "Wir schätzen ein, ob Sie voraussichtlich ein Studienkolleg brauchen, und erklären Ihre Möglichkeiten. Über die Zulassung entscheiden Studienkolleg und Hochschule.",
      },
    ],
    sources: [
      { label: "anabin – Anerkennung ausländischer Abschlüsse (KMK)", url: "https://anabin.kmk.org" },
      { label: "DAAD – Studium planen (englisch)", url: "https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/" },
    ],
  },
};

export const getGuides = (locale: Locale): Guide[] => guides.map((g) => (locale === "de" && de[g.slug] ? { ...g, ...de[g.slug] } : g));
export const getGuideLocalized = (slug: string, locale: Locale) => getGuides(locale).find((g) => g.slug === slug) ?? null;
