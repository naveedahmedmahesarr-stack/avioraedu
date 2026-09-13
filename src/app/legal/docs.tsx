import type { Locale } from "@/i18n/locales";
import type { Site } from "@/lib/site";

/**
 * Legal documents (German law for the Berlin business; status information for the planned Karachi presence).
 * Only facts supplied by AVIORA EDU are filled in. Missing details come from Admin → Settings (legal fields)
 * and are shown as clearly marked placeholders until provided. Have the final texts reviewed by a lawyer.
 */
export type LegalSection = { h: string; body: React.ReactNode };
export type LegalDoc = {
  region: "de" | "pk";
  draft: boolean;
  version: Record<Locale, string>;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  sections: (site: Site, locale: Locale) => LegalSection[];
};

export function Todo({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <span className="rounded border border-gold-500/40 bg-gold-300/25 px-1.5 py-0.5 text-[0.92em] font-semibold text-navy-900 print:border-black print:bg-transparent">
      {locale === "de" ? "Vor Veröffentlichung zu ergänzen: " : "To complete before publishing: "}
      {children}
    </span>
  );
}

const version = { en: "Draft version · September 13, 2026", de: "Entwurf · Stand: 13. September 2026" };
const Mail = ({ site, locale }: { site: Site; locale: Locale }) =>
  site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : <Todo locale={locale}>{locale === "de" ? "E-Mail-Adresse" : "email address"}</Todo>;
const city = (site: Site, locale: Locale) => (locale === "de" ? (site.location || "Berlin, Germany").replace("Germany", "Deutschland") : site.location || "Berlin, Germany");
const Address = ({ site, locale }: { site: Site; locale: Locale }) =>
  site.settings.legalAddress ? (
    <span className="whitespace-pre-line">{site.settings.legalAddress}</span>
  ) : (
    <Todo locale={locale}>
      {locale === "de"
        ? "Straße, Hausnummer und Postleitzahl – eine ladungsfähige Anschrift ist gesetzlich vorgeschrieben. Wer von zu Hause arbeitet und die Privatadresse nicht veröffentlichen möchte, kann eine Geschäfts- oder Serviceanschrift nutzen, an die rechtliche Post zugestellt werden kann (Admin → Settings → Legal address)."
        : "street, house number and postal code — a postal address where legal documents can be served is required by law. If you work from home and don't want to publish your home address, use a business or service address that accepts legal mail (Admin → Settings → Legal address)."}
    </Todo>
  );

export const legalDocs: Record<string, LegalDoc> = {
  imprint: {
    region: "de",
    draft: true,
    version,
    title: { en: "Legal Notice (Impressum)", de: "Impressum" },
    summary: { en: "Provider information required for German websites under § 5 DDG.", de: "Anbieterkennzeichnung nach § 5 DDG für deutsche Websites." },
    sections: (site, locale) => {
      const de = locale === "de";
      return [
        {
          h: de ? "Angaben gemäß § 5 DDG" : "Information pursuant to § 5 DDG (German Digital Services Act)",
          body: (
            <p>
              {site.name}
              <br />
              {de ? "Inhaber" : "Owner"}: Naveed Ahmed
              <br />
              <Address site={site} locale={locale} />
              <br />
              {city(site, locale)}
            </p>
          ),
        },
        {
          h: de ? "Rechtsform und Registereintrag" : "Legal form and register entry",
          body: (
            <p>
              {de ? "Rechtsform" : "Legal form"}: {site.settings.legalForm || <Todo locale={locale}>{de ? "Rechtsform, z. B. Einzelunternehmen" : "legal form, e.g. sole proprietorship (Einzelunternehmen)"}</Todo>}
              <br />
              {de ? "Registereintrag" : "Register entry"}: {site.settings.registerEntry || <Todo locale={locale}>{de ? "Registergericht und Nummer – nur falls eingetragen, sonst entfernen" : "register court and number — only if registered, otherwise remove"}</Todo>}
            </p>
          ),
        },
        {
          h: de ? "Kontakt" : "Contact",
          body: (
            <p>
              {de ? "E-Mail" : "Email"}: <Mail site={site} locale={locale} />
              <br />
              {de ? "Telefon" : "Phone"}: {site.phone || <Todo locale={locale}>{de ? "Telefonnummer (als zweiter direkter Kontaktweg empfohlen)" : "phone number (recommended as a second direct contact method)"}</Todo>}
            </p>
          ),
        },
        {
          h: de ? "Umsatzsteuer-Identifikationsnummer" : "VAT identification number",
          body: <p>{site.settings.vatId || <Todo locale={locale}>{de ? "USt-IdNr. nach § 27a UStG – nur falls vorhanden, sonst diesen Abschnitt entfernen" : "VAT ID under § 27a UStG — only if issued, otherwise remove this section"}</Todo>}</p>,
        },
        {
          h: de ? "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV" : "Responsible for content under § 18(2) MStV",
          body: (
            <p>
              Naveed Ahmed
              <br />
              <Address site={site} locale={locale} />
            </p>
          ),
        },
        {
          h: de ? "Verbraucherstreitbeilegung" : "Consumer dispute resolution",
          body: <p>{site.settings.disputeResolution || <Todo locale={locale}>{de ? "Erklärung, ob Sie bereit oder verpflichtet sind, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG)" : "statement on whether you are willing or obliged to take part in dispute resolution before a consumer arbitration board (§ 36 VSBG)"}</Todo>}</p>,
        },
        {
          h: de ? "Hinweis zu unseren Leistungen" : "About our services",
          body: (
            <>
              <p>
                {de
                  ? `${site.name} berät zu Studium und Studienvorbereitung in Deutschland und Europa. Über Zulassungen entscheiden die Hochschulen, über Visa und Aufenthaltstitel die zuständigen Behörden. ${site.name} ist keine Rechtsanwaltskanzlei und erbringt keine Rechtsberatung im Einzelfall.`
                  : `${site.name} provides guidance on studying and preparing to study in Germany and Europe. Admission decisions are made by universities, and visa and residence decisions by the competent authorities. ${site.name} is not a law firm and does not provide individual legal advice.`}
              </p>
              <p>
                <Todo locale={locale}>
                  {de
                    ? "anwaltlich prüfen lassen, wie sich Ihre Leistungen und die Bezeichnung „Lead Immigration Consultant“ zum Rechtsdienstleistungsgesetz (RDG) verhalten"
                    : "have a lawyer confirm how your services and the title “Lead Immigration Consultant” relate to the German Legal Services Act (Rechtsdienstleistungsgesetz, RDG)"}
                </Todo>
              </p>
            </>
          ),
        },
        {
          h: de ? "Haftung für Inhalte und Links" : "Liability for content and links",
          body: (
            <p>
              {de
                ? "Wir erstellen die Inhalte dieser Website mit Sorgfalt. Regeln zu Zulassung, Gebühren und Visa ändern sich jedoch häufig – bitte prüfen Sie aktuelle Anforderungen bei der offiziellen Stelle. Für Inhalte externer Websites, auf die wir verlinken, sind deren Betreiber verantwortlich. Werden uns Rechtsverstöße bekannt, entfernen wir den betreffenden Link umgehend."
                : "We prepare the content of this website with care, but rules on admission, fees and visas change frequently — please check current requirements with the official source. The operators of external websites we link to are responsible for their content. If we become aware of unlawful content on a linked site, we will remove the link promptly."}
            </p>
          ),
        },
      ];
    },
  },
  "privacy-policy": {
    region: "de",
    draft: true,
    version,
    title: { en: "Privacy Policy", de: "Datenschutzerklärung" },
    summary: { en: "How we process personal data under the GDPR, and your rights.", de: "Wie wir personenbezogene Daten nach der DSGVO verarbeiten – und Ihre Rechte." },
    sections: (site, locale) => {
      const de = locale === "de";
      return [
        {
          h: de ? "Verantwortlicher" : "Controller",
          body: (
            <p>
              {site.name}, Naveed Ahmed
              <br />
              <Address site={site} locale={locale} />
              <br />
              {city(site, locale)}
              <br />
              {de ? "E-Mail" : "Email"}: <Mail site={site} locale={locale} />
            </p>
          ),
        },
        {
          h: de ? "Aufruf der Website und Hosting" : "Visiting the website and hosting",
          body: (
            <p>
              {de
                ? "Beim Aufruf dieser Website verarbeitet der Hosting-Server automatisch technische Daten wie IP-Adresse, Datum und Uhrzeit, aufgerufene Seite und Browsertyp. Das ist erforderlich, um die Website auszuliefern und sicher zu betreiben (Art. 6 Abs. 1 lit. f DSGVO). "
                : "When you open this website, the hosting server automatically processes technical data such as your IP address, the date and time of the request, the page requested and your browser type. This is necessary to deliver the website and keep it secure (Art. 6(1)(f) GDPR). "}
              <Todo locale={locale}>{de ? "Name des Hosting-Anbieters, Serverstandort, Auftragsverarbeitungsvertrag und Speicherdauer der Server-Logs" : "hosting provider, server location, data processing agreement and how long server logs are kept"}</Todo>
            </p>
          ),
        },
        {
          h: de ? "Beratungsanfragen" : "Consultation requests",
          body: (
            <p>
              {de
                ? "Wenn Sie eine Beratungsanfrage senden, verarbeiten wir Ihre Angaben – Name, E-Mail, Telefonnummer, Land, Studienpläne und Ihre Nachricht –, um Ihnen zu antworten und auf Ihren Wunsch unsere Leistungen vorzubereiten (Art. 6 Abs. 1 lit. b DSGVO). Das Formular wird nur mit Ihrer Einwilligung abgesendet (Art. 6 Abs. 1 lit. a DSGVO). Anfragen werden auf unserer Hosting-Infrastruktur gespeichert und können uns per E-Mail gemeldet werden. "
                : "If you send a consultation request, we process the details you enter — name, email, phone number, country, study plans and your message — to reply to you and, if you wish, to prepare our services (Art. 6(1)(b) GDPR). The form is only submitted with your consent (Art. 6(1)(a) GDPR). Requests are stored on our hosting infrastructure and may be notified to us by email. "}
              <Todo locale={locale}>{de ? "E-Mail-Versanddienst (falls genutzt)" : "email delivery provider (if used)"}</Todo>
            </p>
          ),
        },
        {
          h: de ? "Bewertungen" : "Reviews",
          body: (
            <p>
              {de
                ? "Wenn Sie eine Bewertung abgeben, verarbeiten wir Ihren Namen, Ihr Land, die Bewertung und Ihren Text. Bewertungen werden vor der Veröffentlichung geprüft und nur mit Ihrer Einwilligung veröffentlicht (Art. 6 Abs. 1 lit. a DSGVO). Sie können die Entfernung jederzeit verlangen."
                : "If you submit a review, we process your name, country, rating and text. Reviews are checked before publication and only published with your consent (Art. 6(1)(a) GDPR). You can ask us to remove your review at any time."}
            </p>
          ),
        },
        {
          h: de ? "Kontakt per WhatsApp und E-Mail" : "Contact by WhatsApp and email",
          body: (
            <p>
              {de
                ? "Wenn Sie uns über den WhatsApp-Button kontaktieren, verarbeitet WhatsApp (Meta Platforms Ireland Ltd.) Ihre Daten nach eigener Datenschutzrichtlinie; dabei können Daten in die USA übermittelt werden. Nutzen Sie WhatsApp nur, wenn Sie damit einverstanden sind – E-Mail und Kontaktformular stehen jederzeit als Alternative zur Verfügung. E-Mails verarbeiten wir, um sie zu beantworten (Art. 6 Abs. 1 lit. b oder f DSGVO)."
                : "If you contact us through the WhatsApp button, WhatsApp (Meta Platforms Ireland Ltd.) processes your data under its own privacy policy, and data may be transferred to the USA. Only use WhatsApp if you are comfortable with this — email and the consultation form are always available as alternatives. We process emails in order to answer them (Art. 6(1)(b) or (f) GDPR)."}
            </p>
          ),
        },
        {
          h: de ? "Speicherung im Browser" : "Storage in your browser",
          body: (
            <p>
              {de
                ? "Wir verwenden nur technisch notwendige Speicherung: Ihre Auswahl im Cookie-Hinweis und ein Sitzungs-Cookie für angemeldete Administratoren (§ 25 Abs. 2 TDDDG). Analyse- oder Werbe-Cookies setzen wir nicht ein."
                : "We only use strictly necessary browser storage: your cookie banner choice, and a session cookie for logged-in administrators (§ 25(2) TDDDG). We do not use analytics or advertising cookies."}
            </p>
          ),
        },
        {
          h: de ? "Schriftarten und 3D-Karte" : "Fonts and 3D map",
          body: (
            <p>
              {de
                ? "Schriftarten werden von unserem eigenen Server geladen; es findet keine Anfrage an Google Fonts statt. Ist die fotorealistische 3D-Karte von Berlin aktiviert, werden Kartendaten von Servern der Google Ireland Ltd. geladen, wobei Ihre IP-Adresse an Google übermittelt wird. "
                : "Fonts are served from our own server; no request is made to Google Fonts. If the photorealistic 3D map of Berlin is enabled, map data is loaded from servers of Google Ireland Ltd., which transmits your IP address to Google. "}
              <Todo locale={locale}>{de ? "anwaltlich klären, ob vor dem Laden der Google-3D-Karte eine Einwilligung erforderlich ist" : "confirm with a lawyer whether consent is required before loading Google 3D map data"}</Todo>
            </p>
          ),
        },
        {
          h: de ? "Speicherdauer" : "Retention",
          body: (
            <p>
              {de ? "Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. " : "We keep personal data only as long as necessary for the purpose or as required by statutory retention obligations. "}
              <Todo locale={locale}>{de ? "konkrete Löschfristen für Anfragen, Bewertungen und Kundendaten" : "specific deletion periods for inquiries, reviews and client records"}</Todo>
            </p>
          ),
        },
        {
          h: de ? "Ihre Rechte" : "Your rights",
          body: (
            <>
              <p>
                {de
                  ? "Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21 DSGVO). Eine Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Schreiben Sie uns dazu einfach eine E-Mail."
                  : "You have the right of access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to object to processing (Art. 21 GDPR). You can withdraw consent at any time with effect for the future. To exercise these rights, simply email us."}
              </p>
              <p>
                {de
                  ? "Außerdem können Sie sich bei einer Datenschutzaufsichtsbehörde beschweren, zum Beispiel bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit ("
                  : "You also have the right to lodge a complaint with a data protection authority, for example the Berlin Commissioner for Data Protection and Freedom of Information ("}
                <a href="https://www.datenschutz-berlin.de" target="_blank" rel="noopener noreferrer">
                  datenschutz-berlin.de
                </a>
                ).
              </p>
            </>
          ),
        },
      ];
    },
  },
  terms: {
    region: "de",
    draft: true,
    version,
    title: { en: "Terms of Service", de: "Allgemeine Geschäftsbedingungen" },
    summary: { en: "The basis of our consultancy services — to be finalized with a lawyer.", de: "Grundlage unserer Beratungsleistungen – mit anwaltlicher Prüfung abzuschließen." },
    sections: (site, locale) => {
      const de = locale === "de";
      return [
        {
          h: de ? "Geltungsbereich" : "Scope",
          body: (
            <p>
              <Todo locale={locale}>{de ? "vollständige AGB inklusive Leistungsumfang, Vergütung, Zahlung, Widerrufsbelehrung und Kündigung – anwaltlich geprüft" : "full terms including scope of services, fees, payment, cancellation/withdrawal rights and termination — reviewed by a lawyer"}</Todo>
            </p>
          ),
        },
        {
          h: de ? "Keine Ergebnisgarantie" : "No guaranteed outcomes",
          body: (
            <p>
              {de
                ? `${site.name} unterstützt Studierende bei der Vorbereitung ihrer Bewerbungen. Wir garantieren weder eine Zulassung an einer Hochschule noch die Erteilung eines Visums oder Aufenthaltstitels oder ein Stipendium.`
                : `${site.name} helps students prepare their applications. We do not and cannot guarantee admission to any institution, the grant of any visa or residence permit, or any scholarship.`}
            </p>
          ),
        },
        {
          h: de ? "Richtigkeit von Informationen" : "Accuracy of information",
          body: <p>{de ? "Informationen zu Hochschulen, Gebühren und Einwanderung ändern sich häufig. Prüfen Sie Details immer bei der offiziellen Institution oder Behörde." : "University, tuition and immigration information changes frequently. Always check details with the official institution or authority."}</p>,
        },
      ];
    },
  },
  disclaimer: {
    region: "de",
    draft: false,
    version: { en: "Version · September 13, 2026", de: "Stand: 13. September 2026" },
    title: { en: "Disclaimer", de: "Haftungsausschluss & Hinweise" },
    summary: { en: "What we can and cannot promise — and who makes the final decisions.", de: "Was wir versprechen können und was nicht – und wer am Ende entscheidet." },
    sections: (site, locale) => {
      const de = locale === "de";
      const list = de
        ? ["Zulassung an einer Hochschule", "Erteilung eines Visums", "Erteilung eines Aufenthaltstitels", "Stipendien oder Fördermittel", "eine Beschäftigung während oder nach dem Studium", "eine Unterkunft, ein Bankkonto, einen Mobilfunkvertrag oder einen Behördentermin"]
        : ["admission to a university", "approval of a visa", "the grant of a residence permit", "scholarships or funding", "employment during or after studies", "accommodation, a bank account, a mobile contract or an appointment with an authority"];
      return [
        {
          h: de ? "Keine Garantien" : "No guarantees",
          body: (
            <>
              <p>{de ? `${site.name} garantiert insbesondere nicht:` : `${site.name} does not guarantee, in particular:`}</p>
              <ul className="list-disc pl-6">
                {list.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </>
          ),
        },
        {
          h: de ? "Wer entscheidet" : "Who decides",
          body: (
            <p>
              {de
                ? "Endgültige Entscheidungen treffen ausschließlich die zuständigen Stellen: Hochschulen über Zulassungen, deutsche Auslandsvertretungen und Ausländerbehörden über Visa und Aufenthaltstitel, Vermieter, Banken und Anbieter über ihre Verträge."
                : "Final decisions rest solely with the relevant institutions: universities decide on admission, German missions and immigration offices on visas and residence permits, and landlords, banks and providers on their contracts."}
            </p>
          ),
        },
        {
          h: de ? "Keine Rechtsberatung" : "No legal advice",
          body: (
            <>
              <p>
                {de
                  ? `${site.name} ist eine Bildungsberatung, keine Rechtsanwaltskanzlei. Informationen zu Aufenthalts- und Einwanderungsthemen sind allgemeine Orientierung. Für eine individuelle Rechtsberatung wenden Sie sich bitte an eine in Deutschland zugelassene Rechtsanwältin oder einen Rechtsanwalt. Die Bezeichnung „Lead Immigration Consultant“ beschreibt die Rolle von Naveed Ahmed innerhalb von ${site.name} und ist keine Zulassung als Rechtsdienstleister.`
                  : `${site.name} is an education consultancy, not a law firm. Information on residence and immigration topics is general guidance. For individual legal advice, please consult a lawyer admitted in Germany (Rechtsanwalt). The title “Lead Immigration Consultant” describes Naveed Ahmed's role within ${site.name} and is not an authorization to provide legal services.`}
              </p>
              <p>
                <Todo locale={locale}>{de ? "Formulierung und Titel anwaltlich im Hinblick auf das RDG prüfen lassen" : "have this wording and the title reviewed by a lawyer in light of the RDG"}</Todo>
              </p>
            </>
          ),
        },
        {
          h: de ? "Informationen zu Hochschulen" : "University information",
          body: (
            <p>
              {de
                ? `Hochschulinformationen auf dieser Website dienen der allgemeinen Orientierung. ${site.name} tritt nicht als offizielle Vertretung der genannten Hochschulen auf; eine Partnerschaft besteht nur, wenn sie ausdrücklich angegeben ist.`
                : `University information on this website is provided as general guidance. ${site.name} does not act as an official representative of the universities listed; a partnership exists only where explicitly stated.`}
            </p>
          ),
        },
        {
          h: de ? "Aktualität und externe Links" : "Accuracy and external links",
          body: <p>{de ? "Regeln und Beträge ändern sich. Prüfen Sie aktuelle Angaben bei den verlinkten offiziellen Quellen. Für Inhalte externer Websites sind deren Betreiber verantwortlich." : "Rules and amounts change. Please check current details with the official sources we link to. The operators of external websites are responsible for their content."}</p>,
        },
      ];
    },
  },
  "cookie-policy": {
    region: "de",
    draft: false,
    version: { en: "Version · September 13, 2026", de: "Stand: 13. September 2026" },
    title: { en: "Cookie Policy", de: "Cookie-Richtlinie" },
    summary: { en: "The only storage this website uses — and why.", de: "Die einzige Speicherung, die diese Website nutzt – und warum." },
    sections: (_site, locale) => {
      const de = locale === "de";
      return [
        {
          h: de ? "Nur notwendige Speicherung" : "Essential storage only",
          body: (
            <>
              <p>{de ? "Diese Website verwendet derzeit ausschließlich technisch notwendige Speicherung:" : "This website currently uses only strictly necessary storage:"}</p>
              <ul className="list-disc pl-6">
                <li>
                  <code>aviora-consent-v1</code> {de ? "(Local Storage) – speichert Ihre Auswahl im Cookie-Hinweis." : "(local storage) — remembers your cookie banner choice."}
                </li>
                <li>
                  <code>aviora-intro</code> {de ? "(Session Storage) – zeigt die Einleitungsanimation nur einmal pro Besuch." : "(session storage) — plays the intro animation only once per visit."}
                </li>
                <li>
                  <code>aviora_admin</code> {de ? "(Cookie) – sichere Sitzung ausschließlich für berechtigte Administratoren." : "(cookie) — secure session for authorized administrators only."}
                </li>
              </ul>
            </>
          ),
        },
        {
          h: de ? "Keine Analyse, keine Werbung" : "No analytics, no advertising",
          body: <p>{de ? "Analyse- oder Werbe-Cookies werden nicht gesetzt. Sollte sich das ändern, passen wir diese Richtlinie und den Cookie-Hinweis vorher an." : "No analytics or advertising cookies are set. If this changes, this policy and the consent banner will be updated first."}</p>,
        },
      ];
    },
  },
  pakistan: {
    region: "pk",
    draft: true,
    version,
    title: { en: "Pakistan — Planned Karachi Presence", de: "Pakistan – geplante Präsenz in Karatschi" },
    summary: { en: "Current status of the planned Karachi presence and the details still to be confirmed.", de: "Aktueller Stand der geplanten Präsenz in Karatschi und noch zu bestätigende Angaben." },
    sections: (site, locale) => {
      const de = locale === "de";
      const field = (value: string, label: string) => value || <Todo locale={locale}>{label}</Todo>;
      return [
        {
          h: de ? "Aktueller Stand" : "Current status",
          body: (
            <p>
              {de
                ? `${site.name} arbeitet von Berlin, Deutschland, aus. Eine Präsenz in Karatschi, Pakistan, ist geplant und auf dieser Website als „demnächst eröffnet“ gekennzeichnet. Zum Zeitpunkt dieser Veröffentlichung betreibt ${site.name} in Pakistan kein Büro und keine Niederlassung.`
                : `${site.name} operates from Berlin, Germany. A presence in Karachi, Pakistan, is planned and is marked on this website as “opening soon”. At the time of publication, ${site.name} does not operate an office or branch in Pakistan.`}
            </p>
          ),
        },
        {
          h: de ? "Leistungen für Studierende in Pakistan" : "Services for students in Pakistan",
          body: (
            <>
              <p>
                {de
                  ? `Studierende in Pakistan werden derzeit aus der Ferne von ${site.name} in Berlin betreut – per Videoanruf, Telefon, E-Mail und WhatsApp. Anbieter der Leistungen ist ${site.name} gemäß Impressum.`
                  : `Students in Pakistan are currently supported remotely by ${site.name} in Berlin — by video call, phone, email and WhatsApp. The provider of these services is ${site.name} as stated in the legal notice (Impressum).`}
              </p>
              <p>
                <Todo locale={locale}>{de ? "anwaltlich klären, welches Recht für Verträge mit Klienten in Pakistan gilt" : "confirm with a lawyer which law applies to contracts with clients in Pakistan"}</Todo>
              </p>
            </>
          ),
        },
        {
          h: de ? "Registrierungsangaben (sobald vorhanden)" : "Registration details (once available)",
          body: (
            <p>
              {de ? "Name der Gesellschaft/Niederlassung" : "Registered entity or branch"}: {field(site.settings.pkEntityName, de ? "erst nach tatsächlicher Registrierung eintragen" : "add only after actual registration")}
              <br />
              {de ? "SECP-Registrierungsnummer" : "SECP registration number"}: {field(site.settings.pkRegistration, de ? "falls zutreffend" : "if applicable")}
              <br />
              {de ? "NTN (Steuernummer)" : "NTN (National Tax Number)"}: {field(site.settings.pkNtn, de ? "falls zutreffend" : "if applicable")}
              <br />
              {de ? "Adresse in Karatschi" : "Karachi address"}: {field(site.settings.pkAddress, de ? "erst nach Eröffnung" : "only once the presence exists")}
            </p>
          ),
        },
        {
          h: de ? "Vor der Eröffnung rechtlich zu prüfen" : "To be reviewed before opening",
          body: (
            <>
              <p>{de ? "Folgende Punkte sollten vor der Eröffnung mit einer in Pakistan zugelassenen Rechtsberatung geklärt werden:" : "The following points should be confirmed with a lawyer qualified in Pakistan before opening:"}</p>
              <ul className="list-disc pl-6">
                {(de
                  ? ["Gründung einer Gesellschaft oder Registrierung einer Niederlassung (z. B. bei der SECP)", "steuerliche Registrierung (z. B. NTN beim FBR)", "etwaige Lizenz- oder Registrierungspflichten für Bildungsberatungen und die Beratung zu Auslandsstudium und Migration", "Arbeits-, Miet- und Vertragsrecht vor Ort", "Datenschutzanforderungen für die Verarbeitung von Klientendaten in Pakistan"]
                  : ["company formation or branch registration (e.g. with the SECP)", "tax registration (e.g. NTN with the FBR)", "any licensing or registration requirements for education consultancies and for advice on studying and migrating abroad", "local employment, lease and contract law", "data protection requirements for processing client data in Pakistan"]
                ).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </>
          ),
        },
        {
          h: de ? "Datenschutz" : "Data protection",
          body: <p>{de ? "Daten von Studierenden aus Pakistan werden derzeit von AVIORA EDU in Deutschland nach der DSGVO verarbeitet. Einzelheiten finden Sie in unserer Datenschutzerklärung." : "Data from students in Pakistan is currently processed by AVIORA EDU in Germany under the GDPR. Details are in our privacy policy."}</p>,
        },
        {
          h: de ? "Kontakt" : "Contact",
          body: (
            <p>
              {de ? "E-Mail" : "Email"}: <Mail site={site} locale={locale} />
            </p>
          ),
        },
      ];
    },
  },
};
