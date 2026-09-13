import Link from "next/link";
import type { TeamMember } from "@/lib/content/schemas";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { FounderVisual } from "@/components/brand/FounderVisual";

/** Compact founder introduction for the homepage and About page, linking to /founder. */
export async function FounderTeaser({ founder, location }: { founder?: TeamMember; location?: string }) {
  if (!founder) return null;
  const { locale, t } = await getUi();
  const facts = [founder.location || location, founder.nationality, founder.experience].filter(Boolean) as string[];
  return (
    <section aria-labelledby="founder-teaser" className="relative overflow-hidden bg-sand/50 py-24 md:py-32">
      <div className="container-x grid items-center gap-12 md:grid-cols-[19rem_1fr] md:gap-20">
        <Reveal className="mx-auto w-full max-w-[19rem]">
          <FounderVisual founder={founder} locale={locale} size="md" />
        </Reveal>
        <Reveal delay={100}>
          <p className="eyebrow flex items-center gap-3 text-gold-600">
            <span className="h-px w-8 bg-gold-600/60" aria-hidden /> {t.founderTeaser.eyebrow}
          </p>
          <h2 id="founder-teaser" className="mt-5 text-[clamp(2.4rem,4.8vw,4rem)] leading-none text-navy-900">
            {founder.name}
          </h2>
          <p className="eyebrow mt-4 text-gold-600">{founder.role}</p>
          {facts.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {facts.map((f) => (
                <li key={f} className="rounded-full border border-navy-900/15 bg-white/60 px-4 py-1.5 text-sm text-navy-900">
                  {f}
                </li>
              ))}
            </ul>
          )}
          {founder.bio && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone">{founder.bio}</p>}
          <Link href={lp(locale, "/founder")} className="link-underline mt-7 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
            {t.founderTeaser.cta} <Icon name="arrowRight" className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
