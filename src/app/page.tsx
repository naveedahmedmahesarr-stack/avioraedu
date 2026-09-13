import Link from "next/link";
import { connection } from "next/server";
import { getHomepage, list } from "@/lib/content/store";
import { Hero } from "@/components/hero/Hero";
import { IntroStatement } from "@/components/sections/IntroStatement";
import { WhyGermany } from "@/components/sections/WhyGermany";
import { GermanyExperience } from "@/components/sections/GermanyExperience";
import { DestinationExplorer } from "@/components/sections/DestinationExplorer";
import { UniversityExplorer } from "@/components/sections/UniversityExplorer";
import { AdmissionTimeline } from "@/components/sections/AdmissionTimeline";
import { DreamStories } from "@/components/sections/DreamStories";
import { Reviews } from "@/components/sections/Reviews";
import { TrustSection } from "@/components/sections/TrustSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { SectionHeading } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/config";

export default async function HomePage() {
  await connection();
  const [home, destinations, universities, stories, reviews, team] = await Promise.all([
    getHomepage(),
    list("destinations", { publishedOnly: true }),
    list("universities", { publishedOnly: true }),
    list("dreamStories", { publishedOnly: true }),
    list("reviews", { publishedOnly: true }),
    list("team", { publishedOnly: true }),
  ]);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en",
    description: siteConfig.description,
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    areaServed: ["PK", "IN", "AE", "SA", "BD"],
    knowsAbout: ["Study in Germany", "German public universities", "Study in Europe", "University applications"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd, websiteJsonLd]).replace(/</g, "\\u003c") }} />
      <Hero headline={home.heroHeadline} subheadline={home.heroSubheadline} message={home.heroMessage} />
      <IntroStatement text={home.introStatement} />
      <WhyGermany />
      <GermanyExperience />

      <section aria-labelledby="destinations" className="bg-ivory py-28 md:py-40">
        <div className="container-x">
          <SectionHeading
            eyebrow="Explore destinations"
            title={<span id="destinations">Germany first. Four more exceptional choices.</span>}
            intro="We focus on a small number of European countries so our guidance stays genuinely expert."
          />
          <div className="mt-16">
            <DestinationExplorer destinations={destinations} />
          </div>
        </div>
      </section>

      <section aria-labelledby="universities" className="bg-sand/50 py-28 md:py-40">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="University discovery" title={<span id="universities">Find programmes that fit your profile.</span>} />
            <Link href="/universities" className="btn btn-outline shrink-0">
              All universities <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <div className="mt-14">
            <UniversityExplorer universities={universities} limit={6} />
          </div>
        </div>
      </section>

      <section aria-labelledby="process" className="relative overflow-hidden bg-navy-950 py-28 md:py-40">
        <div className="container-x">
          <SectionHeading tone="light" align="center" eyebrow="How it works" title={<span id="process">Nine steps from first conversation to arrival.</span>} />
          <div className="mt-20">
            <AdmissionTimeline />
          </div>
        </div>
      </section>

      <section aria-labelledby="stories" className="bg-ivory py-28 md:py-40">
        <div className="container-x">
          <SectionHeading eyebrow="Dream Stories" title={<span id="stories">Real journeys. Real students. Shared with consent.</span>} />
          <div className="mt-14">
            <DreamStories stories={stories} />
          </div>
        </div>
      </section>

      <section aria-labelledby="reviews" className="bg-ivory pb-28 md:pb-40">
        <div className="container-x">
          <SectionHeading eyebrow="Reviews" title={<span id="reviews">In the words of the students we support.</span>} />
          <div className="mt-14">
            <Reviews reviews={reviews.slice(0, 6)} />
          </div>
        </div>
      </section>

      <TrustSection />
      <AboutSection home={home} team={team} />
      <ConsultationCTA />
    </>
  );
}
