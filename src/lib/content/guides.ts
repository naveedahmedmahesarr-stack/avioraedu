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
    metaTitle: "Germany Student Visa: Requirements & Process",
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
    metaTitle: "Germany Opportunity Card (Chancenkarte)",
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
    metaTitle: "Ausbildung in Germany: How It Works",
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
  {
    slug: "blocked-account-germany",
    title: "Blocked account (Sperrkonto) for studying in Germany",
    metaTitle: "Blocked Account Germany (Sperrkonto) Explained",
    description:
      "What a German blocked account (Sperrkonto) is, why the student visa usually requires proof of funds, how it works after arrival and which alternatives exist.",
    eyebrow: "Guide · Blocked account",
    intro:
      "To get a German student visa you normally have to show that you can cover your living costs. For many students, a blocked account is how they do that. This guide explains how it works without quoting figures that change — always check the current amount with the official sources below.",
    reviewed: "2026-09-14",
    sections: [
      {
        heading: "What is a blocked account?",
        body: [
          "A blocked account (Sperrkonto) is a special bank account for international students. You deposit the amount required for one year before applying for your visa. After you arrive in Germany, a fixed monthly amount is released to you, so the money covers your living costs over time.",
          "It is one of the most common ways to provide the proof of financial resources that German missions ask for in student visa applications.",
        ],
      },
      {
        heading: "How much money is required?",
        body: [
          "The required amount is set by the German government and is adjusted from time to time. Because it changes, we do not quote a figure here. Check the current amount on the website of the Federal Foreign Office or the German mission responsible for your application before you open an account.",
        ],
      },
      {
        heading: "How it works, step by step",
        body: [],
        bullets: [
          "Choose a provider that the responsible German mission accepts",
          "Open the account online and complete the identity check",
          "Transfer the required amount — international transfers can take several days",
          "Receive the confirmation and include it in your visa application",
          "After arrival: activate payouts to a German bank account and receive the monthly amount",
        ],
      },
      {
        heading: "Alternatives to a blocked account",
        body: ["Depending on your situation, German missions may also accept other proof of financial resources, for example:"],
        bullets: [
          "A formal obligation letter (Verpflichtungserklärung) from a person living in Germany",
          "A scholarship confirmation that covers your living costs",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [],
        bullets: [
          "Transferring less than the full current amount",
          "Waiting too long — the account and transfer should be complete before your visa appointment",
          "Using a provider the responsible mission does not accept",
          "Confusing the blocked account with health insurance, which is a separate requirement",
        ],
      },
    ],
    faqs: [
      {
        q: "Is a blocked account mandatory for a German student visa?",
        a: "Not always. It is the most common proof of financial resources, but missions may accept alternatives such as a formal obligation letter or a scholarship. Check the requirements of the German mission handling your application.",
      },
      {
        q: "Can AVIORA EDU open a blocked account for me?",
        a: "No. You open the account yourself with a provider. We explain how the proof of funds fits into your visa application and help you prepare complete documents.",
      },
      {
        q: "When should I open a blocked account?",
        a: "As soon as you have your admission, or earlier if your visa appointment is close. Opening the account and transferring the money can take time.",
      },
    ],
    sources: [
      { label: "Federal Foreign Office — Visa for study", url: "https://www.auswaertiges-amt.de/en/visa-service" },
      { label: "DAAD — Plan your studies", url: "https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/" },
      { label: "Make it in Germany — Studying", url: "https://www.make-it-in-germany.com/en/study-training/studies-in-germany" },
    ],
    relatedService: "study",
  },
  {
    slug: "public-vs-private-universities-germany",
    title: "Public vs private universities in Germany",
    metaTitle: "Public vs Private Universities in Germany",
    description:
      "How public and private universities in Germany differ in tuition, recognition, admission and study options — and what to check before you apply.",
    eyebrow: "Guide · Universities",
    intro:
      "Germany has both public (state) and private higher education institutions. Both can award recognized degrees, but they differ in cost, size and how you apply. This guide explains the differences so you can build a realistic shortlist.",
    reviewed: "2026-09-14",
    sections: [
      {
        heading: "Public universities",
        body: [
          "Most students in Germany study at public institutions, which are funded by the federal states. At most public universities, bachelor's and many master's programs do not charge tuition fees, although every student pays a semester contribution that covers administration and often a public transport ticket.",
          "There are exceptions: some federal states charge tuition to certain groups. Baden-Württemberg, for example, charges tuition to most students from outside the EU. Always check the current rules of the university and state you are applying to.",
        ],
      },
      {
        heading: "Private universities",
        body: [
          "Private universities are funded mainly through tuition fees. They are often smaller, may offer more programs in English and sometimes have more flexible start dates.",
          "Before applying, check that the institution is state-recognized (staatlich anerkannt). Degrees from state-recognized private universities have the same legal status as degrees from public universities.",
        ],
      },
      {
        heading: "Key differences at a glance",
        body: [],
        bullets: [
          "Cost: public universities rarely charge tuition; private universities usually do",
          "Recognition: public universities are recognized by default; private ones must be state-recognized",
          "Admission: popular public programs can be very competitive; private universities often run their own admission process",
          "Size: public universities are often large; private institutions tend to teach in smaller groups",
        ],
      },
      {
        heading: "How to check recognition and find programs",
        body: [
          "The Higher Education Compass (Hochschulkompass) of the German Rectors' Conference lists state and state-recognized higher education institutions and their degree programs. The DAAD's study resources are a useful starting point for English-taught courses.",
        ],
      },
      {
        heading: "Which is right for you?",
        body: [
          "If cost matters most and your profile is competitive, public universities are usually the first choice. If you need a specific English-taught program, a flexible intake or smaller classes, a state-recognized private university can be worth considering.",
          "For a student visa, you need admission to a recognized institution and must meet the visa requirements, including proof of financial resources.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are degrees from private universities in Germany recognized?",
        a: "Degrees from state-recognized private universities have the same legal status as degrees from public universities. Check recognition in the Hochschulkompass before you apply.",
      },
      {
        q: "Is studying at a public university in Germany free?",
        a: "At most public universities there are no tuition fees for most programs, but you pay a semester contribution, and some federal states charge tuition to certain international students. Check the rules of your university.",
      },
      {
        q: "Does AVIORA EDU work with specific universities?",
        a: "We advise on public and state-recognized private universities based on your profile. We do not claim partnerships with universities.",
      },
    ],
    sources: [
      { label: "Hochschulkompass — German Rectors' Conference", url: "https://www.hochschulkompass.de" },
      { label: "DAAD — Plan your studies", url: "https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/" },
      { label: "Make it in Germany — Studying", url: "https://www.make-it-in-germany.com/en/study-training/studies-in-germany" },
    ],
    relatedService: "study",
  },
  {
    slug: "studienkolleg-germany",
    title: "Studienkolleg: preparatory courses for studying in Germany",
    metaTitle: "Studienkolleg in Germany Explained",
    description:
      "What a Studienkolleg is, who needs one, the course types, the assessment exam (Feststellungsprüfung) and how to apply as an international student.",
    eyebrow: "Guide · Studienkolleg",
    intro:
      "If your school-leaving certificate does not give you direct access to a German university, a Studienkolleg can be your route in. This guide explains who needs one, how the courses work and what to prepare.",
    reviewed: "2026-09-14",
    sections: [
      {
        heading: "What is a Studienkolleg?",
        body: [
          "A Studienkolleg is a preparatory course for international applicants whose secondary school certificate is not recognized as equivalent to the German university entrance qualification. It prepares you for university study in your subject area and usually lasts two semesters.",
        ],
      },
      {
        heading: "Who needs a Studienkolleg?",
        body: [
          "Whether you need one depends on your school certificate, your country and sometimes previous university study. Some applicants can go directly to university, for example after completing part of a degree in their home country.",
          "The anabin database and the DAAD's admission information show how qualifications from many countries are assessed. The university you apply to makes the final decision.",
        ],
      },
      {
        heading: "Course types",
        body: ["Courses focus on the subjects you plan to study. Common course types include:"],
        bullets: [
          "T course — technical, mathematical and natural science subjects",
          "M course — medical, biological and pharmaceutical subjects",
          "W course — economics, business and social sciences",
          "G course — humanities and German studies",
          "S course — languages",
        ],
      },
      {
        heading: "The assessment exam (Feststellungsprüfung)",
        body: [
          "The course ends with the Feststellungsprüfung. Passing it gives you access to university programs in the subject area of your course.",
        ],
      },
      {
        heading: "Admission and language requirements",
        body: [
          "To join a Studienkolleg you usually need to apply through a university or the Studienkolleg itself and pass an entrance exam, which typically tests German and often mathematics. Teaching is in German, so good German skills are essential.",
          "Public Studienkollegs generally do not charge tuition, although a semester contribution applies. Private providers charge fees.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is a Studienkolleg taught in English?",
        a: "Studienkollegs at public institutions are taught in German. If you want to study in English, check whether your qualification allows direct admission to an English-taught program.",
      },
      {
        q: "Can I get a student visa for a Studienkolleg?",
        a: "Preparation for studies, such as attending a Studienkolleg, can be a purpose of a student visa. Check the current requirements with the German mission responsible for your application.",
      },
      {
        q: "Does AVIORA EDU help with Studienkolleg questions?",
        a: "We assess whether you are likely to need a Studienkolleg and explain your options. Admission decisions are made by the Studienkolleg and the university.",
      },
    ],
    sources: [
      { label: "anabin — Recognition of foreign qualifications (KMK)", url: "https://anabin.kmk.org" },
      { label: "DAAD — Plan your studies", url: "https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/" },
      { label: "Make it in Germany — Studying", url: "https://www.make-it-in-germany.com/en/study-training/studies-in-germany" },
    ],
    relatedService: "study",
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug) ?? null;
