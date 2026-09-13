import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { UniversityExplorer } from "@/components/sections/UniversityExplorer";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Universities in Germany & Europe",
  description: "Search universities in Germany, Italy, Poland, Portugal and Austria by degree level, study field, language and location.",
  alternates: { canonical: "/universities" },
};

export default async function UniversitiesPage() {
  await connection();
  const universities = await list("universities", { publishedOnly: true });
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Universities", path: "/universities" }]}
        eyebrow="University discovery"
        title="Find your university."
        intro="Filter by country, degree level, field and language. Always confirm requirements and fees on the university's official website. AVIORA EDU is not affiliated with the institutions listed unless explicitly stated."
        skyline="AT"
      />
      <section className="bg-ivory py-20 md:py-28">
        <div className="container-x">
          <UniversityExplorer universities={universities} />
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
