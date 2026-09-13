import type { CollectionName } from "@/lib/content/schemas";

export type Field =
  | { key: string; label: string; type: "text" | "textarea" | "url" | "number" | "bool" | "media-image" | "media-video" | "list"; help?: string }
  | { key: string; label: string; type: "select" | "multi"; options: string[]; help?: string };

export const collectionMeta: Record<CollectionName, { label: string; titleKey: string; subtitleKey?: string; fields: Field[]; canCreate: boolean; single?: boolean }> = {
  settings: {
    label: "Business settings",
    titleKey: "whatsappNumber",
    subtitleKey: "businessEmail",
    canCreate: false,
    single: true,
    fields: [
      { key: "whatsappNumber", label: "WhatsApp number", type: "text", help: "International format, digits only — e.g. 4915217595531 (spaces, + and brackets are removed automatically). Leave empty to hide WhatsApp." },
      { key: "whatsappMessage", label: "WhatsApp pre-filled message", type: "textarea" },
      { key: "businessEmail", label: "Business email", type: "text", help: "Shown on the contact section and footer. Leave empty to hide." },
      { key: "phone", label: "Phone number (optional)", type: "text", help: "e.g. +49 152 17595531. Leave empty to hide." },
    ],
  },
  homepage: {
    label: "Homepage content",
    titleKey: "heroHeadline",
    canCreate: false,
    single: true,
    fields: [
      { key: "heroHeadline", label: "Hero headline", type: "text" },
      { key: "heroSubheadline", label: "Hero supporting headline", type: "text" },
      { key: "heroMessage", label: "Hero message", type: "textarea" },
      { key: "introStatement", label: "Intro statement", type: "textarea" },
      { key: "aboutWho", label: "About — who we are", type: "textarea" },
      { key: "aboutWhat", label: "About — what we do", type: "textarea" },
      { key: "aboutWhy", label: "About — why students choose us", type: "textarea" },
      { key: "published", label: "Published", type: "bool" },
    ],
  },
  destinations: {
    label: "Destinations",
    titleKey: "name",
    subtitleKey: "tagline",
    canCreate: true,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "country", label: "Country", type: "text" },
      { key: "slug", label: "URL slug", type: "text", help: "lowercase-with-dashes" },
      { key: "flag", label: "Flag code", type: "select", options: ["DE", "IT", "PL", "PT", "AT"] },
      { key: "primary", label: "Primary destination", type: "bool" },
      { key: "order", label: "Sort order", type: "number" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "heroImage", label: "Hero image", type: "media-image" },
      { key: "gallery", label: "Gallery image URLs", type: "list", help: "One URL per line (upload images first to get URLs)" },
      { key: "benefits", label: "Benefits", type: "list" },
      { key: "lifestyle", label: "Lifestyle", type: "list" },
      { key: "cities", label: "Cities", type: "list" },
      { key: "universities", label: "Featured universities", type: "list" },
      { key: "published", label: "Published", type: "bool" },
    ],
  },
  universities: {
    label: "Universities",
    titleKey: "name",
    subtitleKey: "city",
    canCreate: true,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "country", label: "Country", type: "select", options: ["Germany", "Italy", "Poland", "Portugal", "Austria"] },
      { key: "city", label: "City", type: "text" },
      { key: "institutionType", label: "Type", type: "select", options: ["Public", "Private"] },
      { key: "description", label: "Description", type: "textarea" },
      { key: "programs", label: "Programmes", type: "list" },
      { key: "fields", label: "Study fields", type: "list" },
      { key: "studyLevels", label: "Study levels", type: "multi", options: ["Foundation", "Bachelor", "Master", "PhD"] },
      { key: "language", label: "Languages", type: "multi", options: ["English", "German", "Italian", "Polish", "Portuguese"] },
      { key: "tuition", label: "Tuition information", type: "textarea" },
      { key: "applicationInfo", label: "Application information", type: "textarea" },
      { key: "website", label: "Official website", type: "url" },
      { key: "logo", label: "Logo (only with permission)", type: "media-image" },
      { key: "image", label: "Image", type: "media-image" },
      { key: "sample", label: "Sample / unverified data", type: "bool", help: "Untick once details are verified" },
      { key: "published", label: "Published", type: "bool" },
    ],
  },
  dreamStories: {
    label: "Dream Stories",
    titleKey: "studentName",
    subtitleKey: "university",
    canCreate: true,
    fields: [
      { key: "studentName", label: "Student name", type: "text" },
      { key: "sourceCountry", label: "Source country", type: "select", options: ["Pakistan", "India", "United Arab Emirates", "Saudi Arabia", "Bangladesh", "Other"] },
      { key: "destination", label: "Destination", type: "select", options: ["Germany", "Italy", "Poland", "Portugal", "Austria"] },
      { key: "university", label: "University", type: "text" },
      { key: "program", label: "Programme", type: "text" },
      { key: "intake", label: "Intake", type: "text" },
      { key: "photo", label: "Photo", type: "media-image" },
      { key: "video", label: "Video", type: "media-video" },
      { key: "story", label: "Story", type: "textarea" },
      { key: "consentConfirmed", label: "Written consent obtained", type: "bool", help: "Required before publishing" },
      { key: "verified", label: "Verified client", type: "bool" },
      { key: "published", label: "Published", type: "bool" },
    ],
  },
  reviews: {
    label: "Reviews",
    titleKey: "name",
    subtitleKey: "status",
    canCreate: true,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "country", label: "Country", type: "text" },
      { key: "rating", label: "Rating (1–5)", type: "number" },
      { key: "review", label: "Review", type: "textarea" },
      { key: "photo", label: "Photo (with consent)", type: "media-image" },
      { key: "source", label: "Source", type: "select", options: ["website", "admin", "external"] },
      { key: "status", label: "Moderation status", type: "select", options: ["pending", "approved", "rejected"] },
      { key: "verified", label: "Verified client", type: "bool", help: "Only tick if you confirmed this person was a client" },
      { key: "published", label: "Published", type: "bool" },
    ],
  },
  faqs: {
    label: "FAQs",
    titleKey: "question",
    canCreate: true,
    fields: [
      { key: "question", label: "Question", type: "text" },
      { key: "answer", label: "Answer", type: "textarea" },
      { key: "order", label: "Sort order", type: "number" },
      { key: "published", label: "Published", type: "bool" },
    ],
  },
  team: {
    label: "Team",
    titleKey: "name",
    subtitleKey: "role",
    canCreate: true,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "bio", label: "Bio", type: "textarea" },
      { key: "photo", label: "Photo", type: "media-image" },
      { key: "order", label: "Sort order", type: "number" },
      { key: "published", label: "Published", type: "bool" },
    ],
  },
  submissions: {
    label: "Contact submissions",
    titleKey: "fullName",
    subtitleKey: "email",
    canCreate: false,
    fields: [
      { key: "status", label: "Status", type: "select", options: ["new", "contacted", "closed"] },
      { key: "fullName", label: "Full name", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "country", label: "Country", type: "text" },
      { key: "destination", label: "Destination", type: "text" },
      { key: "studyLevel", label: "Study level", type: "text" },
      { key: "studyField", label: "Study field", type: "text" },
      { key: "intake", label: "Intake", type: "text" },
      { key: "message", label: "Message", type: "textarea" },
    ],
  },
};

export const emptyItem = (name: CollectionName): Record<string, unknown> => {
  const base: Record<string, unknown> = { published: false };
  for (const f of collectionMeta[name].fields) {
    if (f.key in base) continue;
    base[f.key] = f.type === "list" || f.type === "multi" ? [] : f.type === "bool" ? false : f.type === "number" ? (f.key === "rating" ? 5 : 0) : f.type === "select" ? f.options[0] : "";
  }
  if (name === "reviews") Object.assign(base, { source: "admin", status: "approved" });
  return base;
};
