import Image from "next/image";
import Link from "next/link";
import type { DreamStory } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { VisaViewer } from "@/components/sections/VisaViewer";
import { getUi } from "@/i18n/server";
import { lp, type Locale } from "@/i18n/locales";
import { term } from "@/i18n/content";
import { ui } from "@/i18n/ui";

/** A case is public only when it is published AND written consent is recorded. */
export const publicStories = (stories: DreamStory[]) => stories.filter((s) => s.published && s.consentConfirmed);

export function DreamStoryCard({ s, locale }: { s: DreamStory; locale: Locale }) {
  const t = ui[locale].stories;
  const dest = term(s.destination, locale);
  const name = s.displayName || s.studentName;
  const facts = (
    [
      [t.destination, dest],
      [t.visa, s.visaType],
      [t.university, s.university],
      [t.program, s.program],
      [t.intake, s.intake],
      [t.year, s.successYear],
    ] as const
  ).filter(([, v]) => v);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-navy-900/10 bg-white shadow-[0_40px_80px_-60px_rgba(5,13,28,.45)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_50px_90px_-50px_rgba(5,13,28,.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {s.visaDocument ? (
        <div className="relative bg-[radial-gradient(90%_80%_at_50%_0%,#1a3357_0%,#050d1c_100%)] p-4 sm:p-5">
          <VisaViewer
            src={s.visaDocument}
            alt={t.documentAlt(name, dest)}
            labels={{ open: t.viewDocument, dialog: t.dialogLabel(name), zoomIn: t.zoomIn, zoomOut: t.zoomOut, reset: t.resetZoom, close: t.close, note: t.redactedNote }}
          />
        </div>
      ) : s.video ? (
        <video src={s.video} poster={s.photo || undefined} controls preload="none" playsInline className="aspect-[4/3] w-full bg-navy-950 object-cover">
          <track kind="captions" />
        </video>
      ) : s.photo ? (
        <div className="relative aspect-[4/3]">
          <Image src={s.photo} alt={t.photoAlt(name, dest)} fill sizes="(min-width:1024px) 30vw, (min-width:768px) 45vw, 100vw" className="object-cover" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow text-gold-600">{t.eyebrow}</p>
          {s.verified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gold-300">
              <Icon name="shield" className="size-3.5" /> {t.verifiedBadge}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-3xl text-navy-900">{name}</h3>
        <p className="mt-1 text-sm text-stone">
          {term(s.sourceCountry, locale)} → {dest}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
          <Icon name="check" className="size-4 text-gold-600" /> {t.outcomeValue(dest)}
        </p>
        {facts.length > 0 && (
          <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-navy-900/10 pt-5 text-sm sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-stone">{k}</dt>
                <dd className="mt-0.5 break-words font-medium text-navy-900">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="mt-5 leading-relaxed text-stone">{s.story}</p>
        {s.testimonial && (
          <figure className="mt-6 rounded-2xl bg-sand/60 p-5">
            <blockquote className="font-display text-xl leading-snug text-navy-900">“{s.testimonial}”</blockquote>
            <figcaption className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">{t.inTheirWords(name)}</figcaption>
          </figure>
        )}
      </div>
    </article>
  );
}

export async function DreamStories({ stories, showLink = true }: { stories: DreamStory[]; showLink?: boolean }) {
  const { locale, t } = await getUi();
  const visible = publicStories(stories);
  if (visible.length === 0) {
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
  const shown = showLink ? visible.slice(0, 3) : visible;
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((s, i) => (
          <Reveal key={s.id} delay={i * 80} className="h-full">
            <DreamStoryCard s={s} locale={locale} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href={lp(locale, "/contact#consultation")} className="btn btn-navy">
          {t.stories.startApplication} <Icon name="arrowRight" className="size-4" />
        </Link>
        {showLink && visible.length > 3 && (
          <Link href={lp(locale, "/dream-stories")} className="btn btn-outline">
            {t.stories.viewAll} <Icon name="arrowRight" className="size-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
