/**
 * What AVIORA EDU actually does. Keep this list honest: the pathway-advice entry explains options
 * but does not claim we process Opportunity Card or Ausbildung applications (see the guides).
 */
export type Service = {
  slug: string;
  title: string;
  summary: string;
  what: string;
  who: string;
  how: string[];
  next: { label: string; href: string };
};

export const services: Service[] = [
  {
    slug: "profile-and-shortlist",
    title: "Profile review & university shortlist",
    summary: "Find out where you realistically fit before you spend money on applications.",
    what: "A structured review of your grades, degree, language scores and budget against the entry rules of German and European universities.",
    who: "School leavers and graduates who know they want to study abroad but aren't sure which programs will accept them.",
    how: [
      "Check whether your certificate gives direct access or needs a Studienkolleg",
      "Compare public and private options, including real total cost",
      "Build a balanced shortlist — ambitious, realistic and safe choices",
    ],
    next: { label: "Book a free first consultation", href: "/contact#consultation" },
  },
  {
    slug: "german-university-admissions",
    title: "German university admissions",
    summary: "Complete, correct applications through university portals and uni-assist.",
    what: "Hands-on support preparing and submitting applications to German universities, from the CV to the final upload.",
    who: "Students with a shortlist who want their applications to be accurate, on time and well presented.",
    how: [
      "Document checklist per program, including certified copies and translations",
      "Feedback on your CV and motivation letter — written by you, sharpened with us",
      "Deadline tracking for winter and summer intakes",
    ],
    next: { label: "Read about studying in Germany", href: "/study-in-germany" },
  },
  {
    slug: "student-visa-preparation",
    title: "Student visa preparation",
    summary: "Know exactly what the German mission expects before your appointment.",
    what: "Guidance on the national visa for study: documents, proof of financial resources, health insurance and the appointment itself.",
    who: "Admitted students preparing their visa application — and anyone who wants to plan the financial side early.",
    how: [
      "Personal document checklist based on your nationality and place of residence",
      "Blocked account and insurance explained step by step",
      "Interview preparation. The decision always rests with the authorities.",
    ],
    next: { label: "Read the student visa guide", href: "/guides/germany-student-visa" },
  },
  {
    slug: "pre-departure-and-arrival",
    title: "Pre-departure & arrival",
    summary: "The practical weeks between your visa and your first lecture.",
    what: "Preparation for travel, accommodation, and the first administrative steps in Germany or elsewhere in Europe.",
    who: "Students with a visa who want their first month to be calm rather than chaotic.",
    how: [
      "Accommodation search advice and what to watch out for",
      "Address registration, bank account and enrollment explained",
      "A contact to ask when something unexpected comes up",
    ],
    next: { label: "Explore Student Support", href: "/student-support" },
  },
  {
    slug: "europe-destinations",
    title: "Italy, Poland, Portugal & Austria",
    summary: "When another European country fits your profile or budget better.",
    what: "The same careful process for our four secondary destinations, each with its own admission rules and costs.",
    who: "Students whose subject, budget or language skills point to a country other than Germany.",
    how: [
      "Side-by-side comparison with your German options",
      "Country-specific application and visa guidance",
      "Honest advice when Germany is the better choice — or isn't",
    ],
    next: { label: "Compare destinations", href: "/destinations" },
  },
  {
    slug: "pathway-advice",
    title: "Pathway advice: study, Ausbildung or Opportunity Card",
    summary: "An honest conversation about which German route suits you.",
    what: "A first consultation that compares university study with vocational training (Ausbildung) and the Opportunity Card. We don't process Ausbildung or Opportunity Card applications; for those we point you to the official procedures.",
    who: "People who aren't sure whether a degree is the right route into Germany.",
    how: [
      "Explain the requirements and trade-offs of each route",
      "Point you to the official sources for non-study routes",
      "Support you fully if university study turns out to be the right fit",
    ],
    next: { label: "Read the Opportunity Card guide", href: "/guides/germany-opportunity-card" },
  },
];
