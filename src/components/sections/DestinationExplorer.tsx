"use client";

import Link from "next/link";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { Destination } from "@/lib/content/schemas";
import { Flag } from "@/components/ui/Flag";
import { Icon } from "@/components/ui/Icon";
import { CitySkyline } from "@/components/brand/CitySkyline";
import { useLocale, useLp, useUi } from "@/i18n/LocaleProvider";
import { term } from "@/i18n/content";

export function DestinationCard({ d, active, onSelect, primaryLabel }: { d: Destination; active: boolean; onSelect: () => void; primaryLabel: string }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className={`group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-500 ${
        active ? "border-gold-500/60 bg-navy-900 text-ivory shadow-xl" : "border-navy-900/10 bg-white/60 text-navy-900 hover:border-gold-500/40 hover:bg-white"
      }`}
    >
      <Flag code={d.flag} className="h-5 w-7" decorative />
      <span className="flex-1">
        <span className="block font-display text-2xl leading-none">{d.name}</span>
        {d.primary && <span className={`eyebrow mt-1 block !text-[0.58rem] ${active ? "text-gold-300" : "text-gold-600"}`}>{primaryLabel}</span>}
      </span>
      <Icon name="arrowRight" className={`size-4 transition-transform duration-500 ${active ? "translate-x-0 text-gold-300" : "-translate-x-1 opacity-40 group-hover:translate-x-0"}`} />
    </button>
  );
}

/** Destinations arrive already localized (name, tagline, description, lists) from the server page. */
export function DestinationExplorer({ destinations }: { destinations: Destination[] }) {
  const locale = useLocale();
  const t = useUi().explorer;
  const href = useLp();
  const sorted = [...destinations].sort((a, b) => Number(b.primary) - Number(a.primary) || a.order - b.order);
  const [idx, setIdx] = useState(0);
  const d = sorted[idx];
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);

  if (!d) return null;

  const onKey = (e: React.KeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    const next = (idx + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1) + sorted.length) % sorted.length;
    setIdx(next);
    listRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
      <div ref={listRef} role="tablist" aria-label={t.tablist} aria-orientation="vertical" className="flex flex-col gap-3" onKeyDown={onKey}>
        {sorted.map((dest, i) => (
          <DestinationCard key={dest.id} d={dest} active={i === idx} onSelect={() => setIdx(i)} primaryLabel={t.primary} />
        ))}
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-live="polite" className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-navy-950 text-ivory">
        {d.heroImage ? (
          <Image key={d.heroImage} src={d.heroImage} alt={t.imageAlt(d.name)} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover opacity-50" />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_70%_at_70%_10%,rgba(194,154,82,.22),transparent_65%)]" />
        )}
        <CitySkyline key={d.flag} code={d.flag} className="animate-fade-up absolute -bottom-1 right-0 w-[85%] text-gold-300/30" />
        <div key={d.id} className="animate-fade-up relative flex h-full flex-col p-8 md:p-12">
          <div className="flex items-center gap-3">
            <Flag code={d.flag} className="h-6 w-9" />
            <span className="eyebrow text-gold-300">{d.primary ? t.primary : t.selected}</span>
          </div>
          <h3 className="mt-6 text-[clamp(2.6rem,6vw,4.8rem)] leading-none">{d.name}</h3>
          <p className="mt-3 font-display text-2xl italic text-gold-300">{d.tagline}</p>
          <p className="mt-6 max-w-2xl leading-relaxed text-ivory/80">{d.description}</p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="eyebrow text-navy-300">{t.benefits}</h4>
              <ul className="mt-4 space-y-3">
                {d.benefits.slice(0, 4).map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-ivory/85">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-gold-400" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="eyebrow text-navy-300">{t.cities}</h4>
              <p className="mt-4 text-sm leading-relaxed text-ivory/85">{d.cities.map((c) => term(c, locale)).join(" · ")}</p>
              {d.lifestyle.length > 0 && (
                <>
                  <h4 className="eyebrow mt-6 text-navy-300">{t.lifestyle}</h4>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/85">{d.lifestyle.join(". ")}.</p>
                </>
              )}
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3 pb-20 md:pb-28">
            <Link href={href(d.primary ? "/study-in-germany" : `/destinations/${d.slug}`)} className="btn btn-gold">
              {t.explore(d.name)} <Icon name="arrowRight" className="size-4" />
            </Link>
            <Link href={href(`/contact?destination=${encodeURIComponent(d.country)}#consultation`)} className="btn btn-ghost-light">
              {t.ask(d.name)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
