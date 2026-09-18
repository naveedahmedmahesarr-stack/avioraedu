"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { MEDIA_CATEGORIES, type Media } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";
import { useLightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { VideoModal } from "./VideoModal";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
type Filter = "All" | "Videos" | (typeof MEDIA_CATEGORIES)[number];

/**
 * Germany Insights feed. Masonry columns keep every photo/video at its true ratio
 * (space is reserved from width/height → no layout shift). Thumbnails go through
 * next/image and lazy-load; video bytes load only when a clip is hovered (desktop) or opened.
 */
export function InsightsGallery({ items, compact = false }: { items: Media[]; compact?: boolean }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [playing, setPlaying] = useState<Media | null>(null);

  const cats = useMemo(() => MEDIA_CATEGORIES.filter((c) => items.some((m) => m.category === c)), [items]);
  const hasVideos = items.some((m) => m.kind === "video");
  const shown = useMemo(() => items.filter((m) => filter === "All" || (filter === "Videos" ? m.kind === "video" : m.category === filter)), [items, filter]);
  const images = shown.filter((m) => m.kind === "image");
  const lb = useLightbox(images.map((m) => ({ src: m.src, w: m.width, h: m.height, alt: m.title, caption: m.title })));

  if (items.length === 0) {
    return <p className="rounded-3xl border border-dashed border-gold-300/25 p-12 text-center text-navy-300">New photos and videos from Germany are on their way — check back soon.</p>;
  }

  const tabs: Filter[] = ["All", ...(hasVideos ? (["Videos"] as const) : []), ...cats];

  return (
    <div>
      {!compact && (
        <div role="tablist" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {tabs.map((c) => {
            const n = c === "All" ? items.length : c === "Videos" ? items.filter((m) => m.kind === "video").length : items.filter((m) => m.category === c).length;
            const on = filter === c;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={on}
                type="button"
                onClick={() => setFilter(c)}
                className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-300 ${
                  on ? "border-gold-300 bg-gold-300 text-navy-950" : "border-gold-300/25 text-ivory/80 hover:border-gold-300/60 hover:text-gold-300"
                }`}
              >
                {c}
                <span className={`text-xs ${on ? "text-navy-950/60" : "text-ivory/40"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      )}

      <ul className={`${compact ? "" : "mt-10"} columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5`}>
        {shown.map((m, i) => (
          <Reveal as="li" key={m.id} delay={(i % 3) * 80} className="break-inside-avoid">
            <Card item={m} onOpen={() => (m.kind === "video" ? setPlaying(m) : lb.open(images.indexOf(m)))} />
          </Reveal>
        ))}
      </ul>
      {lb.node}
      {playing && <VideoModal item={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}

function Card({ item, onOpen }: { item: Media; onOpen: () => void }) {
  const preview = useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = useState(false);
  const isVideo = item.kind === "video";
  const thumb = isVideo ? item.poster : item.src;

  // Desktop-only muted hover preview; touch devices never download video until opened.
  const startPreview = (e: React.PointerEvent) => {
    if (!isVideo || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPreviewing(true);
    requestAnimationFrame(() => preview.current?.play().catch(() => {}));
  };
  const stopPreview = () => {
    preview.current?.pause();
    setPreviewing(false);
  };

  return (
    <figure
      className="brand-frame group relative overflow-hidden bg-navy-900"
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
      onPointerEnter={startPreview}
      onPointerLeave={stopPreview}
    >
      {thumb ? (
        <Image src={thumb} alt={item.title} width={item.width} height={item.height} sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(194,154,82,.25),transparent_70%)]" />
      )}
      {isVideo && previewing && <video ref={preview} src={item.src} muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />}
      <div aria-hidden className="brand-grade brand-grade-full" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-950/90 via-navy-950/35 to-transparent" />

      {isVideo && (
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-300/50 bg-navy-950/60 text-gold-300 shadow-[0_0_40px_-6px_rgba(216,182,116,.6)] transition-transform duration-500 group-hover:scale-110"
        >
          <Icon name="play" className="ml-1 size-6" />
        </span>
      )}
      <span className="absolute left-3 top-3 rounded-full border border-gold-300/25 bg-navy-950/75 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold-300">
        {isVideo ? `Video${item.duration ? ` · ${fmt(item.duration)}` : ""}` : item.category}
      </span>
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
        {isVideo && <p className="eyebrow !text-[0.55rem] text-gold-300/80">{item.category}</p>}
        <p className="mt-1 font-display text-xl leading-tight text-ivory sm:text-2xl">{item.title}</p>
        {item.description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ivory/65">{item.description}</p>}
      </figcaption>
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 z-[5] cursor-pointer rounded-[inherit] focus-visible:outline-offset-[-4px]"
        aria-label={`${isVideo ? "Play video" : "View photo"}: ${item.title}`}
      />
    </figure>
  );
}
