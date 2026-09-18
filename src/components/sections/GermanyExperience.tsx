import { BerlinLandmarks } from "./BerlinLandmarks";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";

const moments: { icon: IconName; title: string; body: string }[] = [
  { icon: "home", title: "City life", body: "Berlin, Munich, Hamburg, Frankfurt — each with its own character, neighbourhoods and student scene." },
  { icon: "book", title: "Lecture halls & libraries", body: "Seminar-style teaching, independent study and well-equipped university libraries." },
  { icon: "flask", title: "Laboratories", body: "Hands-on research culture, especially in engineering and the natural sciences." },
  { icon: "train", title: "Getting around", body: "Regional trains, U-Bahn and S-Bahn — many universities include a public transport ticket." },
];

/** Editorial Germany storytelling: large composition, not a card grid. */
export function GermanyExperience() {
  return (
    <section aria-labelledby="germany-experience" className="relative overflow-hidden bg-navy-950 py-28 text-ivory md:py-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_20%,rgba(194,154,82,.16),transparent_70%)]" />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-gold-300">
            <span className="h-px w-10 bg-gold-300/60" aria-hidden /> The Germany experience
          </p>
          <h2 id="germany-experience" className="mt-6 max-w-5xl text-[clamp(2.3rem,7vw,6.2rem)] leading-[0.95]">
            Arrive in Berlin. <span className="text-ivory/40">Study anywhere in</span> <span className="gold-text">Germany</span>.
          </h2>
        </Reveal>

        <Reveal delay={120} className="relative mt-12 md:mt-16">
          <BerlinLandmarks />
          <p className="mt-4 text-xs text-navy-300 lg:mt-5">Tap a landmark to explore it.</p>
        </Reveal>

        <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {moments.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 80} className="border-t border-gold-300/20 pt-6">
              <Icon name={m.icon} className="size-6 text-gold-400" />
              <h3 className="mt-5 text-2xl">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-300">{m.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
