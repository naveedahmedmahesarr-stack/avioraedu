import type { Homepage } from "@/lib/content/schemas";
import { Monogram } from "@/components/brand/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { getUi } from "@/i18n/server";

/** "Who we are / what we do / why students choose us". Founder details live on /founder (FounderTeaser). */
export async function AboutSection({ home }: { home: Homepage }) {
  const { t } = await getUi();
  const a = t.about;
  const blocks = [
    { title: a.who, body: home.aboutWho },
    { title: a.what, body: home.aboutWhat },
    { title: a.why, body: home.aboutWhy },
  ].filter((b) => b.body);

  return (
    <section aria-labelledby="about" className="relative overflow-hidden bg-ivory py-28 md:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-gold-600">
            <span className="h-px w-8 bg-gold-600/60" aria-hidden /> {a.eyebrow}
          </p>
          <h2 id="about" className="mt-5 text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-navy-900">
            {a.title} <em className="text-gold-600">{a.titleEm}</em>.
          </h2>
          <div className="relative mt-12 hidden aspect-[5/4] items-center justify-center overflow-hidden rounded-[2rem] bg-navy-950 lg:flex">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(194,154,82,.28),transparent_70%)]" />
            <Monogram className="relative size-40" />
          </div>
        </Reveal>
        <div className="space-y-12 lg:pt-24">
          {blocks.map((b, i) => (
            <Reveal key={b.title} delay={i * 100} className="border-t border-navy-900/15 pt-8">
              <h3 className="text-3xl text-navy-900">{b.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-stone">{b.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
