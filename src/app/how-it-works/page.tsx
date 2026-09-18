import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdmissionTimeline } from "@/components/sections/AdmissionTimeline";
import { FaqList } from "@/components/sections/FaqList";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { SectionHeading } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "How It Works — University Applications in Germany & Europe",
  description: "Our nine-step process: consultation, profile assessment, university selection, documents, application, visa guidance, pre-departure and arrival.",
  alternates: { canonical: "/how-it-works" },
};

export default async function HowItWorksPage() {
  await connection();
  const faqs = await list("faqs", { publishedOnly: true });
  return (
    <>
      <PageHeader eyebrow="How it works" title="From first conversation to first semester." intro="A structured, transparent process — with clear explanations of what we do and what universities and authorities decide." skyline="PL" />
      <section className="bg-navy-950 py-24 md:py-36">
        <div className="container-x">
          <AdmissionTimeline />
        </div>
      </section>
      <section aria-labelledby="faq" className="bg-ivory py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="FAQ" title={<span id="faq">Common questions</span>} />
          <div className="mt-12">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
