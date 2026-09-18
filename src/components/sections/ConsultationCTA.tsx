import { ConsultationForm } from "./ConsultationForm";
import { Reveal } from "@/components/ui/Reveal";
import { formatWhatsapp, whatsappLink } from "@/lib/config";
import { getSettings } from "@/lib/content/store";
import { Icon } from "@/components/ui/Icon";

/** Contact channels from Admin → Business settings. Unset channels are omitted, never faked. */
export async function ContactChannels() {
  const settings = await getSettings();
  const wa = whatsappLink(settings.whatsappNumber, settings.whatsappMessage);
  const channels = [
    wa && { icon: "whatsapp" as const, label: "WhatsApp", value: formatWhatsapp(settings.whatsappNumber), href: wa, external: true },
    settings.businessEmail && { icon: "mail" as const, label: "Email", value: settings.businessEmail, href: `mailto:${settings.businessEmail}`, external: false },
    settings.phone && { icon: "send" as const, label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, "")}`, external: false },
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
            <span className="inline-flex size-11 items-center justify-center rounded-full border border-gold-300/30 text-gold-300">
              <Icon name={c.icon} className="size-5" />
            </span>
            <span>
              <span className="eyebrow block !text-[0.6rem] text-navy-300">{c.label}</span>
              <span className="mt-1 block font-medium text-ivory transition-colors group-hover:text-gold-300">{c.value}</span>
            </span>
            <Icon name="arrowUpRight" className="ml-auto size-4 text-gold-300/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ConsultationCTA({ defaultDestination }: { defaultDestination?: string }) {
  return (
    <section id="consultation" aria-labelledby="consultation-title" className="relative scroll-mt-20 overflow-hidden bg-navy-950 py-28 md:py-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_0%_100%,rgba(194,154,82,.18),transparent_70%)]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.3fr] lg:gap-20">
        <Reveal className="text-ivory">
          <p className="eyebrow flex items-center gap-3 text-gold-300">
            <span className="h-px w-8 bg-gold-300/60" aria-hidden /> Book a consultation
          </p>
          <h2 id="consultation-title" className="mt-5 text-[clamp(2.6rem,5.5vw,4.8rem)] leading-[1]">
            Let&apos;s plan your <span className="gold-text">European</span> journey.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-navy-300">
            Tell us a little about yourself. We&apos;ll review your profile and get back to you with honest, practical next steps.
          </p>
          <div className="mt-10">
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
