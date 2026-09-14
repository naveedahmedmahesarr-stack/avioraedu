"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export type VisaViewerLabels = { open: string; dialog: string; zoomIn: string; zoomOut: string; reset: string; close: string; note: string };

const MIN = 1;
const MAX = 4;

/** Thumbnail + accessible lightbox with zoom for a redacted visa document (the only version ever stored). */
export function VisaViewer({ src, alt, labels }: { src: string; alt: string; labels: VisaViewerLabels }) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(MIN);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(MAX, z + 0.5));
      else if (e.key === "-") setZoom((z) => Math.max(MIN, z - 0.5));
    };
    window.addEventListener("keydown", onKey);
    const opener = trigger.current;
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => {
          setZoom(MIN);
          setOpen(true);
        }}
        className="group/doc relative block w-full overflow-hidden rounded-2xl bg-ivory text-left shadow-[0_24px_50px_-30px_rgba(0,0,0,.8)] ring-1 ring-gold-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
      >
        <span className="relative block aspect-[4/3]">
          <Image src={src} alt={alt} fill sizes="(min-width:1024px) 30vw, (min-width:768px) 45vw, 100vw" className="object-cover object-center transition-transform duration-700 group-hover/doc:scale-[1.03] motion-reduce:transition-none" />
        </span>
        <span className="absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-2 rounded-full bg-navy-950/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ivory backdrop-blur">
          <Icon name="search" className="size-4 text-gold-300" /> {labels.open}
        </span>
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={labels.dialog} className="fixed inset-0 z-[90] flex flex-col bg-navy-950/95">
          <div className="flex items-center justify-between gap-3 border-b border-ivory/10 px-4 py-3 text-ivory sm:px-6">
            <p className="min-w-0 truncate text-sm font-semibold">{labels.dialog}</p>
            <div className="flex shrink-0 items-center gap-1">
              <button type="button" onClick={() => setZoom((z) => Math.max(MIN, z - 0.5))} disabled={zoom <= MIN} aria-label={labels.zoomOut} className="inline-flex size-11 items-center justify-center rounded-full text-xl hover:bg-ivory/10 disabled:opacity-40">
                −
              </button>
              <button type="button" onClick={() => setZoom(MIN)} aria-label={labels.reset} className="h-11 min-w-14 rounded-full px-2 text-sm tabular-nums hover:bg-ivory/10">
                {Math.round(zoom * 100)}%
              </button>
              <button type="button" onClick={() => setZoom((z) => Math.min(MAX, z + 0.5))} disabled={zoom >= MAX} aria-label={labels.zoomIn} className="inline-flex size-11 items-center justify-center rounded-full text-xl hover:bg-ivory/10 disabled:opacity-40">
                +
              </button>
              <button ref={closeBtn} type="button" onClick={() => setOpen(false)} aria-label={labels.close} className="ml-1 inline-flex size-11 items-center justify-center rounded-full hover:bg-ivory/10">
                <Icon name="close" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto overscroll-contain p-4 sm:p-8" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- zoomable full-resolution view; width is driven by the zoom level */}
            <img
              src={src}
              alt={alt}
              onDoubleClick={() => setZoom((z) => (z > MIN ? MIN : 2))}
              style={zoom > MIN ? { width: `${zoom * 100}%`, maxWidth: "none" } : undefined}
              className={`mx-auto block h-auto rounded-lg shadow-2xl ${zoom > MIN ? "cursor-zoom-out" : "max-w-full cursor-zoom-in md:max-h-full md:w-auto"}`}
            />
          </div>
          <p className="border-t border-ivory/10 px-4 py-3 text-center text-xs text-ivory/70 sm:px-6">{labels.note}</p>
        </div>
      )}
    </>
  );
}
