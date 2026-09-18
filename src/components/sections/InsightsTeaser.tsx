import Link from "next/link";
import type { Media } from "@/lib/content/schemas";
import { InsightsGallery } from "@/components/insights/InsightsGallery";
import { SectionHeading } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

/** Homepage strip with the latest published Germany Insights (videos first). */
export function InsightsTeaser({ media }: { media: Media[] }) {
  if (media.length === 0) return null;
  const pick = [...media.filter((m) => m.kind === "video"), ...media.filter((m) => m.kind === "image")].slice(0, 6);
  return (
    <section aria-labelledby="insights-teaser" className="relative overflow-hidden bg-navy-950 py-28 text-ivory md:py-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_40%_at_15%_0%,rgba(194,154,82,.14),transparent_70%)]" />
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading tone="light" eyebrow="Germany Insights" title={<span id="insights-teaser">Fresh from Germany.</span>} intro="City visits, campuses, student life and success stories — straight from our team." />
          <Link href="/germany-insights" className="btn btn-ghost-light shrink-0">
            View all photos & videos <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
        <div className="mt-14">
          <InsightsGallery items={pick} compact />
        </div>
      </div>
    </section>
  );
}
