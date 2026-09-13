import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { DreamStories } from "@/components/sections/DreamStories";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/i18n/meta";

const copy = {
  en: { title: "Dream Stories", description: "Real stories of international students studying in Germany and Europe, shared with their consent.", h1: "Stories worth telling.", intro: "Photos, videos and stories from real students — published only with their consent." },
  de: { title: "Erfolgsgeschichten", description: "Echte Geschichten internationaler Studierender in Deutschland und Europa – mit ihrer Zustimmung veröffentlicht.", h1: "Geschichten, die erzählt werden sollten.", intro: "Fotos, Videos und Geschichten echter Studierender – nur mit ihrer Zustimmung veröffentlicht." },
};

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const locale = await getLocale();
  return pageMeta(locale, "/dream-stories", { en: copy.en.title, de: copy.de.title }, { en: copy.en.description, de: copy.de.description });
}

export default async function DreamStoriesPage() {
  await connection();
  const [stories, locale] = await Promise.all([list("dreamStories", { publishedOnly: true }), getLocale()]);
  const c = copy[locale];
  return (
    <>
      <PageHeader crumbs={[{ name: c.title, path: "/dream-stories" }]} eyebrow={c.title} title={c.h1} intro={c.intro} skyline="PT" />
      <section className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          <DreamStories stories={stories} showLink={false} />
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
