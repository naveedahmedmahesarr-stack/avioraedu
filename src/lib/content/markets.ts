/**
 * Country landing pages: "study in Germany from <country>".
 *
 * Each page answers what actually differs by country — which certificates are commonly held,
 * where the visa is applied for, country-specific document steps and planning notes.
 * Facts are deliberately hedged where rules vary by university or change over time, and every
 * page links to official sources. Review these pages whenever German entry rules change.
 */
export type Market = {
  slug: string;
  country: string;
  /** Used in sentences: "students from {inCountry}" */
  inCountry: string;
  iso: string;
  metaTitle: string;
  description: string;
  h1: string;
  intro: string;
  eligibility: string[];
  visa: string[];
  missions: string[];
  notes: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
};

const DAAD_DB = { label: "DAAD — Admission requirements database", url: "https://www.daad.de/en/studying-in-germany/requirements/admission-database/" };
const AA_MISSIONS = { label: "Federal Foreign Office — German missions abroad", url: "https://www.auswaertiges-amt.de/en/about-us/auslandsvertretungen" };
const AA_VISA = { label: "Federal Foreign Office — Visa service", url: "https://www.auswaertiges-amt.de/en/visa-service" };
const MIIG_STUDY = { label: "Make it in Germany — Studying in Germany", url: "https://www.make-it-in-germany.com/en/study-training/studies-in-germany" };

const GULF_CURRICULA =
  "Admission is based on the certificate you hold, not the country you live in. British A-levels, the IB Diploma, American high school diplomas, Indian CBSE/ISC and Pakistani certificates are each assessed under their own German rules. The IB Diploma and A-levels can give direct access when the subject combination meets German conditions; an American diploma usually needs additional proof such as AP exams, SAT scores or completed college study.";

export const markets: Market[] = [
  {
    slug: "pakistan",
    country: "Pakistan",
    inCountry: "Pakistan",
    iso: "PK",
    metaTitle: "Study in Germany from Pakistan: Visa Guide",
    description:
      "Study in Germany from Pakistan: how HSSC/FSc and Pakistani degrees are assessed, Studienkolleg options and the student visa from Islamabad or Karachi.",
    h1: "Studying in Germany from Pakistan",
    intro:
      "Germany is a realistic option for many Pakistani students, particularly for master's programs in engineering, computer science and business. The first question is almost always the same: does my qualification give me access to a German program? Here is how it usually works.",
    eligibility: [
      "For bachelor's programs, the Pakistani Higher Secondary School Certificate (HSSC/FSc) alone generally does not give direct access to a German university. The usual routes are a Studienkolleg (a preparatory year ending in an assessment exam) or successful completion of one or more years of university study in Pakistan in a related subject.",
      "For master's programs, German universities look closely at the length and content of your bachelor's degree. Four-year bachelor's degrees are generally easier to match to German requirements than two-year degrees, and universities compare your modules with their own entry criteria.",
      "Rules differ between universities and subjects, so always check your specific certificate in the DAAD admission database and the program's own requirements.",
    ],
    visa: [
      "Pakistani citizens need a national visa for study. It is applied for at the German mission responsible for your place of residence in Pakistan.",
      "Plan for proof of financial resources (commonly a blocked account), health insurance, your admission letter and certified academic documents. Universities and the embassy may ask for degrees attested by the Higher Education Commission (HEC) and certificates verified by the relevant board.",
      "Appointment availability has often been limited, so apply as soon as you receive admission.",
    ],
    missions: ["Embassy of the Federal Republic of Germany, Islamabad", "Consulate General of the Federal Republic of Germany, Karachi"],
    notes: [
      { title: "English-taught master's programs", body: "Many Pakistani applicants target English-taught master's programs. Most require IELTS or TOEFL; some universities accept proof that your previous degree was taught in English — check each program individually." },
      { title: "Deadlines", body: "Many universities close winter-semester applications for non-EU applicants around 15 July and summer-semester applications around 15 January, but a large number set earlier deadlines. Given document attestation and visa waiting times, starting 9–12 months ahead is sensible." },
      { title: "uni-assist", body: "Many German universities evaluate international certificates through uni-assist before they decide. This adds processing time and a fee, so it should be part of your plan from the start." },
    ],
    faqs: [
      { q: "Can I study a bachelor's in Germany with FSc or ICS?", a: "Usually not directly. Most students with an HSSC qualification go through a Studienkolleg or first complete university study in Pakistan. The exact rule depends on your certificate and subject — the DAAD admission database is the reference." },
      { q: "Is a two-year bachelor's degree from Pakistan accepted for a German master's?", a: "It is often not sufficient on its own. German universities assess credits and content; many expect a degree comparable to a German bachelor's, which usually means a longer program. We check this against your chosen programs before you apply." },
      { q: "Do you guarantee admission or a visa?", a: "No. Universities decide admission and the German mission decides the visa. We help you choose realistic programs and prepare complete, accurate applications." },
    ],
    sources: [DAAD_DB, { label: "German Missions in Pakistan", url: "https://pakistan.diplo.de/" }, AA_VISA, MIIG_STUDY],
  },
  {
    slug: "india",
    country: "India",
    inCountry: "India",
    iso: "IN",
    metaTitle: "Study in Germany from India: APS & Visa",
    description:
      "Study in Germany from India: the mandatory APS certificate, how Class 12 and three-year degrees are assessed, and how the student visa process works.",
    h1: "Studying in Germany from India",
    intro:
      "India sends more students to Germany than almost any other country, and the process has one step Indian students cannot skip: the APS certificate. This page explains the order of steps so you don't lose months.",
    eligibility: [
      "For bachelor's programs, Indian Class 12 certificates (CBSE, ISC or state boards) generally do not give direct access on their own. Common routes are a Studienkolleg or completed study at an Indian university; in some cases specific entrance exam results are taken into account. Check your case in the DAAD admission database.",
      "For master's programs, many universities accept three-year Indian bachelor's degrees, while others require a four-year degree or a certain number of credits in specific subjects. This is one of the most common reasons applications are rejected, so it is worth checking before paying application fees.",
    ],
    visa: [
      "Indian applicants for a German student visa must obtain an APS certificate from the Academic Evaluation Centre (APS) in India. The APS verifies your academic documents and is required before the visa application, so start it early — often before or alongside your university applications.",
      "You apply for a national visa for study at the German mission responsible for your state of residence, with your admission letter, APS certificate, proof of financial resources (commonly a blocked account) and health insurance.",
    ],
    missions: [
      "Embassy of the Federal Republic of Germany, New Delhi",
      "Consulates General in Mumbai, Chennai, Kolkata and Bengaluru",
    ],
    notes: [
      { title: "APS timing", body: "Processing times for the APS vary. Because it is needed for the visa and requested by many universities, we recommend applying for it as soon as your final degree documents are available." },
      { title: "Public vs private universities", body: "Most public universities charge no general tuition for most programs, but some federal states charge non-EU students. Private universities charge full tuition. We compare the real total cost, including the semester contribution and living costs." },
      { title: "Language", body: "English-taught master's programs usually require IELTS or TOEFL. German language skills — even basic — make everyday life, part-time work and the job search after graduation noticeably easier." },
    ],
    faqs: [
      { q: "Is APS mandatory for Indian students?", a: "Yes. Indian applicants for a German student visa need an APS certificate from the Academic Evaluation Centre in India. Check the APS India website for the current procedure and fees." },
      { q: "Can I do a master's in Germany with a three-year BSc or BCom?", a: "Often yes, but not always. Some programs require a four-year degree or specific credits. We check the requirements of each program on your shortlist against your transcript." },
      { q: "Do you guarantee admission or a visa?", a: "No. Universities and German authorities make those decisions. Our role is to help you apply to suitable programs with complete, correct documents." },
    ],
    sources: [{ label: "APS India — Academic Evaluation Centre", url: "https://aps-india.de/" }, { label: "German Missions in India", url: "https://india.diplo.de/" }, DAAD_DB, AA_VISA],
  },
  {
    slug: "bangladesh",
    country: "Bangladesh",
    inCountry: "Bangladesh",
    iso: "BD",
    metaTitle: "Study in Germany from Bangladesh: Visa Guide",
    description:
      "Study in Germany from Bangladesh: HSC and bachelor's assessment, Studienkolleg, English-taught master's programs and the student visa from Dhaka.",
    h1: "Studying in Germany from Bangladesh",
    intro:
      "For Bangladeshi students, Germany is most often a master's destination: English-taught programs, low or no tuition at most public universities and strong technical faculties. Good planning matters because document checks and visa appointments take time.",
    eligibility: [
      "For bachelor's programs, the Bangladeshi Higher Secondary Certificate (HSC) generally does not give direct access to German universities. The usual routes are a Studienkolleg or completed university study in Bangladesh.",
      "For master's programs, a four-year bachelor's degree in a related subject is the most common basis. Universities review your grades, credits and course content, and some ask for a grade conversion using the German formula.",
      "Always confirm the rule for your certificate in the DAAD admission database.",
    ],
    visa: [
      "Bangladeshi citizens need a national visa for study, applied for at the German Embassy in Dhaka.",
      "Typical documents include the admission letter, proof of financial resources (commonly a blocked account), health insurance and your academic records. Demand for appointments has been high, so apply as soon as you have admission.",
    ],
    missions: ["Embassy of the Federal Republic of Germany, Dhaka"],
    notes: [
      { title: "Choosing realistic programs", body: "Competitive English-taught programs receive many applications. A balanced shortlist — including Universities of Applied Sciences and less-crowded cities — usually improves your chances more than applying only to the best-known names." },
      { title: "Costs to budget for", body: "Beyond tuition, plan for uni-assist fees where applicable, the blocked account, health insurance, the semester contribution, the visa fee and your first months of rent." },
    ],
    faqs: [
      { q: "Can I study in Germany after HSC?", a: "Usually through a Studienkolleg or after completing some university study in Bangladesh. Direct admission to a bachelor's program with HSC alone is generally not possible." },
      { q: "Is IELTS required?", a: "Most English-taught programs ask for IELTS or TOEFL. Some accept an English-medium instruction certificate, but this varies — check each program." },
      { q: "Do you guarantee admission or a visa?", a: "No. Decisions are made by universities and the German Embassy. We help you prepare a strong, complete application." },
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA, MIIG_STUDY],
  },
  {
    slug: "uae",
    country: "United Arab Emirates",
    inCountry: "the UAE",
    iso: "AE",
    metaTitle: "Study in Germany from the UAE and Dubai",
    description:
      "Study in Germany from Dubai or Abu Dhabi: how A-levels, IB, American, CBSE and Pakistani certificates are assessed, and the visa for UAE residents.",
    h1: "Studying in Germany from the UAE and Dubai",
    intro:
      "Students in Dubai, Abu Dhabi and Sharjah come from dozens of school systems. That is what makes planning for Germany from the UAE different: your options depend on your curriculum and your passport as much as on your grades.",
    eligibility: [GULF_CURRICULA, "For master's programs, German universities assess your bachelor's degree on its content and credits, wherever it was earned. Degrees from UAE branch campuses of foreign universities are assessed individually."],
    visa: [
      "Whether you need a visa depends on your nationality: EU citizens do not, most other nationalities do. The national visa for study is generally applied for at the German mission responsible for where you legally live, so UAE residents usually apply in the UAE with a valid residence permit.",
      "Keep your UAE residence visa valid throughout the process, and check the German mission's website for the documents required for your nationality.",
    ],
    missions: ["Embassy of the Federal Republic of Germany, Abu Dhabi", "Consulate General of the Federal Republic of Germany, Dubai"],
    notes: [
      { title: "Expatriate families", body: "Many UAE-based students hold Indian, Pakistani or other passports. Some nationality-specific rules still apply — for example, Indian nationals should check whether the APS procedure applies to their case." },
      { title: "School leavers", body: "Final-year students can often apply with predicted or provisional results for some programs, but admission is conditional until final certificates arrive. We plan the timeline around your exam board's results date." },
    ],
    faqs: [
      { q: "Can I apply for a German student visa in Dubai if I am not Emirati?", a: "Usually yes, if you legally reside in the UAE. Visa applications are generally handled by the mission responsible for your place of residence. Confirm the current rules for your nationality with the German missions in the UAE." },
      { q: "Do IB and A-level students get direct admission in Germany?", a: "Often, if your subject combination and grades meet the German conditions. We check this before you apply." },
      { q: "Do you have an office in Dubai?", a: "We work with students in the UAE remotely by WhatsApp, email and video call. Our contact details are on the contact page." },
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA, MIIG_STUDY],
  },
  {
    slug: "saudi-arabia",
    country: "Saudi Arabia",
    inCountry: "Saudi Arabia",
    iso: "SA",
    metaTitle: "Study in Germany from Saudi Arabia: Visa Guide",
    description:
      "Study in Germany from Riyadh, Jeddah or Dammam: how Saudi and international-school certificates are assessed and how the student visa works.",
    h1: "Studying in Germany from Saudi Arabia",
    intro:
      "Students in Saudi Arabia include Saudi nationals and a large expatriate community attending international and community schools. Both groups can study in Germany — but the admission rules that apply depend on the certificate each student holds.",
    eligibility: [
      "Saudi national secondary school certificates are assessed individually against German rules; depending on the certificate and results, the route may be a Studienkolleg or prior university study rather than direct bachelor's admission. Check the DAAD admission database.",
      GULF_CURRICULA,
    ],
    visa: [
      "Saudi citizens and most expatriate residents need a national visa for study. Apply at the German mission responsible for your place of residence in Saudi Arabia, with a valid residence permit if you are not a Saudi national.",
      "Typical documents include the admission letter, proof of financial resources, health insurance and academic records.",
    ],
    missions: ["Embassy of the Federal Republic of Germany, Riyadh", "Consulate General of the Federal Republic of Germany, Jeddah"],
    notes: [
      { title: "Scholarship and sponsor letters", body: "If a sponsor or scholarship covers your costs, the German mission may accept a formal sponsorship document instead of, or in addition to, a blocked account. Requirements are strict, so confirm the exact format before relying on it." },
      { title: "Language preparation", body: "English-taught programs need IELTS or TOEFL in most cases. For German-taught programs, plan a longer preparation period for a recognized German certificate such as TestDaF or DSH." },
    ],
    faqs: [
      { q: "Can expatriates in Saudi Arabia apply for a German student visa locally?", a: "Generally yes, if you legally reside in Saudi Arabia. Check the current requirements for your nationality with the German missions in Riyadh or Jeddah." },
      { q: "Can I study in Germany in English?", a: "Yes, especially at master's level. English-taught bachelor's programs exist but are fewer." },
      { q: "Do you guarantee admission or a visa?", a: "No. Universities and German authorities decide. We help you apply well." },
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA, MIIG_STUDY],
  },
  {
    slug: "qatar",
    country: "Qatar",
    inCountry: "Qatar",
    iso: "QA",
    metaTitle: "Study in Germany from Qatar: Admission & Visa",
    description:
      "Study in Germany from Doha: how Qatari and international-school certificates are assessed, the student visa for residents and a realistic timeline.",
    h1: "Studying in Germany from Qatar",
    intro:
      "Most students we hear from in Qatar attend international schools in Doha or already hold a degree and want a German master's. The planning questions are practical: is my certificate enough, where do I apply for the visa, and how long does it all take?",
    eligibility: [
      "The Qatari national secondary certificate is assessed individually against German rules — check the DAAD admission database for whether it gives direct access or requires a Studienkolleg.",
      GULF_CURRICULA,
    ],
    visa: [
      "The German Embassy in Doha is the mission for residents of Qatar. Visa requirements depend on your nationality; if you are not a Qatari citizen, keep your Qatar residence permit valid during the process.",
      "Check the embassy's website for current appointment arrangements and the documents required for study visas.",
    ],
    missions: ["Embassy of the Federal Republic of Germany, Doha"],
    notes: [
      { title: "Timeline", body: "With a single mission handling applications, allow extra time between admission and your planned departure. We build a month-by-month plan working back from the semester start." },
      { title: "Graduates working in Qatar", body: "If you already work in Qatar and want a German master's, relevant work experience can strengthen applications to some programs — especially at Universities of Applied Sciences." },
    ],
    faqs: [
      { q: "Where do I apply for a German student visa in Qatar?", a: "At the German Embassy in Doha, which covers residents of Qatar. Check its website for current procedures." },
      { q: "Can I apply with an American high school diploma from a school in Doha?", a: "Usually only with additional proof, such as AP exams, SAT scores or completed college study. We check your case against the German rules." },
      { q: "Do you guarantee admission or a visa?", a: "No. Universities and German authorities decide." },
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA],
  },
  {
    slug: "oman",
    country: "Oman",
    inCountry: "Oman",
    iso: "OM",
    metaTitle: "Study in Germany from Oman: Admission & Visa",
    description:
      "Study in Germany from Oman: how the General Education Diploma and international certificates are assessed, plus the student visa from Muscat.",
    h1: "Studying in Germany from Oman",
    intro:
      "Germany and Oman have long academic ties — including a German-Omani university in Muscat — and German engineering and applied-science degrees are well known in the region. Here is what students in Oman should check first.",
    eligibility: [
      "The Omani General Education Diploma is assessed individually against German rules; depending on your results and subjects, the route may be a Studienkolleg or prior university study. Check the DAAD admission database.",
      GULF_CURRICULA,
    ],
    visa: [
      "The German Embassy in Muscat is the mission for residents of Oman. Non-Omani residents should keep their residence permit valid while applying.",
      "Check the embassy's website for current procedures and required documents for study visas.",
    ],
    missions: ["Embassy of the Federal Republic of Germany, Muscat"],
    notes: [
      { title: "Applied sciences", body: "Universities of Applied Sciences (Hochschulen) offer practice-oriented degrees in engineering, logistics and business that suit many students from Oman. They often have different entry requirements from research universities." },
      { title: "Sponsorship", body: "If a government or employer sponsor is funding your studies, confirm early how the German mission wants the sponsorship documented as proof of financial resources." },
    ],
    faqs: [
      { q: "Where do I apply for a German student visa in Oman?", a: "At the German Embassy in Muscat. Check its website for current procedures." },
      { q: "Can I study engineering in Germany in English?", a: "Yes, particularly at master's level. Bachelor's engineering programs are mostly taught in German." },
      { q: "Do you guarantee admission or a visa?", a: "No. Universities and German authorities decide." },
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA],
  },
  {
    slug: "bahrain",
    country: "Bahrain",
    inCountry: "Bahrain",
    iso: "BH",
    metaTitle: "Study in Germany from Bahrain: Admission & Visa",
    description:
      "Study in Germany from Bahrain: how Bahraini and international-school certificates are assessed and how to apply for a student visa in Manama.",
    h1: "Studying in Germany from Bahrain",
    intro:
      "Bahrain is small, but its students come from many school systems — national, British, American and Indian among them. For Germany, that curriculum decides the route, so it is the first thing we look at.",
    eligibility: [
      "The Bahraini general secondary school certificate is assessed individually against German rules — check the DAAD admission database for whether a Studienkolleg is required for your results and subjects.",
      GULF_CURRICULA,
    ],
    visa: [
      "The German Embassy in Manama is the mission for residents of Bahrain. Visa requirements depend on your nationality; non-Bahraini residents should keep their residence permit valid.",
      "Check the embassy's website for current appointment arrangements and required documents.",
    ],
    missions: ["Embassy of the Federal Republic of Germany, Manama"],
    notes: [
      { title: "Short distances, long lead times", body: "Bahrain's size doesn't shorten German processes: uni-assist evaluation, the blocked account and visa processing each take weeks. Starting early is the single best thing you can do." },
      { title: "Choosing a city", body: "Living costs differ a lot between German cities. Munich and Frankfurt are expensive; many university cities in eastern and central Germany are considerably cheaper." },
    ],
    faqs: [
      { q: "Where do I apply for a German student visa in Bahrain?", a: "At the German Embassy in Manama. Check its website for current procedures." },
      { q: "Do A-level students need a Studienkolleg?", a: "Not always. With the right number of A-levels in suitable subjects, direct admission is often possible. We check your subject combination." },
      { q: "Do you guarantee admission or a visa?", a: "No. Universities and German authorities decide." },
    ],
    sources: [DAAD_DB, AA_MISSIONS, AA_VISA],
  },
];

export const getMarket = (slug: string) => markets.find((m) => m.slug === slug) ?? null;
