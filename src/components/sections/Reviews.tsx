import Image from "next/image";
import Link from "next/link";
import type { Review } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { getUi } from "@/i18n/server";
import { dateLocale, lp, type Locale } from "@/i18n/locales";
import { term } from "@/i18n/content";
import { ui } from "@/i18n/ui";

export function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="flex gap-0.5 text-gold-500" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" className={`size-4 ${i < rating ? "fill-current" : "opacity-30"}`} strokeWidth={1.2} />
      ))}
    </span>
  );
}

/** Only approved + published testimonials are public. Featured first, then newest. */
export function publicReviews(all: Review[]) {
  return all
    .filter((r) => r.published && r.status === "approved")
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.reviewDate || b.createdAt || "").localeCompare(a.reviewDate || a.createdAt || ""));
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export function ReviewCard({ r, locale }: { r: Review; locale: Locale }) {
  const t = ui[locale];
  const date = r.reviewDate ? new Date(`${r.reviewDate}T00:00:00Z`).toLocaleDateString(dateLocale[locale], { month: "long", year: "numeric", timeZone: "UTC" }) : "";
  const context = [r.program, r.university, r.destination ? term(r.destination, locale) : ""].filter(Boolean).join(" · ");
  return (
    <figure
      className={`relative flex h-full flex-col rounded-3xl border bg-white p-8 transition-shadow duration-500 hover:shadow-[0_30px_60px_-40px_rgba(5,13,28,.45)] ${
        r.featured ? "border-gold-500/40" : "border-navy-900/10"
      }`}
    >
      <div className="flex min-h-5 items-center justify-between gap-4">
        {r.rating > 0 ? (
          <Stars rating={r.rating} label={t.reviews.starsAria(r.rating)} />
        ) : (
          <span aria-hidden className="font-display text-5xl leading-[0.5] text-gold-500/50">
            &ldquo;
          </span>
        )}
        {r.featured && <span className="eyebrow !text-[0.6rem] text-gold-600">{t.common.featured}</span>}
      </div>
      <blockquote className="mt-5 flex-1 font-display text-2xl leading-snug text-navy-900">
        <p>{r.review}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-4 border-t border-navy-900/10 pt-5 text-sm">
        {r.photo ? (
          <Image src={r.photo} alt={t.reviews.photoOf(r.name)} width={56} height={56} className="size-14 shrink-0 rounded-full object-cover ring-2 ring-gold-300/40" />
        ) : (
          <span aria-hidden className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-xl text-gold-300">
            {initials(r.name)}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy-900">{r.name}</span>
          <span className="block text-stone">
            {r.country}
            {date && ` · ${date}`}
          </span>
          {context && <span className="mt-1 block text-xs text-gold-600">{context}</span>}
        </span>
        {r.verified && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-gold-600">
            <Icon name="shield" className="size-3.5" /> {t.common.verified}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export async function Reviews({ reviews, showSubmitLink = true }: { reviews: Review[]; showSubmitLink?: boolean }) {
  const { locale, t } = await getUi();
  if (reviews.length === 0) {
    return (
      <Reveal className="rounded-[2rem] border border-navy-900/10 bg-white/60 p-10 md:p-14">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h3 className="text-3xl text-navy-900 md:text-4xl">{t.reviews.emptyTitle}</h3>
            <p className="mt-3 max-w-xl leading-relaxed text-stone">{t.reviews.emptyBody}</p>
          </div>
          {showSubmitLink && (
            <Link href={lp(locale, "/reviews#write-review")} className="btn btn-navy">
              {t.reviews.write}
            </Link>
          )}
        </div>
      </Reveal>
    );
  }
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r, i) => (
        <Reveal as="li" key={r.id} delay={i * 60}>
          <ReviewCard r={r} locale={locale} />
        </Reveal>
      ))}
    </ul>
  );
}
