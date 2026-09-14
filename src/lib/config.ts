/**
 * Public site configuration. Every value that would identify a real
 * business channel (phone, socials, domain) comes from environment variables.
 * Nothing is invented: unset values render a clear "configuration required" state.
 */
/**
 * Always returns a valid absolute origin, because `new URL()` (metadataBase, sitemap) throws on
 * anything else. Accepts values entered without a protocol ("www.avioraedu.com"), ignores empty or
 * malformed values, and falls back to Vercel's production domain, then localhost.
 */
export function resolveSiteUrl(...candidates: (string | undefined)[]) {
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      if (url.hostname.includes(".") || url.hostname === "localhost") return url.origin;
    } catch {
      // Malformed value: try the next candidate.
    }
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "AVIORA EDU",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL),
  description:
    "Education consultancy for studying in Germany and Europe. Honest help with university admission, student visas and arrival for students from South Asia and the Gulf.",
  social: {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "",
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "",
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? "",
    tiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK ?? "",
  },
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Study in Germany", href: "/study-in-germany" },
  { label: "Services", href: "/services" },
  { label: "Destinations", href: "/destinations" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * https://wa.me/<digits>?text=… — digits only (international format, no +, spaces or brackets).
 * The number and message come from Admin → Business settings. Null when not configured.
 */
export function whatsappLink(number: string | undefined, message?: string) {
  const digits = (number ?? "").replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  return message ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : `https://wa.me/${digits}`;
}

/** Human-readable international number for display, e.g. +49 15217595531. */
export function formatWhatsapp(number: string) {
  const d = number.replace(/[^\d]/g, "");
  return d.startsWith("49") ? `+49 ${d.slice(2, 5)} ${d.slice(5)}` : `+${d}`;
}
