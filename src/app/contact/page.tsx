import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Contact & Book a Consultation",
  description:
    "Book a consultation with a Germany education consultant. Tell us your goals and we review your profile for studying in Germany, Italy, Poland, Portugal or Austria.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage(props: PageProps<"/contact">) {
  const sp = await props.searchParams;
  const destination = typeof sp.destination === "string" ? sp.destination : undefined;
  return (
    <>
      <PageHeader crumbs={[{ name: "Contact", path: "/contact" }]} eyebrow="Contact" title="Start the conversation." intro="Request a consultation and we will get back to you personally." />
      <ConsultationCTA defaultDestination={destination} />
    </>
  );
}
