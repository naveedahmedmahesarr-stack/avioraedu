import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reviews } from "@/components/sections/Reviews";
import { ReviewSubmitForm } from "@/components/sections/ReviewSubmitForm";
import { SectionHeading } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Moderated reviews from international students supported by AVIORA EDU with university admission and study guidance for Germany and Europe. Share your own experience.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  await connection();
  const reviews = await list("reviews", { publishedOnly: true });
  return (
    <>
      <PageHeader crumbs={[{ name: "Reviews", path: "/reviews" }]} eyebrow="Reviews" title="Honest words from real students." intro="Every review is moderated before publication. “Verified” appears only where we have confirmed the reviewer was a client." skyline="AT" />
      <section className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          <Reviews reviews={reviews} showSubmitLink={false} />
        </div>
      </section>
      <section id="write-review" aria-labelledby="write-review-title" className="scroll-mt-24 bg-sand/50 py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Share your experience" title={<span id="write-review-title">Write a review</span>} intro="Worked with AVIORA EDU? Your honest feedback helps future students." />
          <ReviewSubmitForm />
        </div>
      </section>
    </>
  );
}
