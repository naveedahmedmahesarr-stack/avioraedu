import Image from "next/image";
import Link from "next/link";
import type { DreamStory } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function DreamStoryCard({ s, featured = false }: { s: DreamStory; featured?: boolean }) {
  return (
    <article className={`group relative overflow-hidden rounded-[2rem] bg-navy-900 text-ivory ${featured ? "md:col-span-2 md:row-span-2" : ""}`}>
      <div className={`relative ${featured ? "aspect-[4/5] md:aspect-auto md:h-full md:min-h-[560px]" : "aspect-[4/5]"}`}>
        {s.video ? (
          <video src={s.video} poster={s.photo || undefined} controls preload="none" playsInline className="absolute inset-0 h-full w-full object-cover">
            <track kind="captions" />
          </video>
        ) : s.photo ? (
          <Image src={s.photo} alt={`${s.studentName}, studying in ${s.destination}`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_0%,rgba(194,154,82,.3),transparent_70%)]" />
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 md:p-8">
          <p className="eyebrow text-gold-300">
            {s.sourceCountry} → {s.destination}
            {s.intake && ` · ${s.intake}`}
          </p>
          <h3 className="mt-3 text-3xl">{s.studentName}</h3>
          {(s.program || s.university) && <p className="mt-1 text-sm text-ivory/75">{[s.program, s.university].filter(Boolean).join(" · ")}</p>}
          <p className={`mt-4 text-sm leading-relaxed text-ivory/85 ${featured ? "line-clamp-5" : "line-clamp-3"}`}>{s.story}</p>
          {s.verified && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300">
              <Icon name="shield" className="size-4" /> Verified by AVIORA EDU
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function DreamStories({ stories, showLink = true }: { stories: DreamStory[]; showLink?: boolean }) {
  if (stories.length === 0) {
    return (
      <Reveal className="relative overflow-hidden rounded-[2rem] border border-dashed border-gold-500/40 bg-white/60 p-10 text-center md:p-16">
        <Icon name="star" className="mx-auto size-8 text-gold-500" />
        <h3 className="mx-auto mt-6 max-w-2xl text-3xl text-navy-900 md:text-4xl">Real student journeys will be published here.</h3>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone">
          We only share stories, photos and videos from real students who have given their consent. No stock photos, no invented testimonials.
        </p>
        <Link href="/contact#consultation" className="btn btn-navy mt-8">
          Start your own story
        </Link>
      </Reveal>
    );
  }
  const [first, ...rest] = stories;
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        <DreamStoryCard s={first} featured />
        {rest.slice(0, 4).map((s) => (
          <DreamStoryCard key={s.id} s={s} />
        ))}
      </div>
      {showLink && stories.length > 5 && (
        <Link href="/dream-stories" className="btn btn-outline mt-10">
          View all Dream Stories <Icon name="arrowRight" className="size-4" />
        </Link>
      )}
    </div>
  );
}
