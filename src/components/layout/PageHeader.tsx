import { CitySkyline } from "@/components/brand/CitySkyline";

export function PageHeader({ eyebrow, title, intro, skyline = "DE" }: { eyebrow: string; title: React.ReactNode; intro?: string; skyline?: string }) {
  return (
    <header className="relative overflow-hidden bg-navy-950 pb-20 pt-40 text-ivory md:pb-28 md:pt-48">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_80%_at_80%_0%,rgba(194,154,82,.18),transparent_60%)]" />
      <CitySkyline code={skyline} className="pointer-events-none absolute -bottom-2 right-0 w-[min(760px,90vw)] text-gold-400/25" />
      <div className="container-x relative">
        <p className="eyebrow animate-fade-up flex items-center gap-3 text-gold-300">
          <span className="h-px w-10 bg-gold-300/60" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="animate-fade-up mt-6 max-w-4xl text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.98]" style={{ animationDelay: "120ms" }}>
          {title}
        </h1>
        {intro ? (
          <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-navy-300" style={{ animationDelay: "240ms" }}>
            {intro}
          </p>
        ) : null}
      </div>
    </header>
  );
}
