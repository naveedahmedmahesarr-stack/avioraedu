import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { publicReviews, Reviews } from "@/components/sections/Reviews";
import { ReviewSubmitForm } from "@/components/sections/ReviewSubmitForm";
import { SectionHeading } from "@/components/ui/Reveal";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/i18n/meta";

const copy = {
  en: {
    title: "Client Reviews & Testimonials",
    description: "Moderated reviews from real students AVIORA EDU has advised on university admission in Germany and Europe. No invented testimonials.",
    eyebrow: "Reviews",
    h1: "Honest words from real students.",
    intro: "Every review is moderated before publication. “Verified” appears only where we have confirmed the reviewer was a client.",
    shareEyebrow: "Share your experience",
    shareTitle: "Write a review",
    shareIntro: "Worked with AVIORA EDU? Your honest feedback helps future students.",
  },
  de: {
    title: "Bewertungen & Erfahrungsberichte",
    description: "Geprüfte Bewertungen von Studierenden, die AVIORA EDU bei der Zulassung in Deutschland und Europa beraten hat. Keine erfundenen Erfahrungsberichte.",
    eyebrow: "Bewertungen",
    h1: "Ehrliche Worte von echten Studierenden.",
    intro: "Jede Bewertung wird vor der Veröffentlichung geprüft. „Verifiziert“ erscheint nur, wenn wir bestätigt haben, dass die Person von uns beraten wurde.",
    shareEyebrow: "Teilen Sie Ihre Erfahrung",
    shareTitle: "Bewertung schreiben",
    shareIntro: "Haben Sie mit AVIORA EDU gearbeitet? Ihr ehrliches Feedback hilft künftigen Studierenden.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/reviews", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function ReviewsPage() {
  await connection();
  const [all, locale] = await Promise.all([list("reviews"), getLocale()]);
  const reviews = publicReviews(all);
  const c = copy[locale];
  return (
    <>
      <PageHeader crumbs={[{ name: c.eyebrow, path: "/reviews" }]} eyebrow={c.eyebrow} title={c.h1} intro={c.intro} skyline="AT" />
      <section className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          <Reviews reviews={reviews} showSubmitLink={false} />
        </div>
      </section>
      <section id="write-review" aria-labelledby="write-review-title" className="scroll-mt-24 bg-sand/50 py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow={c.shareEyebrow} title={<span id="write-review-title">{c.shareTitle}</span>} intro={c.shareIntro} />
          <ReviewSubmitForm />
        </div>
      </section>
    </>
  );
}
