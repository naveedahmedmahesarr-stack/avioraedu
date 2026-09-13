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
import { publicReviews, Reviews } from "@/components/sections/Reviews";
import { TrustSection } from "@/components/sections/TrustSection";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { CountryLinks } from "@/components/sections/CountryLinks";
import { ServicesList } from "@/components/sections/ServicesList";
import { StudentSupportTeaser } from "@/components/sections/StudentSupportTeaser";
import { KarachiFeature } from "@/components/sections/KarachiFeature";
import { FounderTeaser } from "@/components/sections/FounderTeaser";
import { SectionHeading } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { markets } from "@/lib/content/markets";
import { getSite, postalAddress } from "@/lib/site";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { tr, trAll } from "@/i18n/content";

const orgDescription = {
  en: "Education consultancy in Berlin for studying in Germany and Europe: university admission, student visa preparation and arrival guidance.",
  de: "Bildungsberatung aus Berlin für ein Studium in Deutschland und Europa: Hochschulzulassung, Vorbereitung auf das Studentenvisum und Orientierung bei der Ankunft.",
};

export default async function HomePage() {
  await connection();
  const [site, { locale, t }, homeRaw, destinations, universities, stories, reviews, team] = await Promise.all([
    getSite(),
    getUi(),
    getHomepage(),
    list("destinations", { publishedOnly: true }),
    list("universities", { publishedOnly: true }),
    list("dreamStories", { publishedOnly: true }),
    list("reviews"),
    list("team", { publishedOnly: true }),
  ]);
  const home = tr(homeRaw, locale);
  const founderRaw = [...team].sort((a, b) => a.order - b.order)[0];
  const founder = founderRaw ? tr(founderRaw, locale) : undefined;
  const location = locale === "de" ? site.location.replace("Germany", "Deutschland") : site.location;
  const h = t.home;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: ["en", "de"],
    description: orgDescription[locale],
    publisher: { "@id": `${site.url}/#organization` },
  };

  const sameAs = Object.values(site.social).filter(Boolean);
  // Home-based: no LocalBusiness/ProfessionalService type unless a real street address is entered in Admin.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": site.address?.street ? ["EducationalOrganization", "ProfessionalService"] : "EducationalOrganization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    description: orgDescription[locale],
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(site.address ? { address: postalAddress(site) } : {}),
    ...(founderRaw ? { founder: { "@type": "Person", name: founderRaw.name, jobTitle: founderRaw.role, url: `${site.url}/founder` } } : {}),
    areaServed: markets.map((m) => ({ "@type": "Country", name: m.country })),
    knowsAbout: ["Study in Germany", "German university admission", "German student visa", "Public universities in Germany", "Study abroad in Europe"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd, websiteJsonLd]).replace(/</g, "\\u003c") }} />
      <Hero headline={home.heroHeadline} subheadline={home.heroSubheadline} message={home.heroMessage} />
      <IntroStatement text={home.introStatement} />
      <TrustSection />
      <section aria-labelledby="services" className="bg-navy-950 py-28 text-ivory md:py-40">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading tone="light" eyebrow={t.servicesSection.eyebrow} title={<span id="services">{t.servicesSection.title}</span>} />
            <Link href={lp(locale, "/services")} className="btn btn-ghost-light shrink-0">
              {t.servicesSection.all} <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <div className="mt-14">
            <ServicesList compact tone="dark" />
          </div>
        </div>
      </section>
      <WhyGermany />
      <GermanyExperience />

      <section aria-labelledby="destinations" className="bg-ivory py-28 md:py-40">
        <div className="container-x">
          <SectionHeading eyebrow={h.destEyebrow} title={<span id="destinations">{h.destTitle}</span>} intro={h.destIntro} />
          <div className="mt-16">
            <DestinationExplorer destinations={trAll(destinations, locale)} />
          </div>
        </div>
      </section>

      <CountryLinks />

      <section aria-labelledby="universities" className="bg-ivory py-28 md:py-40">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow={h.unisEyebrow} title={<span id="universities">{h.unisTitle}</span>} />
            <Link href={lp(locale, "/universities")} className="btn btn-outline shrink-0">
              {h.unisAll} <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <div className="mt-14">
            <UniversityExplorer universities={trAll(universities, locale)} limit={6} />
          </div>
        </div>
      </section>

      <StudentSupportTeaser />
      <KarachiFeature />

      <section aria-labelledby="process" className="relative overflow-hidden bg-navy-950 py-28 md:py-40">
        <div className="container-x">
          <SectionHeading tone="light" align="center" eyebrow={h.processEyebrow} title={<span id="process">{h.processTitle}</span>} />
          <div className="mt-20">
            <AdmissionTimeline />
          </div>
        </div>
      </section>

      <section aria-labelledby="stories" className="bg-ivory py-28 md:py-40">
        <div className="container-x">
          <SectionHeading eyebrow={h.storiesEyebrow} title={<span id="stories">{h.storiesTitle}</span>} />
          <div className="mt-14">
            <DreamStories stories={stories} />
          </div>
        </div>
      </section>

      <section aria-labelledby="reviews" className="bg-ivory pb-28 md:pb-40">
        <div className="container-x">
          <SectionHeading eyebrow={h.reviewsEyebrow} title={<span id="reviews">{h.reviewsTitle}</span>} />
          <div className="mt-14">
            <Reviews reviews={publicReviews(reviews).slice(0, 6)} />
          </div>
        </div>
      </section>

      <FounderTeaser founder={founder} location={location} />
      <ConsultationCTA />
    </>
  );
}
