import { z } from "zod";

const text = (max = 200) => z.string().trim().max(max);
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "Must be https:// or a site path")
  .default("");
const base = {
  id: z.string().min(1).max(64),
  published: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
};

export const destinationSchema = z.object({
  ...base,
  name: text(80).min(1),
  country: text(80).min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes"),
  flag: text(8), // ISO alpha-2 code used by <Flag />
  primary: z.boolean().default(false),
  tagline: text(160).default(""),
  description: text(4000).default(""),
  heroImage: optionalUrl,
  gallery: z.array(optionalUrl).default([]),
  benefits: z.array(text(300)).default([]),
  lifestyle: z.array(text(300)).default([]),
  cities: z.array(text(80)).default([]),
  universities: z.array(text(160)).default([]),
  order: z.number().int().default(0),
  // German versions (empty = English is shown on German pages)
  nameDe: text(80).default(""),
  taglineDe: text(160).default(""),
  descriptionDe: text(4000).default(""),
  benefitsDe: z.array(text(300)).default([]),
  lifestyleDe: z.array(text(300)).default([]),
});

export const universitySchema = z.object({
  ...base,
  name: text(160).min(1),
  country: text(80).min(1),
  city: text(80).min(1),
  logo: optionalUrl,
  image: optionalUrl,
  description: text(3000).default(""),
  programs: z.array(text(160)).default([]),
  fields: z.array(text(80)).default([]),
  studyLevels: z.array(z.enum(["Bachelor", "Master", "PhD", "Foundation"])).default([]),
  language: z.array(z.enum(["English", "German", "Italian", "Polish", "Portuguese"])).default([]),
  tuition: text(300).default(""),
  applicationInfo: text(600).default(""),
  institutionType: z.enum(["Public", "Private"]).default("Public"),
  website: optionalUrl,
  /** Internal "details still to double-check" flag — not shown on the public site. */
  sample: z.boolean().default(false),
  descriptionDe: text(3000).default(""),
  tuitionDe: text(300).default(""),
  applicationInfoDe: text(600).default(""),
});

export const dreamStorySchema = z.object({
  ...base,
  studentName: text(120).min(1),
  /** Name shown publicly (e.g. first name + initial). Empty = studentName, only with consent to publish the full name. */
  displayName: text(120).default(""),
  sourceCountry: text(80).min(1),
  destination: text(80).min(1),
  visaType: text(80).default(""),
  university: text(160).default(""),
  program: text(160).default(""),
  intake: text(40).default(""),
  successYear: text(10).default(""),
  photo: optionalUrl,
  video: optionalUrl,
  /** Redacted copy only — redaction is burned in by the Admin editor before upload; originals are never stored. */
  visaDocument: optionalUrl,
  story: text(6000).min(1),
  /** The student's own words, verbatim. Empty = no testimonial shown. */
  testimonial: text(2000).default(""),
  consentConfirmed: z.boolean().default(false),
  verified: z.boolean().default(false),
});

export const reviewSchema = z.object({
  ...base,
  name: text(120).min(1),
  country: text(80).min(1),
  /** 1–5, or 0 when the client gave no rating (testimonials added by admin). */
  rating: z.number().int().min(0).max(5).default(0),
  review: text(3000).min(10),
  photo: optionalUrl,
  destination: text(80).default(""),
  university: text(160).default(""),
  program: text(160).default(""),
  reviewDate: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Use YYYY-MM-DD")
    .default(""),
  featured: z.boolean().default(false),
  source: z.enum(["website", "admin", "external"]).default("website"),
  verified: z.boolean().default(false),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export const faqSchema = z.object({
  ...base,
  question: text(300).min(1),
  answer: text(3000).min(1),
  order: z.number().int().default(0),
  questionDe: text(300).default(""),
  answerDe: text(3000).default(""),
});

export const teamMemberSchema = z.object({
  ...base,
  name: text(120).min(1),
  role: text(120).min(1),
  bio: text(2000).default(""),
  photo: optionalUrl,
  order: z.number().int().default(0),
  /** Only facts supplied by the person — never invented. */
  nationality: text(120).default(""),
  experience: text(160).default(""),
  location: text(120).default(""),
  locationDe: text(120).default(""),
  /** Personal wordmark text (defaults to the name) and an optional uploaded logo that replaces the generated wordmark. */
  logoText: text(80).default(""),
  logoImage: optionalUrl,
  /** logo = wordmark only · photo = photo (falls back to wordmark if none) · logo-photo = photo with wordmark */
  displayMode: z.enum(["logo", "photo", "logo-photo"]).default("logo"),
  roleDe: text(120).default(""),
  bioDe: text(2000).default(""),
  nationalityDe: text(120).default(""),
  experienceDe: text(160).default(""),
});

export const homepageSchema = z.object({
  ...base,
  heroHeadline: text(120).min(1),
  heroSubheadline: text(160).default(""),
  heroMessage: text(400).default(""),
  introStatement: text(600).default(""),
  aboutWho: text(1500).default(""),
  aboutWhat: text(1500).default(""),
  aboutWhy: text(1500).default(""),
  heroHeadlineDe: text(120).default(""),
  heroSubheadlineDe: text(160).default(""),
  heroMessageDe: text(400).default(""),
  introStatementDe: text(600).default(""),
  aboutWhoDe: text(1500).default(""),
  aboutWhatDe: text(1500).default(""),
  aboutWhyDe: text(1500).default(""),
});

export const submissionSchema = z.object({
  ...base,
  fullName: text(120),
  email: z.string(),
  phone: text(40),
  country: text(80),
  destination: text(80),
  studyLevel: text(40),
  studyField: text(120),
  intake: text(60),
  message: text(3000),
  status: z.enum(["new", "contacted", "closed"]).default("new"),
});

/**
 * Business contact settings — single record edited in Admin, used everywhere on the public site.
 * WhatsApp number is stored digits-only in international format (e.g. 4915217595531).
 */
export const settingsSchema = z.object({
  ...base,
  whatsappNumber: z
    .string()
    .transform((s) => s.replace(/[^\d]/g, ""))
    .refine((s) => s === "" || (s.length >= 8 && s.length <= 15 && !s.startsWith("0")), "International format without leading 0, e.g. 4915217595531 (8–15 digits)")
    .default(""),
  whatsappMessage: text(300).default("Hello AVIORA EDU, I would like to discuss studying in Europe."),
  businessEmail: z.union([z.literal(""), z.email("Enter a valid email address")]).default(""),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((s) => s === "" || /^\+?[\d\s()-]{6,}$/.test(s), "Use digits, spaces, +, - or brackets")
    .default(""),
  businessName: text(80).default("AVIORA EDU"),
  /** Public site URL, e.g. https://www.example.com. Empty = NEXT_PUBLIC_SITE_URL. */
  siteUrl: z
    .string()
    .trim()
    .max(200)
    .refine((v) => v === "" || /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\/?$/i.test(v), "Use https://your-domain (no path)")
    .default(""),
  /** Only fill in with a real business address — it is published as structured data. */
  addressStreet: text(160).default(""),
  addressPostalCode: text(20).default(""),
  addressCity: text(80).default(""),
  addressCountry: text(80).default(""),
  socialInstagram: optionalUrl,
  socialFacebook: optionalUrl,
  socialLinkedin: optionalUrl,
  socialYoutube: optionalUrl,
  socialTiktok: optionalUrl,
  whatsappMessageDe: text(300).default("Hallo AVIORA EDU, ich möchte mich über ein Studium in Europa informieren."),
  // Legal details — shown on the legal pages only when filled in. Never invent these.
  legalAddress: text(300).default(""),
  legalForm: text(160).default(""),
  vatId: text(40).default(""),
  registerEntry: text(200).default(""),
  disputeResolution: text(600).default(""),
  pkEntityName: text(200).default(""),
  pkRegistration: text(120).default(""),
  pkNtn: text(60).default(""),
  pkAddress: text(300).default(""),
});

/** Public consultation form — shared by client validation and the API route. */
export const consultationInputSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.email("Please enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a phone number with country code")
    .max(40)
    .regex(/^[+()\d\s-]+$/, "Use digits, spaces, +, - or brackets only"),
  country: z.string().trim().min(2, "Please select your country").max(80),
  destination: z.string().trim().min(2, "Please choose a destination").max(80),
  studyLevel: z.string().trim().min(2, "Please choose a study level").max(40),
  studyField: z.string().trim().min(2, "Please tell us your field of interest").max(120),
  intake: z.string().trim().min(2, "Please choose an intake").max(60),
  message: z.string().trim().max(3000).default(""),
  consent: z.literal(true, { error: "Please agree to be contacted about your inquiry" }),
  company: z.string().max(0).optional(), // honeypot
});
export type ConsultationInput = z.infer<typeof consultationInputSchema>;

export const reviewInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  country: z.string().trim().min(2, "Please enter your country").max(80),
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  review: z.string().trim().min(20, "Please write at least 20 characters").max(3000),
  consent: z.literal(true, { error: "Please confirm this review reflects your own experience" }),
  company: z.string().max(0).optional(),
});

export const collections = {
  destinations: destinationSchema,
  universities: universitySchema,
  dreamStories: dreamStorySchema,
  reviews: reviewSchema,
  faqs: faqSchema,
  team: teamMemberSchema,
  homepage: homepageSchema,
  submissions: submissionSchema,
  settings: settingsSchema,
} as const;

export type CollectionName = keyof typeof collections;
export type Destination = z.infer<typeof destinationSchema>;
export type University = z.infer<typeof universitySchema>;
export type DreamStory = z.infer<typeof dreamStorySchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type Homepage = z.infer<typeof homepageSchema>;
export type Submission = z.infer<typeof submissionSchema>;
export type Settings = z.infer<typeof settingsSchema>;

export type CollectionMap = {
  destinations: Destination;
  universities: University;
  dreamStories: DreamStory;
  reviews: Review;
  faqs: Faq;
  team: TeamMember;
  homepage: Homepage;
  submissions: Submission;
  settings: Settings;
};

export function isCollection(name: string): name is CollectionName {
  return Object.prototype.hasOwnProperty.call(collections, name);
}
