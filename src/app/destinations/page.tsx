import type { Metadata } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { DestinationExplorer } from "@/components/sections/DestinationExplorer";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "Study Destinations in Europe",
  description: "Study in Germany, Italy, Poland, Portugal or Austria — compare European study opportunities for international students.",
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  await connection();
  const destinations = await list("destinations", { publishedOnly: true });
  return (
    <>
      <PageHeader eyebrow="Destinations" title="Where students study." intro="Germany is our primary focus. Italy, Poland, Portugal and Austria complete a carefully chosen set of European destinations." skyline="IT" />
      <section className="bg-ivory py-24 md:py-32">
        <div className="container-x">
          <DestinationExplorer destinations={destinations} />
        </div>
      </section>
      <ConsultationCTA />
    </>
  );
}
