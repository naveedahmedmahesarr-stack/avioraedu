import Link from "next/link";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

const icons: IconName[] = ["globe", "luggage", "plane", "home", "file", "send", "compass"];

/** Homepage preview of the Student Support page: the move to Germany as a seven-step journey. */
export async function StudentSupportTeaser() {
  const { locale, t } = await getUi();
  const s = t.supportTeaser;
  return (
    <section aria-labelledby="support-teaser" className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-gold-600">
              <span className="h-px w-8 bg-gold-600/60" aria-hidden /> {s.eyebrow}
            </p>
            <h2 id="support-teaser" className="mt-5 text-[clamp(2.5rem,5.4vw,4.6rem)] leading-[1] text-navy-900">
              {s.title}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg leading-relaxed text-stone">{s.body}</p>
            <Link href={lp(locale, "/student-support")} className="btn btn-navy mt-7">
              {s.cta} <Icon name="arrowRight" className="size-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={150} className="relative mt-16">
          <ol className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-0">
            <span aria-hidden className="absolute left-0 right-0 top-[2.1rem] hidden h-px bg-gradient-to-r from-gold-500/10 via-gold-500/60 to-gold-500/10 lg:block" />
            {s.steps.map((step, i) => (
              <li key={step} className="group relative flex items-center gap-4 rounded-2xl border border-navy-900/10 bg-white/70 p-4 lg:flex-col lg:border-0 lg:bg-transparent lg:p-0 lg:text-center">
                <span className="relative z-10 inline-flex size-[4.2rem] shrink-0 items-center justify-center rounded-full border border-gold-500/35 bg-ivory text-gold-600 shadow-[0_14px_30px_-18px_rgba(5,13,28,.45)] transition-transform duration-500 group-hover:-translate-y-1 [transform:translateZ(0)]">
                  <span aria-hidden className="absolute inset-1 rounded-full border border-navy-900/5 bg-gradient-to-b from-white to-sand/60" />
                  <Icon name={icons[i] ?? "check"} className="relative size-5" />
                </span>
                <span>
                  <span className="block font-sans text-[0.62rem] font-semibold tracking-[0.22em] text-stone lg:mt-4">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block font-display text-xl leading-tight text-navy-900">{step}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
