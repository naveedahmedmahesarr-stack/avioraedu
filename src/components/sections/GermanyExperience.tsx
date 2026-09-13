import { CitySkyline } from "@/components/brand/CitySkyline";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { getUi } from "@/i18n/server";

const icons: IconName[] = ["home", "book", "flask", "train"];

/** Editorial Germany storytelling: large composition, not a card grid. */
export async function GermanyExperience() {
  const { t } = await getUi();
  const g = t.germanyExp;
  return (
    <section aria-labelledby="germany-experience" className="relative overflow-hidden bg-navy-950 py-28 text-ivory md:py-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_20%,rgba(194,154,82,.16),transparent_70%)]" />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-gold-300">
            <span className="h-px w-10 bg-gold-300/60" aria-hidden /> {g.eyebrow}
          </p>
          <h2 id="germany-experience" className="mt-6 max-w-5xl text-[clamp(2.6rem,7vw,6.2rem)] leading-[0.95]">
            {g.title1} <span className="text-ivory/40">{g.title2}</span> <span className="gold-text">{g.title3}</span>.
          </h2>
        </Reveal>

        <Reveal delay={120} className="relative mt-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-gold-300/10 bg-gradient-to-b from-navy-800 to-navy-950 px-6 pt-20 md:px-16">
            <div aria-hidden className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(231,207,155,.08),transparent_60%)]" />
            <div className="absolute left-6 top-6 flex flex-wrap gap-2 md:left-10 md:top-10">
              {g.chips.map((c) => (
                <span key={c} className="rounded-full border border-gold-300/25 px-3 py-1 text-xs text-gold-300">
                  {c}
                </span>
              ))}
            </div>
            <CitySkyline code="DE" className="relative mx-auto w-full max-w-5xl text-gold-300/80" />
          </div>
        </Reveal>

        <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {g.moments.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 80} className="border-t border-gold-300/20 pt-6">
              <Icon name={icons[i]} className="size-6 text-gold-400" />
              <h3 className="mt-5 text-2xl">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-300">{m.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
