import type { Locale } from "@/i18n/locales";
import { markets, type Market } from "./markets";

/** German versions of the country landing pages (same facts, written for German readers). */
const DAAD_DB = { label: "DAAD – Datenbank zu Zulassungsvoraussetzungen", url: "https://www.daad.de/de/studieren-und-forschen-in-deutschland/studienvoraussetzungen/zulassungsdatenbank/" };
const AA_MISSIONS = { label: "Auswärtiges Amt – Deutsche Auslandsvertretungen", url: "https://www.auswaertiges-amt.de/de/ReiseUndSicherheit/deutsche-auslandsvertretungen" };
const AA_VISA = { label: "Auswärtiges Amt – Visa und Aufenthalt", url: "https://www.auswaertiges-amt.de/de/service/visa-und-aufenthalt" };
const MIIG_STUDY = { label: "Make it in Germany – Studium in Deutschland", url: "https://www.make-it-in-germany.com/de/studium-ausbildung/studium-in-deutschland" };

const GULF =
  "Maßgeblich für die Zulassung ist das Zeugnis, das Sie besitzen – nicht das Land, in dem Sie leben. Britische A-Levels, das IB-Diplom, amerikanische High-School-Abschlüsse sowie indische CBSE/ISC- und pakistanische Zeugnisse werden jeweils nach eigenen deutschen Regeln bewertet. IB-Diplom und A-Levels können einen direkten Hochschulzugang ermöglichen, wenn die Fächerkombination den deutschen Vorgaben entspricht; ein amerikanisches Abschlusszeugnis braucht in der Regel zusätzliche Nachweise wie AP-Prüfungen, SAT-Ergebnisse oder ein bereits begonnenes College-Studium.";

const guarantee = { q: "Garantieren Sie Zulassung oder Visum?", a: "Nein. Hochschulen und deutsche Behörden entscheiden. Wir helfen Ihnen, sich gut vorbereitet zu bewerben." };

const de: Record<string, Omit<Market, "slug" | "iso">> = {
  pakistan: {
    country: "Pakistan",
    inCountry: "Pakistan",
    metaTitle: "Studium in Deutschland aus Pakistan: Zulassung & Visum",
    description:
      "Studium in Deutschland aus Pakistan: Bewertung von HSSC/FSc und pakistanischen Abschlüssen, Studienkolleg und das Studentenvisum aus Islamabad oder Karatschi.",
    h1: "Studieren in Deutschland aus Pakistan",
    intro:
      "Für viele pakistanische Studierende ist Deutschland eine realistische Option – besonders für Masterstudiengänge in Ingenieurwesen, Informatik und Wirtschaft. Die erste Frage ist fast immer dieselbe: Reicht mein Abschluss für ein Studium in Deutschland? So funktioniert es in der Regel.",
    eligibility: [
      "Für einen Bachelor reicht das pakistanische Higher Secondary School Certificate (HSSC/FSc) allein in der Regel nicht für einen direkten Hochschulzugang. Übliche Wege sind ein Studienkolleg (ein Vorbereitungsjahr mit abschließender Feststellungsprüfung) oder ein erfolgreich absolviertes Studium von einem oder mehreren Jahren in einem verwandten Fach in Pakistan.",
      "Für einen Master prüfen deutsche Hochschulen Dauer und Inhalt Ihres Bachelorabschlusses genau. Vierjährige Bachelorabschlüsse lassen sich meist leichter mit den deutschen Anforderungen abgleichen als zweijährige; die Hochschulen vergleichen Ihre Module mit ihren eigenen Zulassungskriterien.",
      "Die Regeln unterscheiden sich je nach Hochschule und Fach. Prüfen Sie Ihr Zeugnis daher immer in der Zulassungsdatenbank des DAAD und in den Anforderungen des jeweiligen Studiengangs.",
    ],
    visa: [
      "Pakistanische Staatsangehörige benötigen ein nationales Visum zu Studienzwecken. Es wird bei der deutschen Auslandsvertretung beantragt, die für Ihren Wohnort in Pakistan zuständig ist.",
      "Planen Sie einen Finanzierungsnachweis (häufig ein Sperrkonto), eine Krankenversicherung, Ihren Zulassungsbescheid und beglaubigte Studienunterlagen ein. Hochschulen und Botschaft können von der Higher Education Commission (HEC) beglaubigte Abschlüsse sowie vom zuständigen Board verifizierte Zeugnisse verlangen.",
      "Termine waren in der Vergangenheit oft knapp. Beantragen Sie Ihr Visum deshalb, sobald Sie eine Zulassung haben.",
    ],
    missions: ["Botschaft der Bundesrepublik Deutschland, Islamabad", "Generalkonsulat der Bundesrepublik Deutschland, Karatschi"],
    notes: [
      { title: "Englischsprachige Masterstudiengänge", body: "Viele pakistanische Bewerberinnen und Bewerber zielen auf englischsprachige Masterprogramme. Die meisten verlangen IELTS oder TOEFL; manche Hochschulen akzeptieren einen Nachweis, dass Ihr bisheriges Studium auf Englisch stattfand – das muss für jeden Studiengang einzeln geprüft werden." },
      { title: "Fristen", body: "Viele Hochschulen beenden die Bewerbungsphase für Nicht-EU-Bewerber zum Wintersemester um den 15. Juli und zum Sommersemester um den 15. Januar – zahlreiche Hochschulen haben aber frühere Fristen. Wegen Beglaubigungen und Visumwartezeiten ist ein Start 9 bis 12 Monate im Voraus sinnvoll." },
      { title: "uni-assist", body: "Viele deutsche Hochschulen lassen internationale Zeugnisse vor ihrer Entscheidung durch uni-assist prüfen. Das kostet Zeit und eine Gebühr und sollte von Anfang an eingeplant werden." },
    ],
    faqs: [
      { q: "Kann ich mit FSc oder ICS einen Bachelor in Deutschland studieren?", a: "In der Regel nicht direkt. Die meisten Studierenden mit HSSC gehen über ein Studienkolleg oder studieren zunächst in Pakistan. Die genaue Regel hängt von Zeugnis und Fach ab – maßgeblich ist die Zulassungsdatenbank des DAAD." },
      { q: "Reicht ein zweijähriger Bachelor aus Pakistan für einen deutschen Master?", a: "Allein reicht er oft nicht aus. Deutsche Hochschulen prüfen Leistungspunkte und Inhalte; viele erwarten einen Abschluss, der einem deutschen Bachelor vergleichbar ist – also meist ein längeres Studium. Wir prüfen das für Ihre Wunschstudiengänge vor der Bewerbung." },
      { q: "Garantieren Sie Zulassung oder Visum?", a: "Nein. Über die Zulassung entscheiden die Hochschulen, über das Visum die deutsche Auslandsvertretung. Wir helfen Ihnen, realistische Studiengänge auszuwählen und vollständige, korrekte Unterlagen einzureichen." },
    ],
    sources: [DAAD_DB, { label: "Deutsche Vertretungen in Pakistan", url: "https://pakistan.diplo.de/" }, AA_VISA, MIIG_STUDY],
  },
  india: {
    country: "Indien",
    inCountry: "Indien",
    metaTitle: "Studium in Deutschland aus Indien: APS, Zulassung, Visum",
    description:
      "Studium in Deutschland aus Indien: das verpflichtende APS-Zertifikat, die Bewertung von Class 12 und dreijährigem Bachelor und der Weg zum Studentenvisum.",
    h1: "Studieren in Deutschland aus Indien",
    intro:
      "Indien schickt mehr Studierende nach Deutschland als fast jedes andere Land – und das Verfahren enthält einen Schritt, den indische Studierende nicht überspringen können: das APS-Zertifikat. Hier sehen Sie die richtige Reihenfolge, damit Sie keine Monate verlieren.",
    eligibility: [
      "Für einen Bachelor ermöglichen indische Class-12-Zeugnisse (CBSE, ISC oder State Boards) allein meist keinen direkten Hochschulzugang. Übliche Wege sind ein Studienkolleg oder ein Studium an einer indischen Hochschule; in manchen Fällen werden bestimmte Aufnahmeprüfungen berücksichtigt. Prüfen Sie Ihren Fall in der Zulassungsdatenbank des DAAD.",
      "Für einen Master akzeptieren viele Hochschulen dreijährige indische Bachelorabschlüsse, andere verlangen einen vierjährigen Abschluss oder eine bestimmte Zahl an Leistungspunkten in bestimmten Fächern. Das ist einer der häufigsten Ablehnungsgründe – es lohnt sich, das vor dem Bezahlen von Bewerbungsgebühren zu prüfen.",
    ],
    visa: [
      "Indische Bewerberinnen und Bewerber für ein deutsches Studentenvisum benötigen ein APS-Zertifikat der Akademischen Prüfstelle (APS) in Indien. Die APS prüft Ihre Studienunterlagen; das Zertifikat wird vor dem Visumantrag benötigt – beginnen Sie also früh, oft schon vor oder parallel zu den Hochschulbewerbungen.",
      "Das nationale Visum zu Studienzwecken beantragen Sie bei der deutschen Vertretung, die für Ihren Bundesstaat zuständig ist – mit Zulassungsbescheid, APS-Zertifikat, Finanzierungsnachweis (häufig ein Sperrkonto) und Krankenversicherung.",
    ],
    missions: ["Botschaft der Bundesrepublik Deutschland, Neu-Delhi", "Generalkonsulate in Mumbai, Chennai, Kolkata und Bengaluru"],
    notes: [
      { title: "Zeitplan für das APS", body: "Die Bearbeitungszeiten der APS schwanken. Da das Zertifikat für das Visum nötig ist und von vielen Hochschulen verlangt wird, empfehlen wir die Beantragung, sobald Ihre Abschlussunterlagen vorliegen." },
      { title: "Staatliche oder private Hochschule", body: "Die meisten staatlichen Hochschulen erheben für die meisten Studiengänge keine allgemeinen Studiengebühren, einige Bundesländer verlangen jedoch Gebühren von Nicht-EU-Studierenden. Private Hochschulen berechnen volle Studiengebühren. Wir vergleichen die tatsächlichen Gesamtkosten inklusive Semesterbeitrag und Lebenshaltung." },
      { title: "Sprache", body: "Englischsprachige Masterstudiengänge verlangen meist IELTS oder TOEFL. Deutschkenntnisse – auch einfache – erleichtern den Alltag, Nebenjobs und die Jobsuche nach dem Abschluss spürbar." },
    ],
    faqs: [
      { q: "Ist das APS für indische Studierende Pflicht?", a: "Ja. Indische Bewerberinnen und Bewerber für ein deutsches Studentenvisum benötigen ein APS-Zertifikat der Akademischen Prüfstelle in Indien. Aktuelles Verfahren und Gebühren finden Sie auf der Website von APS India." },
      { q: "Kann ich mit einem dreijährigen BSc oder BCom einen Master in Deutschland machen?", a: "Oft ja, aber nicht immer. Manche Studiengänge verlangen einen vierjährigen Abschluss oder bestimmte Leistungspunkte. Wir gleichen die Anforderungen jedes Studiengangs auf Ihrer Liste mit Ihrem Transcript ab." },
      { q: "Garantieren Sie Zulassung oder Visum?", a: "Nein. Diese Entscheidungen treffen Hochschulen und deutsche Behörden. Unsere Aufgabe ist es, Ihnen bei Bewerbungen für passende Studiengänge mit vollständigen, korrekten Unterlagen zu helfen." },
    ],
    sources: [{ label: "APS India – Akademische Prüfstelle", url: "https://aps-india.de/" }, { label: "Deutsche Vertretungen in Indien", url: "https://india.diplo.de/" }, DAAD_DB, AA_VISA],
  },
  bangladesh: {
    country: "Bangladesch",
    inCountry: "Bangladesch",
    metaTitle: "Studium in Deutschland aus Bangladesch: Zulassung & Visum",
    description:
      "Studium in Deutschland aus Bangladesch: Bewertung von HSC und Bachelor, Studienkolleg, englischsprachige Masterstudiengänge und das Visum aus Dhaka.",
    h1: "Studieren in Deutschland aus Bangladesch",
    intro:
      "Für Studierende aus Bangladesch ist Deutschland meist ein Masterziel: englischsprachige Studiengänge, an den meisten staatlichen Hochschulen keine oder geringe Studiengebühren und starke technische Fakultäten. Gute Planung zählt, denn Dokumentenprüfung und Visumtermine brauchen Zeit.",
    eligibility: [
      "Für einen Bachelor ermöglicht das Higher Secondary Certificate (HSC) aus Bangladesch in der Regel keinen direkten Zugang zu deutschen Hochschulen. Übliche Wege sind ein Studienkolleg oder ein Studium in Bangladesch.",
      "Für einen Master ist ein vierjähriger Bachelor in einem verwandten Fach die häufigste Grundlage. Hochschulen prüfen Noten, Leistungspunkte und Inhalte; manche verlangen eine Umrechnung der Note nach der deutschen Formel.",
      "Prüfen Sie die Regel für Ihr Zeugnis immer in der Zulassungsdatenbank des DAAD.",
    ],
    visa: [
      "Staatsangehörige von Bangladesch benötigen ein nationales Visum zu Studienzwecken, das bei der Deutschen Botschaft in Dhaka beantragt wird.",
      "Typische Unterlagen sind Zulassungsbescheid, Finanzierungsnachweis (häufig ein Sperrkonto), Krankenversicherung und Studienunterlagen. Die Nachfrage nach Terminen war hoch – beantragen Sie Ihr Visum daher, sobald Sie zugelassen sind.",
    ],
    missions: ["Botschaft der Bundesrepublik Deutschland, Dhaka"],
    notes: [
      { title: "Realistische Studiengänge wählen", body: "Gefragte englischsprachige Studiengänge erhalten viele Bewerbungen. Eine ausgewogene Auswahl – auch mit Hochschulen für angewandte Wissenschaften und weniger überlaufenen Städten – verbessert Ihre Chancen meist mehr als Bewerbungen nur bei den bekanntesten Namen." },
      { title: "Kosten einplanen", body: "Neben Studiengebühren sollten Sie gegebenenfalls uni-assist-Gebühren, das Sperrkonto, die Krankenversicherung, den Semesterbeitrag, die Visumgebühr und die Miete der ersten Monate einplanen." },
    ],
    faqs: [
      { q: "Kann ich nach dem HSC in Deutschland studieren?", a: "In der Regel über ein Studienkolleg oder nach einem Teilstudium in Bangladesch. Eine direkte Zulassung zum Bachelor nur mit HSC ist grundsätzlich nicht möglich." },
      { q: "Brauche ich IELTS?", a: "Die meisten englischsprachigen Studiengänge verlangen IELTS oder TOEFL. Manche akzeptieren eine Bescheinigung über Englisch als Unterrichtssprache – das ist unterschiedlich, prüfen Sie jeden Studiengang." },
      { q: "Garantieren Sie Zulassung oder Visum?", a: "Nein. Entscheidungen treffen die Hochschulen und die Deutsche Botschaft. Wir helfen Ihnen, eine starke, vollständige Bewerbung vorzubereiten." },
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA, MIIG_STUDY],
  },
  uae: {
    country: "Vereinigte Arabische Emirate",
    inCountry: "den VAE",
    metaTitle: "Studium in Deutschland aus den VAE & Dubai",
    description:
      "Studium in Deutschland aus Dubai oder Abu Dhabi: wie A-Levels, IB, US-, CBSE- und pakistanische Zeugnisse bewertet werden und das Visum mit VAE-Wohnsitz.",
    h1: "Studieren in Deutschland aus den VAE und Dubai",
    intro:
      "Studierende in Dubai, Abu Dhabi und Sharjah kommen aus Dutzenden Schulsystemen. Genau das macht die Planung für Deutschland aus den VAE besonders: Ihre Möglichkeiten hängen ebenso von Lehrplan und Pass ab wie von Ihren Noten.",
    eligibility: [GULF, "Für einen Master bewerten deutsche Hochschulen Ihren Bachelor nach Inhalt und Leistungspunkten – unabhängig davon, wo er erworben wurde. Abschlüsse von Zweigcampussen ausländischer Universitäten in den VAE werden einzeln geprüft."],
    visa: [
      "Ob Sie ein Visum brauchen, hängt von Ihrer Staatsangehörigkeit ab: EU-Bürger nicht, die meisten anderen schon. Das nationale Visum zu Studienzwecken wird grundsätzlich bei der Vertretung beantragt, die für Ihren rechtmäßigen Wohnsitz zuständig ist – mit gültigem Aufenthaltstitel in den VAE also in der Regel dort.",
      "Halten Sie Ihr Aufenthaltsvisum für die VAE während des gesamten Verfahrens gültig und prüfen Sie auf der Website der deutschen Vertretung, welche Unterlagen für Ihre Staatsangehörigkeit gelten.",
    ],
    missions: ["Botschaft der Bundesrepublik Deutschland, Abu Dhabi", "Generalkonsulat der Bundesrepublik Deutschland, Dubai"],
    notes: [
      { title: "Familien mit ausländischem Pass", body: "Viele Studierende in den VAE haben einen indischen, pakistanischen oder anderen Pass. Einige Regeln hängen trotzdem von der Staatsangehörigkeit ab – indische Staatsangehörige sollten etwa prüfen, ob das APS-Verfahren für sie gilt." },
      { title: "Schulabgänger", body: "Für manche Studiengänge können Sie sich im Abschlussjahr mit vorläufigen Ergebnissen bewerben; die Zulassung bleibt aber bedingt, bis das Abschlusszeugnis vorliegt. Wir planen den Zeitplan rund um den Ergebnistermin Ihres Prüfungsboards." },
    ],
    faqs: [
      { q: "Kann ich das deutsche Studentenvisum in Dubai beantragen, wenn ich kein Emirati bin?", a: "In der Regel ja, sofern Sie rechtmäßig in den VAE wohnen. Zuständig ist grundsätzlich die Vertretung für Ihren Wohnort. Prüfen Sie die aktuellen Regeln für Ihre Staatsangehörigkeit bei den deutschen Vertretungen in den VAE." },
      { q: "Erhalten IB- und A-Level-Absolventen direkt eine Zulassung?", a: "Oft ja, wenn Fächerkombination und Noten die deutschen Voraussetzungen erfüllen. Wir prüfen das vor Ihrer Bewerbung." },
      { q: "Haben Sie ein Büro in Dubai?", a: "Wir betreuen Studierende in den VAE aus der Ferne – per WhatsApp, E-Mail und Videoanruf. Unsere Kontaktdaten finden Sie auf der Kontaktseite." },
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA, MIIG_STUDY],
  },
  "saudi-arabia": {
    country: "Saudi-Arabien",
    inCountry: "Saudi-Arabien",
    metaTitle: "Studium in Deutschland aus Saudi-Arabien: Zulassung & Visum",
    description:
      "Studium in Deutschland aus Riad, Dschidda oder Dammam: wie saudische und internationale Schulzeugnisse bewertet werden und wie das Studentenvisum funktioniert.",
    h1: "Studieren in Deutschland aus Saudi-Arabien",
    intro:
      "Zu den Studierenden in Saudi-Arabien gehören saudische Staatsangehörige ebenso wie eine große internationale Community an internationalen Schulen. Beide Gruppen können in Deutschland studieren – welche Zulassungsregeln gelten, hängt aber vom jeweiligen Zeugnis ab.",
    eligibility: [
      "Saudische Sekundarschulzeugnisse werden einzeln nach deutschen Regeln bewertet; je nach Zeugnis und Ergebnissen führt der Weg über ein Studienkolleg oder ein vorheriges Studium statt über eine direkte Bachelorzulassung. Prüfen Sie die Zulassungsdatenbank des DAAD.",
      GULF,
    ],
    visa: [
      "Saudische Staatsangehörige und die meisten dort lebenden Ausländer benötigen ein nationales Visum zu Studienzwecken. Beantragt wird es bei der deutschen Vertretung, die für Ihren Wohnort in Saudi-Arabien zuständig ist – als ausländischer Einwohner mit gültigem Aufenthaltstitel.",
      "Typische Unterlagen sind Zulassungsbescheid, Finanzierungsnachweis, Krankenversicherung und Studienunterlagen.",
    ],
    missions: ["Botschaft der Bundesrepublik Deutschland, Riad", "Generalkonsulat der Bundesrepublik Deutschland, Dschidda"],
    notes: [
      { title: "Stipendien- und Sponsorenschreiben", body: "Wenn ein Sponsor oder Stipendium Ihre Kosten übernimmt, kann die deutsche Vertretung eine formelle Förderbestätigung statt oder zusätzlich zu einem Sperrkonto akzeptieren. Die Anforderungen sind streng – klären Sie das genaue Format, bevor Sie sich darauf verlassen." },
      { title: "Sprachvorbereitung", body: "Englischsprachige Studiengänge verlangen meist IELTS oder TOEFL. Für deutschsprachige Studiengänge sollten Sie mehr Zeit für ein anerkanntes Deutschzertifikat wie TestDaF oder DSH einplanen." },
    ],
    faqs: [
      { q: "Können ausländische Einwohner Saudi-Arabiens das deutsche Studentenvisum vor Ort beantragen?", a: "In der Regel ja, wenn Sie rechtmäßig in Saudi-Arabien wohnen. Prüfen Sie die aktuellen Anforderungen für Ihre Staatsangehörigkeit bei den deutschen Vertretungen in Riad oder Dschidda." },
      { q: "Kann ich in Deutschland auf Englisch studieren?", a: "Ja, vor allem im Master. Englischsprachige Bachelorstudiengänge gibt es auch, aber deutlich weniger." },
      guarantee,
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA, MIIG_STUDY],
  },
  qatar: {
    country: "Katar",
    inCountry: "Katar",
    metaTitle: "Studium in Deutschland aus Katar: Zulassung & Visum",
    description:
      "Studium in Deutschland aus Doha: Bewertung katarischer und internationaler Schulzeugnisse, das Studentenvisum für Einwohner und ein realistischer Zeitplan.",
    h1: "Studieren in Deutschland aus Katar",
    intro:
      "Die meisten Studierenden, die sich aus Katar bei uns melden, besuchen internationale Schulen in Doha oder haben bereits einen Abschluss und möchten einen deutschen Master. Die Fragen sind praktischer Natur: Reicht mein Zeugnis, wo beantrage ich das Visum und wie lange dauert das alles?",
    eligibility: [
      "Das katarische Sekundarschulzeugnis wird einzeln nach deutschen Regeln bewertet – ob es einen direkten Zugang ermöglicht oder ein Studienkolleg nötig ist, zeigt die Zulassungsdatenbank des DAAD.",
      GULF,
    ],
    visa: [
      "Für Einwohner Katars ist die Deutsche Botschaft in Doha zuständig. Die Visumpflicht hängt von Ihrer Staatsangehörigkeit ab; ohne katarische Staatsangehörigkeit sollte Ihr Aufenthaltstitel während des Verfahrens gültig bleiben.",
      "Aktuelle Terminregelungen und die für Studentenvisa nötigen Unterlagen finden Sie auf der Website der Botschaft.",
    ],
    missions: ["Botschaft der Bundesrepublik Deutschland, Doha"],
    notes: [
      { title: "Zeitplan", body: "Da eine einzige Vertretung die Anträge bearbeitet, sollten Sie zwischen Zulassung und geplanter Abreise zusätzliche Zeit einplanen. Wir erstellen einen Monatsplan, rückwärts gerechnet ab Semesterbeginn." },
      { title: "Berufstätige in Katar", body: "Wenn Sie bereits in Katar arbeiten und einen deutschen Master anstreben, kann einschlägige Berufserfahrung Ihre Bewerbung für manche Studiengänge stärken – besonders an Hochschulen für angewandte Wissenschaften." },
    ],
    faqs: [
      { q: "Wo beantrage ich in Katar ein deutsches Studentenvisum?", a: "Bei der Deutschen Botschaft in Doha, die für Einwohner Katars zuständig ist. Aktuelle Verfahren finden Sie auf ihrer Website." },
      { q: "Kann ich mich mit einem amerikanischen High-School-Abschluss einer Schule in Doha bewerben?", a: "Meist nur mit zusätzlichen Nachweisen wie AP-Prüfungen, SAT-Ergebnissen oder einem begonnenen College-Studium. Wir prüfen Ihren Fall anhand der deutschen Regeln." },
      guarantee,
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA],
  },
  oman: {
    country: "Oman",
    inCountry: "Oman",
    metaTitle: "Studium in Deutschland aus Oman: Zulassung & Visum",
    description:
      "Studium in Deutschland aus Oman: Bewertung des General Education Diploma und internationaler Zeugnisse sowie das Studentenvisum aus Maskat.",
    h1: "Studieren in Deutschland aus Oman",
    intro:
      "Deutschland und Oman sind akademisch seit Langem verbunden – unter anderem durch eine deutsch-omanische Hochschule in Maskat –, und deutsche Abschlüsse in Ingenieur- und angewandten Wissenschaften sind in der Region bekannt. Das sollten Studierende im Oman zuerst prüfen.",
    eligibility: [
      "Das omanische General Education Diploma wird einzeln nach deutschen Regeln bewertet; je nach Ergebnissen und Fächern führt der Weg über ein Studienkolleg oder ein vorheriges Studium. Prüfen Sie die Zulassungsdatenbank des DAAD.",
      GULF,
    ],
    visa: [
      "Für Einwohner Omans ist die Deutsche Botschaft in Maskat zuständig. Ausländische Einwohner sollten ihren Aufenthaltstitel während des Antrags gültig halten.",
      "Aktuelle Verfahren und erforderliche Unterlagen für Studentenvisa finden Sie auf der Website der Botschaft.",
    ],
    missions: ["Botschaft der Bundesrepublik Deutschland, Maskat"],
    notes: [
      { title: "Angewandte Wissenschaften", body: "Hochschulen für angewandte Wissenschaften bieten praxisnahe Studiengänge in Ingenieurwesen, Logistik und Wirtschaft, die vielen Studierenden aus dem Oman entgegenkommen. Ihre Zulassungsvoraussetzungen unterscheiden sich oft von denen der Universitäten." },
      { title: "Förderung", body: "Wenn eine staatliche Stelle oder ein Arbeitgeber Ihr Studium finanziert, klären Sie früh, wie die deutsche Vertretung diese Förderung als Finanzierungsnachweis dokumentiert haben möchte." },
    ],
    faqs: [
      { q: "Wo beantrage ich im Oman ein deutsches Studentenvisum?", a: "Bei der Deutschen Botschaft in Maskat. Aktuelle Verfahren finden Sie auf ihrer Website." },
      { q: "Kann ich Ingenieurwesen in Deutschland auf Englisch studieren?", a: "Ja, vor allem im Master. Ingenieurstudiengänge im Bachelor sind überwiegend deutschsprachig." },
      guarantee,
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA],
  },
  bahrain: {
    country: "Bahrain",
    inCountry: "Bahrain",
    metaTitle: "Studium in Deutschland aus Bahrain: Zulassung & Visum",
    description:
      "Studium in Deutschland aus Bahrain: Bewertung bahrainischer und internationaler Schulzeugnisse und der Antrag auf ein Studentenvisum in Manama.",
    h1: "Studieren in Deutschland aus Bahrain",
    intro:
      "Bahrain ist klein, doch seine Studierenden kommen aus vielen Schulsystemen – darunter nationale, britische, amerikanische und indische. Für Deutschland entscheidet dieser Lehrplan über den Weg, deshalb schauen wir ihn uns zuerst an.",
    eligibility: [
      "Das bahrainische Sekundarschulzeugnis wird einzeln nach deutschen Regeln bewertet – ob für Ihre Ergebnisse und Fächer ein Studienkolleg nötig ist, zeigt die Zulassungsdatenbank des DAAD.",
      GULF,
    ],
    visa: [
      "Für Einwohner Bahrains ist die Deutsche Botschaft in Manama zuständig. Die Visumpflicht hängt von Ihrer Staatsangehörigkeit ab; ausländische Einwohner sollten ihren Aufenthaltstitel gültig halten.",
      "Aktuelle Terminregelungen und erforderliche Unterlagen finden Sie auf der Website der Botschaft.",
    ],
    missions: ["Botschaft der Bundesrepublik Deutschland, Manama"],
    notes: [
      { title: "Kurze Wege, lange Vorlaufzeiten", body: "Die Größe Bahrains verkürzt keine deutschen Verfahren: Die Prüfung durch uni-assist, das Sperrkonto und die Visumbearbeitung dauern jeweils Wochen. Früh anzufangen ist das Wichtigste, was Sie tun können." },
      { title: "Die richtige Stadt", body: "Die Lebenshaltungskosten unterscheiden sich stark zwischen deutschen Städten. München und Frankfurt sind teuer; viele Hochschulstädte in Ost- und Mitteldeutschland sind deutlich günstiger." },
    ],
    faqs: [
      { q: "Wo beantrage ich in Bahrain ein deutsches Studentenvisum?", a: "Bei der Deutschen Botschaft in Manama. Aktuelle Verfahren finden Sie auf ihrer Website." },
      { q: "Brauchen A-Level-Absolventen ein Studienkolleg?", a: "Nicht immer. Mit der richtigen Anzahl an A-Levels in passenden Fächern ist eine direkte Zulassung oft möglich. Wir prüfen Ihre Fächerkombination." },
      guarantee,
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA],
  },
};

export function getMarket(slug: string, locale: Locale): Market | null {
  const base = markets.find((m) => m.slug === slug);
  if (!base) return null;
  if (locale !== "de" || !de[slug]) return base;
  return { ...base, ...de[slug] };
}

const shortName: Record<string, Record<Locale, string>> = {
  pakistan: { en: "Pakistan", de: "Pakistan" },
  india: { en: "India", de: "Indien" },
  bangladesh: { en: "Bangladesh", de: "Bangladesch" },
  uae: { en: "UAE & Dubai", de: "VAE & Dubai" },
  "saudi-arabia": { en: "Saudi Arabia", de: "Saudi-Arabien" },
  qatar: { en: "Qatar", de: "Katar" },
  oman: { en: "Oman", de: "Oman" },
  bahrain: { en: "Bahrain", de: "Bahrain" },
};
const fromName: Record<string, Record<Locale, string>> = {
  pakistan: { en: "From Pakistan", de: "Aus Pakistan" },
  india: { en: "From India", de: "Aus Indien" },
  bangladesh: { en: "From Bangladesh", de: "Aus Bangladesch" },
  uae: { en: "From the UAE & Dubai", de: "Aus den VAE & Dubai" },
  "saudi-arabia": { en: "From Saudi Arabia", de: "Aus Saudi-Arabien" },
  qatar: { en: "From Qatar", de: "Aus Katar" },
  oman: { en: "From Oman", de: "Aus Oman" },
  bahrain: { en: "From Bahrain", de: "Aus Bahrain" },
};

/** "short": "UAE & Dubai" · "from": "From the UAE & Dubai" / "Aus den VAE & Dubai" */
export const marketName = (slug: string, locale: Locale, form: "short" | "from") => (form === "short" ? shortName : fromName)[slug]?.[locale] ?? slug;
