import Link from "next/link";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";

const icons: IconName[] = ["graduation", "flask", "briefcase", "globe", "book", "shield"];

/** `eager`: show the heading immediately (for pages where this section sits directly below the page header). */
export async function WhyGermany({ eager = false }: { eager?: boolean } = {}) {
  const { locale, t } = await getUi();
  const w = t.why;
  return (
    <section aria-labelledby="why-germany" className="relative overflow-hidden bg-ivory py-28 md:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.35fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eager={eager}
            eyebrow={w.eyebrow}
            title={
              <span id="why-germany">
                {w.title} <em className="text-gold-600">{w.titleEm}</em>.
              </span>
            }
            intro={w.intro}
          />
          <Reveal delay={150}>
            <Link href={lp(locale, "/study-in-germany")} className="btn btn-navy mt-10">
              {w.cta} <Icon name="arrowRight" className="size-4" />
            </Link>
          </Reveal>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-3xl bg-navy-900/10 sm:grid-cols-2">
          {w.reasons.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 70} className="group bg-ivory p-8 transition-colors duration-500 hover:bg-white md:p-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex size-12 items-center justify-center rounded-full border border-gold-500/40 text-gold-600 transition-colors group-hover:bg-navy-900 group-hover:text-gold-300">
                  <Icon name={icons[i]} />
                </span>
                <span className="font-display text-2xl text-navy-900/25">0{i + 1}</span>
              </div>
              <h3 className="mt-8 text-3xl text-navy-900 [hyphens:auto]">{r.title}</h3>
              <p className="mt-3 leading-relaxed text-stone">{r.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
