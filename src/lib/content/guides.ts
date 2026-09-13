/**
 * Informational guides (topic clusters for "study in Germany" search intent).
 * Content is deliberately general and points to official sources, because rules and amounts
 * change. Review dates and wording before publishing updates. AVIORA EDU's own service is study
 * guidance; the Opportunity Card and Ausbildung guides are informational only.
 */
export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  reviewed: string; // ISO date the content was last reviewed
  sections: { heading: string; body: string[]; bullets?: string[] }[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  relatedService: "study" | "informational";
};

export const guides: Guide[] = [
  {
    slug: "germany-student-visa",
    title: "Germany student visa: requirements and process",
    metaTitle: "Germany Student Visa: Requirements, Documents, Process",
    description:
      "How the German student visa works: admission, blocked account, health insurance, APS where required, the application steps and life after arrival.",
    eyebrow: "Guide · Student visa",
    intro:
      "Most students from outside the EU need a national visa for study before traveling to Germany. This guide explains the typical requirements and steps so you can prepare early.",
    reviewed: "2026-09-13",
    sections: [
      {
        heading: "Who needs a German student visa?",
        body: [
          "Citizens of EU/EEA countries and Switzerland do not need a visa to study in Germany. Most other nationalities — including Pakistan, India, Bangladesh, Saudi Arabia and the UAE — apply for a national (type D) visa for study purposes at the German embassy or consulate responsible for their place of residence.",
          "Always check the current rules for your nationality on the website of the German mission in your country.",
        ],
      },
      {
        heading: "Typical documents",
        body: ["Exact requirements are set by the German mission handling your application. Commonly requested documents include:"],
        bullets: [
          "Valid passport and completed application form",
          "Admission letter from a German university (or a Studienkolleg / conditional admission where accepted)",
          "Proof of financial resources — often a blocked account (Sperrkonto) holding the amount set each year by the German government, or a formal obligation letter",
          "Health insurance coverage",
          "Academic certificates and, where required, language certificates",
          "APS certificate for applicants from countries where the Academic Evaluation Centre (APS) procedure applies — for example India",
        ],
      },
      {
        heading: "Application steps",
        body: [],
        bullets: [
          "Secure university admission (or apply for a student applicant visa if your mission offers it)",
          "Arrange proof of financial resources and health insurance",
          "Book a visa appointment early — waiting times can be long in high-demand locations",
          "Attend the appointment with complete documents",
          "After arrival: register your address (Anmeldung) and apply for your residence permit at the local immigration office (Ausländerbehörde)",
        ],
      },
      {
        heading: "Working while studying",
        body: [
          "International students may work for a limited amount of time per year alongside their studies. The current limits are published by the Federal Government and the Federal Employment Agency — check them before accepting a job.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can AVIORA EDU guarantee a German student visa?",
        a: "No. Visa decisions are made solely by the German authorities. We help you understand the requirements and prepare a complete, well-organized application.",
      },
      {
        q: "How much money do I need in a blocked account?",
        a: "The required amount is set by the German government and is updated periodically. Check the current figure on the German Federal Foreign Office or your German mission's website before opening an account.",
      },
      {
        q: "When should I apply for the visa?",
        a: "As soon as you have your admission letter. Appointment waiting times vary by country, so starting early is strongly recommended.",
      },
    ],
    sources: [
      { label: "Federal Foreign Office — Visa for study", url: "https://www.auswaertiges-amt.de/en/visa-service" },
      { label: "Make it in Germany — Studying", url: "https://www.make-it-in-germany.com/en/study-training/studies-in-germany" },
      { label: "DAAD — Entry and residence", url: "https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/" },
    ],
    relatedService: "study",
  },
  {
    slug: "germany-opportunity-card",
    title: "Germany Opportunity Card (Chancenkarte) explained",
    metaTitle: "Germany Opportunity Card (Chancenkarte) — Overview",
    description:
      "What Germany's Opportunity Card (Chancenkarte) is, who can apply, how the points system works and how it differs from coming to Germany to study.",
    eyebrow: "Guide · Opportunity Card",
    intro:
      "The Opportunity Card (Chancenkarte) lets qualified non-EU professionals come to Germany to look for work. It is a different pathway from studying — this overview helps you understand the difference.",
    reviewed: "2026-09-13",
    sections: [
      {
        heading: "What is the Opportunity Card?",
        body: [
          "Introduced in June 2024, the Opportunity Card is a residence permit for job seekers from outside the EU. It allows holders to stay in Germany for a limited period to search for qualified employment, and to take up part-time or trial work while searching, within the conditions set by law.",
        ],
      },
      {
        heading: "Who can apply?",
        body: ["There are two main routes:"],
        bullets: [
          "People whose foreign vocational or academic qualification is fully recognized in Germany",
          "People with a qualification recognized in their country of origin who reach the required number of points — for example for German or English language skills, work experience, age and previous stays in Germany — and meet the basic language and financial requirements",
        ],
      },
      {
        heading: "Opportunity Card or studying in Germany?",
        body: [
          "The Opportunity Card is designed for people who already have a qualification and want to work. If you want to earn a German degree first, a student visa is the relevant route — graduates of German universities can then apply for a residence permit to look for work after graduation.",
          "AVIORA EDU focuses on study pathways. For Opportunity Card applications, rely on the official government information linked below.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does AVIORA EDU process Opportunity Card applications?",
        a: "No. Our services focus on university study in Germany and selected European countries. This page is general information; please use the official sources for Opportunity Card applications.",
      },
      {
        q: "Can I study with an Opportunity Card?",
        a: "The Opportunity Card is intended for job seekers. If your main goal is a degree, apply for a student visa instead.",
      },
    ],
    sources: [
      { label: "Make it in Germany — Opportunity Card", url: "https://www.make-it-in-germany.com/en/visa-residence/types/job-search-opportunity-card" },
      { label: "Federal Foreign Office — Visa service", url: "https://www.auswaertiges-amt.de/en/visa-service" },
    ],
    relatedService: "informational",
  },
  {
    slug: "ausbildung-germany",
    title: "Ausbildung in Germany: vocational training explained",
    metaTitle: "Ausbildung in Germany — Vocational Training Explained",
    description:
      "How Germany's dual vocational training works: company and vocational school, pay, language requirements, the visa and how it compares with university.",
    eyebrow: "Guide · Ausbildung",
    intro:
      "Ausbildung is Germany's dual vocational training system, combining paid work in a company with classes at a vocational school. It is an alternative to university study for many careers.",
    reviewed: "2026-09-13",
    sections: [
      {
        heading: "How dual vocational training works",
        body: [
          "An Ausbildung usually lasts two to three and a half years. Trainees spend part of the week working in a training company and part at a vocational school (Berufsschule), and receive a monthly training allowance from the company.",
        ],
      },
      {
        heading: "Typical requirements for international applicants",
        body: [],
        bullets: [
          "A training contract with a German company",
          "A school-leaving certificate that is recognized as equivalent",
          "German language skills — many companies expect an intermediate level, because training and school are in German",
          "A visa for vocational training where required by your nationality",
        ],
      },
      {
        heading: "Ausbildung or university?",
        body: [
          "University programs lead to academic degrees and are often available in English at master's level. Ausbildung leads to a recognized vocational qualification and is almost always in German. The right choice depends on your goals, previous education and language skills.",
          "AVIORA EDU focuses on university study pathways. If you are unsure which route suits you, a consultation can help you compare study options.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does AVIORA EDU arrange Ausbildung placements?",
        a: "No. We focus on university admissions. This guide is general information to help you compare pathways.",
      },
      {
        q: "Is Ausbildung available in English?",
        a: "Rarely. Vocational training and the vocational school are generally conducted in German.",
      },
    ],
    sources: [
      { label: "Make it in Germany — Vocational training", url: "https://www.make-it-in-germany.com/en/study-training/training-in-germany" },
      { label: "Federal Employment Agency — Training", url: "https://www.arbeitsagentur.de/en" },
    ],
    relatedService: "informational",
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug) ?? null;
