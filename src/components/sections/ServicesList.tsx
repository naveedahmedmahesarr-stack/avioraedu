import Link from "next/link";
import { getServices } from "@/lib/content/services.de";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { Icon } from "@/components/ui/Icon";

/**
 * Editorial service index: numbered rows that open in place (native <details>, keyboard and
 * screen-reader friendly, no JavaScript). `compact` shows titles and summaries only.
 */
export async function ServicesList({ compact = false, tone = "light" }: { compact?: boolean; tone?: "light" | "dark" }) {
  const { locale, t } = await getUi();
  const services = getServices(locale);
  const labels = t.servicesSection;
  const dark = tone === "dark";
  const rule = dark ? "border-ivory/12" : "border-navy-900/12";
  if (compact) {
    return (
      <ol className={`border-t ${rule}`}>
        {services.map((s, i) => (
          <li key={s.slug} className={`border-b ${rule}`}>
            <Link href={lp(locale, `/services#${s.slug}`)} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-6 md:grid-cols-[4rem_1.1fr_1.4fr_auto] md:gap-8 md:py-8">
              <span className={`col-start-1 row-start-1 font-display text-lg ${dark ? "text-gold-300/70" : "text-gold-600"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className={`col-start-2 row-start-1 font-display text-2xl leading-tight transition-colors md:text-3xl ${dark ? "text-ivory group-hover:text-gold-300" : "text-navy-900 group-hover:text-gold-600"}`}>{s.title}</span>
              <span className={`col-span-2 col-start-2 row-start-2 text-sm leading-relaxed md:col-span-1 md:col-start-3 md:row-start-1 md:text-base ${dark ? "text-navy-300" : "text-stone"}`}>{s.summary}</span>
              <Icon name="arrowRight" className={`col-start-3 row-start-1 size-4 self-center transition-transform duration-500 group-hover:translate-x-1 md:col-start-4 ${dark ? "text-gold-300" : "text-gold-600"}`} />
            </Link>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className={`border-t ${rule}`}>
      {services.map((s, i) => (
        <li key={s.slug} id={s.slug} className={`scroll-mt-28 border-b ${rule}`}>
          <details className="group" open={i === 0}>
            <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-7 md:grid-cols-[4rem_1.1fr_1.4fr_auto] md:gap-8 md:py-9 [&::-webkit-details-marker]:hidden">
              <span className="col-start-1 row-start-1 font-display text-lg text-gold-600">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="col-start-2 row-start-1 text-2xl leading-tight text-navy-900 [hyphens:auto] md:text-[2.1rem]">{s.title}</h2>
              <span className="col-span-2 col-start-2 row-start-2 text-sm leading-relaxed text-stone md:col-span-1 md:col-start-3 md:row-start-1 md:text-base">{s.summary}</span>
              <span aria-hidden className="col-start-3 row-start-1 inline-flex size-9 items-center justify-center self-center rounded-full border border-navy-900/15 text-navy-900 transition-transform duration-500 group-open:rotate-90 md:col-start-4">
                <Icon name="arrowRight" className="size-4" />
              </span>
            </summary>
            <div className="grid gap-8 pb-10 md:grid-cols-[4rem_1fr_1fr_1fr] md:gap-8">
              <span className="hidden md:block" />
              <div>
                <p className="eyebrow text-gold-600">{labels.whatItIs}</p>
                <p className="mt-3 leading-relaxed text-stone">{s.what}</p>
              </div>
              <div>
                <p className="eyebrow text-gold-600">{labels.whoFor}</p>
                <p className="mt-3 leading-relaxed text-stone">{s.who}</p>
              </div>
              <div>
                <p className="eyebrow text-gold-600">{labels.howWeHelp}</p>
                <ul className="mt-3 space-y-2.5">
                  {s.how.map((h) => (
                    <li key={h} className="flex gap-3 leading-relaxed text-stone">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-gold-500" /> {h}
                    </li>
                  ))}
                </ul>
                <Link href={lp(locale, s.next.href)} className="link-underline mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                  {s.next.label} <Icon name="arrowRight" className="size-4" />
                </Link>
              </div>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
