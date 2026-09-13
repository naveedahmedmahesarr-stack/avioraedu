import Link from "next/link";
import { formatWhatsapp, whatsappLink } from "@/lib/config";
import { markets } from "@/lib/content/markets";
import { marketName } from "@/lib/content/markets.de";
import { getSite } from "@/lib/site";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { Logo } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/ui/Icon";

export async function Footer() {
  const [site, { locale, t }] = await Promise.all([getSite(), getUi()]);
  const f = t.footer;
  const { settings } = site;
  const waMessage = locale === "de" && settings.whatsappMessageDe ? settings.whatsappMessageDe : settings.whatsappMessage;
  const wa = whatsappLink(settings.whatsappNumber, waMessage);
  const socials = Object.entries(site.social).filter(([, url]) => url) as [IconName, string][];
  const L = (p: string) => lp(locale, p);

  const columns = [
    {
      title: f.company,
      links: [
        { label: t.nav.services, href: "/services" },
        { label: t.nav.studentSupport, href: "/student-support" },
        { label: t.nav.founder, href: "/founder" },
        { label: t.nav.about, href: "/about" },
        { label: t.nav.howItWorks, href: "/how-it-works" },
        { label: t.nav.reviews, href: "/reviews" },
        { label: t.nav.dreamStories, href: "/dream-stories" },
        { label: t.nav.contact, href: "/contact" },
      ],
    },
    {
      title: f.germany,
      links: [
        { label: t.nav.studyInGermany, href: "/study-in-germany" },
        { label: t.nav.universities, href: "/universities" },
        { label: f.allGuides, href: "/guides" },
        { label: f.studentVisa, href: "/guides/germany-student-visa" },
        { label: f.opportunityCard, href: "/guides/germany-opportunity-card" },
        { label: f.ausbildung, href: "/guides/ausbildung-germany" },
      ],
    },
    {
      title: f.studyFrom,
      links: markets.map((m) => ({ label: marketName(m.slug, locale, "short"), href: `/study-in-germany/from/${m.slug}` })),
    },
    {
      title: f.legal,
      links: [
        { label: f.legalCenter, href: "/legal" },
        { label: f.impressum, href: "/legal/imprint" },
        { label: f.privacy, href: "/legal/privacy-policy" },
        { label: f.terms, href: "/legal/terms" },
        { label: f.disclaimer, href: "/legal/disclaimer" },
        { label: f.cookies, href: "/legal/cookie-policy" },
        { label: f.pakistan, href: "/legal/pakistan" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-ivory print:hidden">
      <div className="hairline" />
      <div className="container-x flex flex-col justify-between gap-8 border-b border-ivory/10 py-16 md:flex-row md:items-end md:py-20">
        <p className="max-w-3xl font-display text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[1.02]">
          {f.statement} <em className="gold-text">{f.statementEm}</em> {f.statementEnd}
        </p>
        <Link href={L("/contact#consultation")} className="btn btn-gold shrink-0">
          {t.nav.bookFree} <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
      <div className="container-x grid gap-14 py-16 md:py-20 lg:grid-cols-[1.1fr_2.6fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm leading-relaxed text-navy-300">{f.blurb}</p>
          <ul className="mt-8 space-y-2.5 text-sm" aria-label={f.contact}>
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-ivory/80 transition-colors hover:text-gold-300">
                  <Icon name="whatsapp" className="size-4 text-gold-400" /> WhatsApp {formatWhatsapp(settings.whatsappNumber)}
                </a>
              </li>
            )}
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2.5 break-all text-ivory/80 transition-colors hover:text-gold-300">
                  <Icon name="mail" className="size-4 shrink-0 text-gold-400" /> {site.email}
                </a>
              </li>
            )}
            {site.phone && (
              <li>
                <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2.5 text-ivory/80 transition-colors hover:text-gold-300">
                  <Icon name="send" className="size-4 text-gold-400" /> {site.phone}
                </a>
              </li>
            )}
            {site.address && (
              <li className="flex items-start gap-2.5 text-ivory/80">
                <Icon name="map" className="mt-0.5 size-4 shrink-0 text-gold-400" />
                <address className="not-italic">
                  {[site.address.street, [site.address.postalCode, site.address.city].filter(Boolean).join(" "), locale === "de" && site.address.country === "Germany" ? "Deutschland" : site.address.country]
                    .filter(Boolean)
                    .join(", ")}
                  <span className="mt-1 block text-ivory/55">{f.karachi}</span>
                </address>
              </li>
            )}
          </ul>
          {socials.length > 0 ? (
            <ul className="mt-8 flex gap-3" aria-label={f.social}>
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 transition hover:border-gold-400 hover:text-gold-300"
                    aria-label={f.onSocial(site.name, name)}
                  >
                    <Icon name={name} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="eyebrow text-gold-300">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={L(l.href)} className="text-sm text-ivory/75 transition-colors hover:text-gold-300">
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
          <p>
            © {new Date().getFullYear()} {site.name}
            {site.location ? ` · ${locale === "de" ? site.location.replace("Germany", "Deutschland") : site.location}` : ""}
          </p>
          <p className="flex gap-4">
            <Link href={L("/legal/imprint")} className="transition-colors hover:text-gold-300">
              {f.impressum}
            </Link>
            <Link href={L("/legal/privacy-policy")} className="transition-colors hover:text-gold-300">
              {f.privacy}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
