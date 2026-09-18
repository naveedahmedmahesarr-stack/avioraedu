"use client";

import { BrandImage } from "@/components/ui/BrandImage";
import { useLightbox } from "@/components/ui/Lightbox";
import { brandImages } from "@/lib/brand-images";

const set = [brandImages.emblem, brandImages.mobileEmblem];

export function AboutEmblem() {
  const lb = useLightbox(set);
  return (
    <div className="relative mx-auto mt-12 max-w-md lg:max-w-none">
      <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(194,154,82,.3),transparent_70%)]" />
      <BrandImage image={brandImages.emblem} grade="soft" sizes="(min-width: 1024px) 40vw, 90vw" onOpen={() => lb.open(0)} className="!rounded-[2rem]" />
      {lb.node}
    </div>
  );
}
