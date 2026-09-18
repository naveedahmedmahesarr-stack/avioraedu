"use client";

import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { BrandImage } from "@/components/ui/BrandImage";
import { useLightbox } from "@/components/ui/Lightbox";
import { brandImages as b, type BrandImageData } from "@/lib/brand-images";

// Curated order. Every tile keeps its photo's native ratio, so nothing is cropped
// and the globe/map detail overlays stay exactly on their subjects.
const feature = b.officeAtrium;
const stack = [b.receptionWall, b.receptionLounge];
const pair = [b.officeBerlin, b.officePakistan];
const finale = b.wallSignature;
const all: BrandImageData[] = [feature, ...stack, ...pair, finale];

function Caption({ image }: { image: BrandImageData }) {
  return (
    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] flex items-end gap-3 py-3.5 pl-4 pr-14 sm:pb-4 sm:pl-5">
      <span className="eyebrow !text-[0.58rem] !tracking-[0.24em] text-gold-300">{image.caption}</span>
    </figcaption>
  );
}

export function InsideAviora() {
  const lb = useLightbox(all);
  const tile = (image: BrandImageData, sizes: string, className = "") => {
    const i = all.indexOf(image);
    return (
      <BrandImage image={image} sizes={sizes} onOpen={() => lb.open(i)} className={className}>
        <Caption image={image} />
      </BrandImage>
    );
  };

  return (
    <section aria-labelledby="inside-aviora" className="relative overflow-hidden bg-navy-950 py-28 text-ivory md:py-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_40%_at_80%_10%,rgba(194,154,82,.14),transparent_70%)]" />
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            tone="light"
            eyebrow="Inside AVIORA EDU"
            title={<span id="inside-aviora">A home for ambitious journeys.</span>}
            intro="Where consultations, applications, visas and settlement plans come together — people, pathways and possibilities."
          />
          <p className="eyebrow shrink-0 !text-[0.6rem] text-ivory/45">Tap any image to view in full</p>
        </div>

        {/* Row 1: feature + two stacked. Right column width is solved so both sides share one height:
            W = 2w + 1.5g  ⇒  w = (100% − 2.5g) / 3 with g = 1.5rem. */}
        <Reveal className="mt-14 flex flex-col gap-6 md:flex-row">
          <div className="min-w-0 flex-1">{tile(feature, "(min-width: 768px) 62vw, 92vw")}</div>
          <div className="flex flex-col gap-6 md:w-[calc((100%-3.75rem)/3)] md:flex-none">
            {stack.map((s) => (
              <div key={s.id}>{tile(s, "(min-width: 768px) 30vw, 92vw")}</div>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {pair.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              {tile(p, "(min-width: 768px) 46vw, 92vw")}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6">{tile(finale, "(min-width: 1320px) 1224px, 92vw")}</Reveal>
      </div>
      {lb.node}
    </section>
  );
}
