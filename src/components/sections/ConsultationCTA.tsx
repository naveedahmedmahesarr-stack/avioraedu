import { ConsultationForm } from "./ConsultationForm";
import { Reveal } from "@/components/ui/Reveal";
import { formatWhatsapp, whatsappLink } from "@/lib/config";
import { getSettings } from "@/lib/content/store";
import { Icon } from "@/components/ui/Icon";
import { getUi } from "@/i18n/server";

/** Contact channels from Admin → Settings. Unset channels are omitted, never faked. */
export async function ContactChannels() {
  const [settings, { locale, t }] = await Promise.all([getSettings(), getUi()]);
  const message = locale === "de" && settings.whatsappMessageDe ? settings.whatsappMessageDe : settings.whatsappMessage;
  const wa = whatsappLink(settings.whatsappNumber, message);
  const channels = [
    wa && { icon: "whatsapp" as const, label: t.cta.whatsapp, value: formatWhatsapp(settings.whatsappNumber), href: wa, external: true },
    settings.businessEmail && { icon: "mail" as const, label: t.cta.email, value: settings.businessEmail, href: `mailto:${settings.businessEmail}`, external: false },
    settings.phone && { icon: "send" as const, label: t.cta.phone, value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, "")}`, external: false },
  ].filter(Boolean) as { icon: "whatsapp" | "mail" | "send"; label: string; value: string; href: string; external: boolean }[];

  if (channels.length === 0) return null;
  return (
    <ul className="space-y-3">
      {channels.map((c) => (
        <li key={c.label}>
          <a
            href={c.href}
            {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex items-center gap-4 rounded-2xl border border-gold-300/15 bg-navy-900/40 p-5 transition-colors duration-300 hover:border-gold-300/40"
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-gold-300/30 text-gold-300">
              <Icon name={c.icon} className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="eyebrow block !text-[0.6rem] text-navy-300">{c.label}</span>
              <span className="mt-1 block break-all font-medium text-ivory transition-colors group-hover:text-gold-300">{c.value}</span>
            </span>
            <Icon name="arrowUpRight" className="ml-auto size-4 shrink-0 text-gold-300/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export async function ConsultationCTA({ defaultDestination }: { defaultDestination?: string }) {
  const { t } = await getUi();
  const c = t.cta;
  return (
    <section id="consultation" aria-labelledby="consultation-title" className="relative scroll-mt-20 overflow-hidden bg-navy-950 py-28 md:py-40 print:hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_0%_100%,rgba(194,154,82,.18),transparent_70%)]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.3fr] lg:gap-20">
        <Reveal className="text-ivory">
          <p className="eyebrow flex items-center gap-3 text-gold-300">
            <span className="h-px w-8 bg-gold-300/60" aria-hidden /> {c.eyebrow}
          </p>
          <h2 id="consultation-title" className="mt-5 text-[clamp(2.6rem,5.5vw,4.8rem)] leading-[1]">
            {c.title} <span className="gold-text">{c.titleEm}</span>.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-navy-300">{c.body}</p>
          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-300">
            <span>{c.berlin}</span>
            <span aria-hidden className="h-3 w-px bg-ivory/20" />
            <span>
              {c.karachi} <span className="text-gold-300">{c.soon}</span>
            </span>
          </p>
          <div className="mt-8">
            <ContactChannels />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ConsultationForm defaultDestination={defaultDestination} />
        </Reveal>
      </div>
    </section>
  );
}
