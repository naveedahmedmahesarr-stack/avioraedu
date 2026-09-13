import Image from "next/image";
import Link from "next/link";
import type { DreamStory } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { getUi } from "@/i18n/server";
import { lp, type Locale } from "@/i18n/locales";
import { term } from "@/i18n/content";
import { ui } from "@/i18n/ui";

export function DreamStoryCard({ s, featured = false, locale }: { s: DreamStory; featured?: boolean; locale: Locale }) {
  const t = ui[locale].stories;
  const dest = term(s.destination, locale);
  return (
    <article className={`group relative overflow-hidden rounded-[2rem] bg-navy-900 text-ivory ${featured ? "md:col-span-2 md:row-span-2" : ""}`}>
      <div className={`relative ${featured ? "aspect-[4/5] md:aspect-auto md:h-full md:min-h-[560px]" : "aspect-[4/5]"}`}>
        {s.video ? (
          <video src={s.video} poster={s.photo || undefined} controls preload="none" playsInline className="absolute inset-0 h-full w-full object-cover">
            <track kind="captions" />
          </video>
        ) : s.photo ? (
          <Image src={s.photo} alt={t.photoAlt(s.studentName, dest)} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_0%,rgba(194,154,82,.3),transparent_70%)]" />
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 md:p-8">
          <p className="eyebrow text-gold-300">
            {term(s.sourceCountry, locale)} → {dest}
            {s.intake && ` · ${s.intake}`}
          </p>
          <h3 className="mt-3 text-3xl">{s.studentName}</h3>
          {(s.program || s.university) && <p className="mt-1 text-sm text-ivory/75">{[s.program, s.university].filter(Boolean).join(" · ")}</p>}
          <p className={`mt-4 text-sm leading-relaxed text-ivory/85 ${featured ? "line-clamp-5" : "line-clamp-3"}`}>{s.story}</p>
          {s.verified && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300">
              <Icon name="shield" className="size-4" /> {t.verifiedBy}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export async function DreamStories({ stories, showLink = true }: { stories: DreamStory[]; showLink?: boolean }) {
  const { locale, t } = await getUi();
  if (stories.length === 0) {
    return (
      <Reveal className="relative overflow-hidden rounded-[2rem] border border-dashed border-gold-500/40 bg-white/60 p-10 text-center md:p-16">
        <Icon name="star" className="mx-auto size-8 text-gold-500" />
        <h3 className="mx-auto mt-6 max-w-2xl text-3xl text-navy-900 md:text-4xl">{t.stories.emptyTitle}</h3>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone">{t.stories.emptyBody}</p>
        <Link href={lp(locale, "/contact#consultation")} className="btn btn-navy mt-8">
          {t.stories.start}
        </Link>
      </Reveal>
    );
  }
  const [first, ...rest] = stories;
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        <DreamStoryCard s={first} featured locale={locale} />
        {rest.slice(0, 4).map((s) => (
          <DreamStoryCard key={s.id} s={s} locale={locale} />
        ))}
      </div>
      {showLink && stories.length > 5 && (
        <Link href={lp(locale, "/dream-stories")} className="btn btn-outline mt-10">
          {t.stories.viewAll} <Icon name="arrowRight" className="size-4" />
        </Link>
      )}
    </div>
  );
}
