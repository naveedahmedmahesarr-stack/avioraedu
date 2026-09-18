import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { DreamStories } from "@/components/sections/DreamStories";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Dream Stories",
  description: "Real journeys of international students studying in Germany and Europe, shared with their consent.",
  alternates: { canonical: "/dream-stories" },
};

export default async function DreamStoriesPage() {
  await connection();
  const stories = await list("dreamStories", { publishedOnly: true });
  return (
    <>
      <PageHeader eyebrow="Dream Stories" title="Journeys worth telling." intro="Photos, videos and stories from real students — published only with their consent." skyline="PT" />
      <section className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          <DreamStories stories={stories} showLink={false} />
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
