import Image from "next/image";
import type { Homepage, TeamMember } from "@/lib/content/schemas";
import { Monogram } from "@/components/brand/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { AboutEmblem } from "./AboutEmblem";

export function AboutSection({ home, team }: { home: Homepage; team: TeamMember[] }) {
  const blocks = [
    { title: "Who we are", body: home.aboutWho },
    { title: "What we do", body: home.aboutWhat },
    { title: "Why students choose us", body: home.aboutWhy },
  ].filter((b) => b.body);

  return (
    <section aria-labelledby="about" className="relative overflow-hidden bg-ivory py-28 md:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-gold-600">
            <span className="h-px w-8 bg-gold-600/60" aria-hidden /> About AVIORA EDU
          </p>
          <h2 id="about" className="mt-5 text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-navy-900">
            A focused consultancy for students who want to study in Europe <em className="text-gold-600">properly</em>.
          </h2>
          <AboutEmblem />
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

      <div className="container-x mt-24">
        <Reveal>
          <h3 className="eyebrow text-gold-600">Founder & team</h3>
        </Reveal>
        {team.length === 0 ? (
          <Reveal className="mt-6 rounded-3xl border border-dashed border-navy-900/20 p-8 text-stone">
            Team profiles will be introduced here soon.
          </Reveal>
        ) : (
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[...team].sort((a, b) => a.order - b.order).map((m, i) => (
              <Reveal as="li" key={m.id} delay={i * 80}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-navy-900">
                  {m.photo ? <Image src={m.photo} alt={m.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" /> : <Monogram className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2" />}
                </div>
                <p className="mt-4 font-display text-2xl text-navy-900">{m.name}</p>
                <p className="text-sm text-gold-600">{m.role}</p>
                {m.bio && <p className="mt-2 text-sm leading-relaxed text-stone">{m.bio}</p>}
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
