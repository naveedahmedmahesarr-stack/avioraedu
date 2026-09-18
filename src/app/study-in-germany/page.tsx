import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { WhyGermany } from "@/components/sections/WhyGermany";
import { GermanyExperience } from "@/components/sections/GermanyExperience";
import { UniversityExplorer } from "@/components/sections/UniversityExplorer";
import { FaqList } from "@/components/sections/FaqList";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { SectionHeading } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Study in Germany",
  description:
    "Study at German public universities: tuition rules, English-taught programmes, application routes, visa guidance and life in Germany for international students.",
  alternates: { canonical: "/study-in-germany" },
};

export default async function StudyInGermanyPage() {
  await connection();
  const [universities, faqs] = await Promise.all([list("universities", { publishedOnly: true }), list("faqs", { publishedOnly: true })]);
  return (
    <>
      <PageHeader
        eyebrow="Primary destination"
        title={
          <>
            Study in <span className="gold-text">Germany</span>.
          </>
        }
        intro="Public universities, research excellence and a clear path from application to arrival — explained honestly."
      />
      <WhyGermany />
      <GermanyExperience />
      <section aria-labelledby="de-unis" className="bg-sand/50 py-28 md:py-36">
        <div className="container-x">
          <SectionHeading eyebrow="Universities in Germany" title={<span id="de-unis">Explore German universities.</span>} />
          <div className="mt-12">
            <UniversityExplorer universities={universities.filter((u) => u.country === "Germany")} />
          </div>
        </div>
      </section>
      <section aria-labelledby="faq" className="bg-ivory py-28 md:py-36">
        <div className="container-x">
          <SectionHeading eyebrow="Questions" title={<span id="faq">Straight answers.</span>} />
          <div className="mt-12">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>
      <ConsultationCTA defaultDestination="Germany" />
    </>
  );
}
