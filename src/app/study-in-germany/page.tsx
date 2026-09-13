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
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Study in Germany — University Admission Consultant",
  description:
    "Study in Germany with guidance from a Germany education consultant: public university admission, tuition rules, English-taught programmes, student visa requirements and arrival.",
  alternates: { canonical: "/study-in-germany" },
};

export default async function StudyInGermanyPage() {
  await connection();
  const [universities, faqs] = await Promise.all([list("universities", { publishedOnly: true }), list("faqs", { publishedOnly: true })]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Study in Germany admission guidance",
            serviceType: "Education consulting for university admission in Germany",
            provider: { "@type": "EducationalOrganization", name: siteConfig.name, url: siteConfig.url },
            areaServed: ["DE", "PK", "IN", "AE", "SA", "BD"],
            description:
              "Profile assessment, university and programme selection, application documents, visa guidance and pre-departure support for studying in Germany. Admission and visa decisions are made by universities and authorities.",
          }).replace(/</g, "\\u003c"),
        }}
      />
      <PageHeader
        crumbs={[{ name: "Study in Germany", path: "/study-in-germany" }]}
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
