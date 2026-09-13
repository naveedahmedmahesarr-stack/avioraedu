import Link from "next/link";
import { formatWhatsapp, siteConfig, whatsappLink } from "@/lib/config";
import { getSettings } from "@/lib/content/store";
import { Logo } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/ui/Icon";

const columns = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Dream Stories", href: "/dream-stories" },
      { label: "Reviews", href: "/reviews" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Destinations",
    links: [
      { label: "Study in Germany", href: "/study-in-germany" },
      { label: "Italy", href: "/destinations/italy" },
      { label: "Poland", href: "/destinations/poland" },
      { label: "Portugal", href: "/destinations/portugal" },
      { label: "Austria", href: "/destinations/austria" },
      { label: "Universities", href: "/universities" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Imprint", href: "/legal/imprint" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Cookie Policy", href: "/legal/cookie-policy" },
    ],
  },
];

export async function Footer() {
  const settings = await getSettings();
  const wa = whatsappLink(settings.whatsappNumber, settings.whatsappMessage);
  const socials = Object.entries(siteConfig.social).filter(([, url]) => url) as [IconName, string][];
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-ivory">
      <div className="hairline" />
      <div className="container-x grid gap-14 py-20 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm leading-relaxed text-navy-300">
            Guidance for studying in Germany, Italy, Poland, Portugal and Austria — from first consultation to arrival.
          </p>
          {(wa || settings.businessEmail || settings.phone) && (
            <ul className="mt-8 space-y-2.5 text-sm" aria-label="Contact">
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-ivory/80 transition-colors hover:text-gold-300">
                    <Icon name="whatsapp" className="size-4 text-gold-400" /> WhatsApp {formatWhatsapp(settings.whatsappNumber)}
                  </a>
                </li>
              )}
              {settings.businessEmail && (
                <li>
                  <a href={`mailto:${settings.businessEmail}`} className="inline-flex items-center gap-2.5 text-ivory/80 transition-colors hover:text-gold-300">
                    <Icon name="mail" className="size-4 text-gold-400" /> {settings.businessEmail}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2.5 text-ivory/80 transition-colors hover:text-gold-300">
                    <Icon name="send" className="size-4 text-gold-400" /> {settings.phone}
                  </a>
                </li>
              )}
            </ul>
          )}
          {socials.length > 0 ? (
            <ul className="mt-8 flex gap-3" aria-label="Social media">
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 transition hover:border-gold-400 hover:text-gold-300"
                    aria-label={`AVIORA EDU on ${name}`}
                  >
                    <Icon name={name} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="eyebrow text-gold-300">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ivory/75 transition-colors hover:text-gold-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AVIORA EDU. All rights reserved.</p>
          <p>AVIORA EDU is an independent consultancy and is not affiliated with any university unless explicitly stated.</p>
        </div>
      </div>
    </footer>
  );
}
