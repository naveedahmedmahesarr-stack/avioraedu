import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { UniversityExplorer } from "@/components/sections/UniversityExplorer";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/ui/Flag";

async function getDestination(slug: string) {
  const all = await list("destinations", { publishedOnly: true });
  return all.find((d) => d.slug === slug) ?? null;
}

export async function generateMetadata(props: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const d = await getDestination(slug);
  if (!d) return { title: "Destination not found" };
  return {
    title: `Study in ${d.name}`,
    description: `${d.tagline} Universities, study benefits and student life in ${d.name} for international students.`,
    alternates: { canonical: `/destinations/${d.slug}` },
  };
}

export default async function DestinationPage(props: PageProps<"/destinations/[slug]">) {
  await connection();
  const { slug } = await props.params;
  if (slug === "germany") redirect("/study-in-germany");
  const d = await getDestination(slug);
  if (!d) notFound();
  const universities = (await list("universities", { publishedOnly: true })).filter((u) => u.country === d.country);

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Destinations", path: "/destinations" },
          { name: d.name, path: `/destinations/${d.slug}` },
        ]}
        eyebrow={`Study destination · ${d.name}`}
        title={
          <span className="inline-flex flex-wrap items-center gap-5">
            <Flag code={d.flag} className="h-10 w-14" /> Study in {d.name}.
          </span>
        }
        intro={d.tagline}
        skyline={d.flag}
      />
      <section className="bg-ivory py-24 md:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <p className="font-display text-3xl leading-snug text-navy-900 md:text-4xl">{d.description}</p>
            {d.gallery.length > 0 && (
              <ul className="mt-12 grid grid-cols-2 gap-4">
                {d.gallery.map((src, i) => (
                  <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image src={src} alt={`${d.name} — image ${i + 1}`} fill sizes="(min-width:1024px) 30vw, 50vw" className="object-cover" />
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
          <Reveal delay={120} className="space-y-10">
            <div>
              <h2 className="eyebrow text-gold-600">Study benefits</h2>
              <ul className="mt-5 space-y-4">
                {d.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-stone">
                    <Icon name="check" className="mt-0.5 size-5 shrink-0 text-gold-600" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-gold-600">Lifestyle</h2>
              <ul className="mt-5 space-y-3 text-stone">
                {d.lifestyle.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-gold-600">Major student cities</h2>
              <p className="mt-5 font-display text-2xl text-navy-900">{d.cities.join(" · ")}</p>
            </div>
          </Reveal>
        </div>
      </section>
      {universities.length > 0 && (
        <section className="bg-sand/50 py-24 md:py-32">
          <div className="container-x">
            <SectionHeading eyebrow="Universities" title={`Universities in ${d.name}`} />
            <div className="mt-12">
              <UniversityExplorer universities={universities} />
            </div>
          </div>
        </section>
      )}
      <ConsultationCTA defaultDestination={d.name} />
    </>
  );
}
