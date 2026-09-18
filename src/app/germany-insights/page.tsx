import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { InsightsGallery } from "@/components/insights/InsightsGallery";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { sortMedia } from "@/lib/media/sort";

export const metadata: Metadata = {
  title: "Germany Insights",
  description: "Photos and videos from Germany — city life, universities, student life, success stories and the AVIORA EDU office.",
  alternates: { canonical: "/germany-insights" },
};

export default async function GermanyInsightsPage() {
  await connection();
  const media = sortMedia(await list("media", { publishedOnly: true }));
  return (
    <>
      <PageHeader
        eyebrow="Germany Insights"
        title={
          <>
            See Germany <span className="gold-text">for yourself</span>.
          </>
        }
        intro="Real photos and clips — city visits, campuses, student life, success stories and a look inside our office."
      />
      <section aria-label="Photos and videos" className="relative bg-navy-950 pb-28 pt-4 text-ivory md:pb-40">
        <div className="container-x">
          <InsightsGallery items={media} />
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
