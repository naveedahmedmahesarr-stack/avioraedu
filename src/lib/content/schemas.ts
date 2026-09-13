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
  /** Sample/demo entries are labelled in the UI until replaced by verified data. */
  sample: z.boolean().default(false),
});

export const dreamStorySchema = z.object({
  ...base,
  studentName: text(120).min(1),
  sourceCountry: text(80).min(1),
  destination: text(80).min(1),
  university: text(160).default(""),
  program: text(160).default(""),
  intake: text(40).default(""),
  photo: optionalUrl,
  video: optionalUrl,
  story: text(6000).min(1),
  consentConfirmed: z.boolean().default(false),
  verified: z.boolean().default(false),
});

export const reviewSchema = z.object({
  ...base,
  name: text(120).min(1),
  country: text(80).min(1),
  rating: z.number().int().min(1).max(5),
  review: text(3000).min(10),
  photo: optionalUrl,
  source: z.enum(["website", "admin", "external"]).default("website"),
  verified: z.boolean().default(false),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export const faqSchema = z.object({
  ...base,
  question: text(300).min(1),
  answer: text(3000).min(1),
  order: z.number().int().default(0),
});

export const teamMemberSchema = z.object({
  ...base,
  name: text(120).min(1),
  role: text(120).min(1),
  bio: text(2000).default(""),
  photo: optionalUrl,
  order: z.number().int().default(0),
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
  consent: z.literal(true, { error: "Please agree to be contacted about your enquiry" }),
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
