import Link from "next/link";
import type { Review } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-gold-500" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" className={`size-4 ${i < rating ? "fill-current" : "opacity-30"}`} strokeWidth={1.2} />
      ))}
    </span>
  );
}

export function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-navy-900/10 bg-white p-8">
      <Stars rating={r.rating} />
      <blockquote className="mt-5 flex-1 font-display text-2xl leading-snug text-navy-900">&ldquo;{r.review}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-navy-900/10 pt-5 text-sm">
        <span>
          <span className="block font-semibold text-navy-900">{r.name}</span>
          <span className="text-stone">{r.country}</span>
        </span>
        {r.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-gold-600">
            <Icon name="shield" className="size-3.5" /> Verified
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export function Reviews({ reviews, showSubmitLink = true }: { reviews: Review[]; showSubmitLink?: boolean }) {
  if (reviews.length === 0) {
    return (
      <Reveal className="rounded-[2rem] border border-navy-900/10 bg-white/60 p-10 md:p-14">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h3 className="text-3xl text-navy-900 md:text-4xl">Reviews appear here once approved.</h3>
            <p className="mt-3 max-w-xl leading-relaxed text-stone">
              Every review is submitted by a real person and moderated before publication. We never display invented reviews or rating counts.
            </p>
          </div>
          {showSubmitLink && (
            <Link href="/reviews#write-review" className="btn btn-navy">
              Write a review
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
          <ReviewCard r={r} />
        </Reveal>
      ))}
    </ul>
  );
}
