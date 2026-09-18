import type { Metadata } from "next";
import { connection } from "next/server";
import { getHomepage, list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { AboutSection } from "@/components/sections/AboutSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "About AVIORA EDU — Germany Education Consultancy",
  description: "Who AVIORA EDU is, what we do and how we support international students applying to universities in Germany and Europe.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  await connection();
  const [home, team] = await Promise.all([getHomepage(), list("team", { publishedOnly: true })]);
  return (
    <>
      <PageHeader eyebrow="About" title="Focused. Honest. European." intro={home.aboutWho} />
      <AboutSection home={home} team={team} />
      <TrustSection />
      <ConsultationCTA />
    </>
  );
}
