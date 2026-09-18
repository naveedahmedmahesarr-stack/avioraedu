/**
 * Public site configuration. Every value that would identify a real
 * business channel (phone, socials, domain) comes from environment variables.
 * Nothing is invented: unset values render a clear "configuration required" state.
 */
export const siteConfig = {
  name: "AVIORA EDU",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Premium guidance for studying in Germany and selected European destinations — from university selection and applications to visa guidance and arrival.",
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
  { label: "Destinations", href: "/destinations" },
  { label: "Universities", href: "/universities" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Dream Stories", href: "/dream-stories" },
  { label: "Insights", href: "/germany-insights" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
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
