"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { BrandImageData, GlobeFx } from "@/lib/brand-images";
import { Icon } from "@/components/ui/Icon";

/**
 * A brand photograph shown at its native aspect ratio (never cropped, never moved),
 * with:
 *  - a light brand grade (navy vignette + warm gold wash) so every photo sits in the same palette,
 *  - motion confined to the globe / world-map details listed in `image.fx`,
 *  - a full-image button that opens the lightbox.
 * Detail animations are CSS transform/opacity only and pause while off-screen.
 */
export function BrandImage({
  image,
  sizes,
  priority = false,
  grade = "full",
  onOpen,
  className = "",
  children,
}: {
  image: BrandImageData;
  sizes: string;
  priority?: boolean;
  grade?: "soft" | "full";
  onOpen?: () => void;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      data-paused={visible ? undefined : ""}
      className={`brand-frame group relative isolate overflow-hidden bg-navy-900 ${className}`}
      style={{ aspectRatio: `${image.w} / ${image.h}` }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.w}
        height={image.h}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="absolute inset-0 h-full w-full"
      />
      <div aria-hidden className={`brand-grade brand-grade-${grade}`} />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {image.fx.map((f, i) => (
          <FxDetail key={i} fx={f} delay={i * 1.3} />
        ))}
      </div>
      {children}
      {onOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="absolute inset-0 z-[5] cursor-zoom-in rounded-[inherit] focus-visible:outline-offset-[-4px]"
          aria-label={`View full image: ${image.caption}`}
        >
          <span className="absolute bottom-2.5 right-2.5 inline-flex size-9 items-center justify-center rounded-full border border-gold-300/30 bg-navy-950/75 text-gold-300 opacity-90 transition-[opacity,transform] duration-300 sm:bottom-4 sm:right-4 sm:size-10 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
            <Icon name="search" className="size-4" />
          </span>
        </button>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-gold-300/15" />
    </figure>
  );
}

function FxDetail({ fx, delay }: { fx: GlobeFx; delay: number }) {
  const d = { animationDelay: `-${delay}s` };
  if (fx.kind === "map") {
    return (
      <div className="fx-map" style={{ left: `${fx.x - fx.w / 2}%`, top: `${fx.y - fx.h / 2}%`, width: `${fx.w}%`, height: `${fx.h}%` }}>
        <span className="fx-map-sweep" style={d} />
        {fx.hubs?.map(([hx, hy], i) => (
          <span
            key={i}
            className="fx-hub"
            style={{
              left: `${((hx - (fx.x - fx.w / 2)) / fx.w) * 100}%`,
              top: `${((hy - (fx.y - fx.h / 2)) / fx.h) * 100}%`,
              animationDelay: `${i * 0.9}s`,
            }}
          />
        ))}
      </div>
    );
  }
  const size = { left: `${fx.x}%`, top: `${fx.y}%`, width: `${fx.r * 2}%` };
  if (fx.kind === "icon") {
    return (
      <span className="fx-icon" style={size}>
        <span className="fx-icon-glow" style={d} />
        <span className="fx-icon-ring" style={d} />
        <span className="fx-orbit-tilt">
          <span className="fx-orbit" style={d}>
            <i />
          </span>
        </span>
      </span>
    );
  }
  return (
    <span className="fx-globe" style={size}>
      <span className="fx-globe-sheen" style={d} />
      <span className="fx-orbit-tilt fx-orbit-lg">
        <span className="fx-orbit" style={d}>
          <i />
        </span>
      </span>
    </span>
  );
}
