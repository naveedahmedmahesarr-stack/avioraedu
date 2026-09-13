import { Reveal } from "@/components/ui/Reveal";
import { getUi } from "@/i18n/server";

/**
 * Where AVIORA EDU is based. Berlin is the working base (home-based — no street address shown);
 * Karachi is announced as opening soon, with no address, date or staff until they exist.
 */
export async function Locations({ location = "Berlin, Germany", tone = "ivory" }: { location?: string; tone?: "ivory" | "sand" }) {
  const { locale, t } = await getUi();
  const l = t.locations;
  const [city, countryEn] = location.split(",").map((s) => s.trim());
  const country = locale === "de" && countryEn === "Germany" ? "Deutschland" : (countryEn ?? "");
  return (
    <section aria-labelledby="locations" className={`${tone === "sand" ? "bg-sand/50" : "bg-ivory"} py-20 md:py-28`}>
      <div className="container-x">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-gold-600">
            <span className="h-px w-8 bg-gold-600/60" aria-hidden /> {l.eyebrow}
          </p>
          <h2 id="locations" className="mt-5 max-w-2xl text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.03] text-navy-900">
            {l.title}
          </h2>
        </Reveal>
        <div className="mt-14 grid border-t border-navy-900/15 md:grid-cols-2">
          <Reveal className="border-b border-navy-900/15 py-10 md:border-b-0 md:border-r md:pr-12">
            <p className="eyebrow text-stone">{country}</p>
            <p className="mt-4 font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-none text-navy-900">{city}</p>
            <p className="mt-6 max-w-md leading-relaxed text-stone">{l.berlinBody}</p>
          </Reveal>
          <Reveal delay={120} className="relative py-10 md:pl-12">
            <div className="flex flex-wrap items-center gap-4">
              <p className="eyebrow text-stone">{l.pakistan}</p>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-600">
                <span aria-hidden className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-500/60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-gold-500" />
                </span>
                {t.common.openingSoon}
              </span>
            </div>
            <p className="mt-4 font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-none text-navy-900">{l.karachiCity}</p>
            <p className="mt-6 max-w-md leading-relaxed text-stone">{l.karachiBody}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
