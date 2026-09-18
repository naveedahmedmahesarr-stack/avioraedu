"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useLightbox } from "@/components/ui/Lightbox";
import { brandImages } from "@/lib/brand-images";

const photo = brandImages.collage;
// The Berlin panel of the brand collage: x 840–1672, y 0–555 of the 1672×941 original.
const CROP = { x: 840, y: 0, w: 832, h: 555 };

type Landmark = {
  id: string;
  name: string;
  local: string;
  district: string;
  facts: [string, string][];
  body: string;
  query: string;
  art: React.ReactNode;
  viewBox: string;
  /** Pin on the photo, only where the landmark is actually visible (percent of the crop). */
  pin?: { x: number; y: number };
};

const landmarks: Landmark[] = [
  {
    id: "tv-tower",
    name: "Berlin TV Tower",
    local: "Berliner Fernsehturm",
    district: "Alexanderplatz · Mitte",
    facts: [
      ["Height", "368 m"],
      ["Opened", "1969"],
      ["View deck", "203 m"],
    ],
    body: "Germany's tallest structure and the skyline you see from the window above. Its sphere holds a viewing deck and a slowly rotating restaurant with 360° views across the city.",
    query: "Berliner Fernsehturm, Panoramastraße 1A, Berlin",
    viewBox: "250 30 100 225",
    art: (
      <>
        <path d="M300 250V70M292 250l8-180 8 180" />
        <circle cx="300" cy="92" r="16" />
        <path d="M284 92h32M300 40v36" />
      </>
    ),
    pin: { x: 53.1, y: 23.4 },
  },
  {
    id: "brandenburg-gate",
    name: "Brandenburg Gate",
    local: "Brandenburger Tor",
    district: "Pariser Platz · Mitte",
    facts: [
      ["Built", "1788–91"],
      ["Style", "Neoclassical"],
      ["Columns", "12"],
    ],
    body: "Berlin's most famous landmark and a symbol of German reunification. A short walk from the Reichstag and the Tiergarten, and a classic first stop for newly arrived students.",
    query: "Brandenburger Tor, Pariser Platz, Berlin",
    viewBox: "90 145 160 115",
    art: (
      <>
        <path d="M110 250v-58h120v58M104 192h132M118 180h104v12M150 170h40v10M162 160h16v10" />
        {[124, 144, 164, 176, 196, 216].map((x) => (
          <path key={x} d={`M${x} 250v-58`} />
        ))}
      </>
    ),
  },
  {
    id: "reichstag",
    name: "Reichstag",
    local: "Reichstagsgebäude",
    district: "Platz der Republik · Tiergarten",
    facts: [
      ["Completed", "1894"],
      ["Glass dome", "1999"],
      ["Seat of", "Bundestag"],
    ],
    body: "Home of the German parliament. Its glass dome, open to visitors free of charge with advance registration, looks straight down into the plenary chamber.",
    query: "Reichstagsgebäude, Platz der Republik 1, Berlin",
    viewBox: "365 150 170 110",
    art: <path d="M380 250v-60h140v60M380 190h140M420 190a30 30 0 0 1 60 0M430 190v-10h40v10M395 250v-45M415 250v-45M485 250v-45M505 250v-45" />,
  },
];

export function BerlinLandmarks() {
  const [active, setActive] = useState<string | null>(null);
  const lm = landmarks.find((l) => l.id === active) ?? null;
  const lb = useLightbox([photo]);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lm) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    // On phones the card opens below the photo — bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) panel.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return () => window.removeEventListener("keydown", onKey);
  }, [lm]);

  const toggle = (id: string) => setActive((a) => (a === id ? null : id));

  return (
    <div className="relative">
      <div className="brand-frame relative overflow-hidden !rounded-[1.5rem] md:!rounded-[2rem]" style={{ aspectRatio: `${CROP.w} / ${CROP.h}` }}>
        <Image
          src={photo.src}
          alt="Berlin at golden hour: the Berliner Dom, the River Spree and the Berlin TV Tower"
          width={photo.w}
          height={photo.h}
          sizes="(min-width: 1320px) 2500px, 200vw"
          loading="lazy"
          className="absolute max-w-none"
          style={{
            width: `${(photo.w / CROP.w) * 100}%`,
            height: `${(photo.h / CROP.h) * 100}%`,
            left: `${(-CROP.x / CROP.w) * 100}%`,
            top: `${(-CROP.y / CROP.h) * 100}%`,
          }}
        />
        <div aria-hidden className="brand-grade brand-grade-full" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-navy-950/10 to-transparent" />

        {/* Hotspot bubbles */}
        <ul className="absolute bottom-3 left-3 z-10 flex flex-col items-start gap-1.5 sm:bottom-auto sm:left-6 sm:top-6 sm:max-w-[70%] sm:flex-row sm:flex-wrap sm:gap-2 md:left-10 md:top-10">
          {landmarks.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => toggle(l.id)}
                aria-expanded={active === l.id}
                aria-controls="landmark-panel"
                className={`flex min-h-8 items-center gap-2 rounded-full border px-3 py-1 text-[0.64rem] font-semibold tracking-wide transition-colors duration-300 sm:min-h-10 sm:px-4 sm:text-xs ${
                  active === l.id ? "border-gold-300 bg-gold-300 text-navy-950" : "border-gold-300/40 bg-navy-950/75 text-gold-300 hover:border-gold-300"
                }`}
              >
                <span className={`relative size-1.5 rounded-full ${active === l.id ? "bg-navy-950" : "hotspot-pulse bg-gold-300"}`} />
                {l.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Pin on the TV Tower (the landmark visible in this view) */}
        {landmarks
          .filter((l) => l.pin)
          .map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => toggle(l.id)}
              aria-label={`${l.name} — show details`}
              className="absolute z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${l.pin!.x}%`, top: `${l.pin!.y}%` }}
            >
              <span className={`hotspot-pulse relative block size-3.5 rounded-full border-2 border-navy-950 ${active === l.id ? "bg-ivory" : "bg-gold-300"} shadow-[0_0_14px_3px_rgba(255,214,140,.7)]`} />
            </button>
          ))}

        <button
          type="button"
          onClick={() => lb.open(0)}
          className="absolute bottom-3 right-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-gold-300/30 bg-navy-950/75 text-gold-300 transition-colors hover:border-gold-300 sm:bottom-5 sm:right-5"
          aria-label="View the full Berlin image"
        >
          <Icon name="search" className="size-4" />
        </button>
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-gold-300/15" />
      </div>

      {/* Detail card: floats over the photo on large screens, sits below it on phones/tablets */}
      <div
        ref={panel}
        id="landmark-panel"
        aria-live="polite"
        className="scroll-mb-6 lg:absolute lg:bottom-8 lg:right-8 lg:top-8 lg:z-20 lg:flex lg:w-[380px] lg:items-center"
      >
        {lm && (
          <article
            key={lm.id}
            className="animate-fade-up relative mt-4 w-full rounded-3xl border border-gold-300/20 bg-navy-950/95 p-6 text-ivory shadow-[0_30px_80px_-30px_rgba(0,0,0,.9)] [animation-duration:.6s] lg:mt-0 lg:p-7"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-gold-300/25 text-ivory/80 transition-colors hover:border-gold-300 hover:text-gold-300"
              aria-label="Close landmark details"
            >
              <Icon name="close" className="size-4" />
            </button>
            <div className="flex items-end gap-5">
              <svg viewBox={lm.viewBox} className="h-20 w-auto shrink-0 text-gold-300" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {lm.art}
              </svg>
              <div className="min-w-0 pr-10">
                <p className="eyebrow !text-[0.58rem] text-gold-300">{lm.district}</p>
                <h3 className="mt-2 text-3xl leading-none">{lm.name}</h3>
                <p className="mt-1 font-display text-lg italic text-ivory/60">{lm.local}</p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-gold-300/15 py-4">
              {lm.facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow !text-[0.52rem] !tracking-[0.2em] text-navy-300">{k}</dt>
                  <dd className="mt-1 font-display text-xl text-gold-300">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-ivory/75">{lm.body}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lm.query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold mt-6 w-full"
            >
              Open location in Maps <Icon name="arrowUpRight" className="size-4" />
            </a>
          </article>
        )}
      </div>
      {lb.node}
    </div>
  );
}
