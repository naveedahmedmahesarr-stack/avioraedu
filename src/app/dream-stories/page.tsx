import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { DreamStories } from "@/components/sections/DreamStories";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/i18n/meta";

const copy = {
  en: {
    title: "Student Visa Success Stories",
    description: "Real German student visa approvals of students advised by AVIORA EDU, published with written consent and with personal data redacted.",
    h1: "Real students. Real visas.",
    intro: "Every case below is a genuine visa approval of a student we advised. Personal data is redacted, and each story is published with the student's written consent.",
    listTitle: "Student visa success cases",
  },
  de: {
    title: "Visum-Erfolgsgeschichten",
    description: "Echte Studentenvisa von Studierenden, die AVIORA EDU beraten hat – mit schriftlicher Zustimmung und geschwärzten persönlichen Daten veröffentlicht.",
    h1: "Echte Studierende. Echte Visa.",
    intro: "Jeder Fall ist ein echtes Visum einer Person, die wir beraten haben. Persönliche Daten sind geschwärzt; jede Geschichte erscheint mit schriftlicher Zustimmung.",
    listTitle: "Visum-Erfolgsfälle",
  },
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
      <section aria-labelledby="story-results" className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          <h2 id="story-results" className="sr-only">
            {c.listTitle}
          </h2>
          <DreamStories stories={stories} showLink={false} />
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
