"use client";

import { Reveal } from "@/components/ui/Reveal";
import { BrandImage } from "@/components/ui/BrandImage";
import { useLightbox } from "@/components/ui/Lightbox";
import { brandImages } from "@/lib/brand-images";

const img = brandImages.showcase;
// Positions on the world map inside the photograph (percent of the image box).
const GERMANY = { x: 78.5, y: 8.0 };
const PAKISTAN = { x: 84.3, y: 11.9 };
const px = (p: { x: number; y: number }) => [(p.x / 100) * img.w, (p.y / 100) * img.h] as const;

/**
 * The flagship brand photograph. The picture itself is completely still — only its
 * globe / map details move (desk globe light, emblem globe glow, map sweep), plus a
 * Germany ↔ Pakistan flight arc and two labels drawn on top of the map.
 */
export function BrandShowcase3D() {
  const lb = useLightbox([img]);
  const [gx, gy] = px(GERMANY);
  const [kx, ky] = px(PAKISTAN);

  return (
    <section aria-labelledby="brand-showcase" className="relative overflow-hidden bg-navy-950 pb-28 pt-6 text-ivory md:pb-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_55%,rgba(194,154,82,.16),transparent_70%)]" />
      <div className="container-x relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow flex items-center justify-center gap-3 text-gold-300">
            <span className="h-px w-8 bg-gold-300/60" aria-hidden /> Education beyond borders
          </p>
          <h2 id="brand-showcase" className="mt-5 text-[clamp(2.1rem,5vw,4.4rem)] leading-[1.04]">
            One address for your <span className="gold-text">global</span> future.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-navy-300 md:text-lg">
            People, pathways and possibilities — from your first question to your first semester in Germany.
          </p>
        </Reveal>

        <Reveal delay={120} className="relative mx-auto mt-12 max-w-6xl md:mt-20">
          <div aria-hidden className="pointer-events-none absolute -inset-x-[6%] -inset-y-[10%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(216,182,116,.22),transparent_70%)]" />
          <BrandImage
            image={img}
            grade="soft"
            sizes="(min-width: 1280px) 1150px, (min-width: 768px) 92vw, 100vw"
            onOpen={() => lb.open(0)}
            className="md:!rounded-[1.75rem]"
          >
            <svg aria-hidden viewBox={`0 0 ${img.w} ${img.h}`} className="pointer-events-none absolute inset-0 h-full w-full">
              <path
                d={`M${gx},${gy} Q${(gx + kx) / 2},${Math.min(gy, ky) - 70} ${kx},${ky}`}
                fill="none"
                stroke="rgba(243,226,184,.35)"
                strokeWidth="1.6"
                strokeDasharray="4 6"
              />
              <path
                d={`M${gx},${gy} Q${(gx + kx) / 2},${Math.min(gy, ky) - 70} ${kx},${ky}`}
                fill="none"
                stroke="#fff1cf"
                strokeWidth="3"
                strokeLinecap="round"
                pathLength={1}
                className="fx-arc"
              />
            </svg>
            <span aria-hidden className="fx-label fx-label-left" style={{ left: `${GERMANY.x}%`, top: `${GERMANY.y}%` }}>
              <span className="fx-label-dot" />
              <span className="fx-label-line" />
              <span className="fx-label-text">Germany</span>
            </span>
            <span aria-hidden className="fx-label fx-label-down" style={{ left: `${PAKISTAN.x}%`, top: `${PAKISTAN.y}%` }}>
              <span className="fx-label-dot" />
              <span className="fx-label-line" />
              <span className="fx-label-text">Pakistan</span>
            </span>
          </BrandImage>
          <p className="sr-only">The world map in this image highlights Germany and Pakistan, connected by a flight route.</p>
        </Reveal>

        <ul className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-4 text-center sm:grid-cols-4 md:mt-20">
          {["Study", "Work", "Grow", "Belong"].map((w) => (
            <li key={w} className="eyebrow border-t border-gold-300/20 pt-4 text-gold-300">
              {w}
            </li>
          ))}
        </ul>
      </div>
      {lb.node}
    </section>
  );
}
