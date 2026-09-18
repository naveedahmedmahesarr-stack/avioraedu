import { useId } from "react";

/**
 * AVIORA EDU brand mark. Same concept as before — an "A" inside a ring whose crossbar
 * is a flight path ending in a guiding star — refined into a classical high-contrast
 * letterform: thin left stroke, heavy right stroke, bracketed serif feet, double hairline ring.
 * Every usage goes through this file; the 3D hero mark lives in components/hero/Logo3D.tsx.
 */
export function Monogram({ className = "size-9", title }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} fill="none">
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`${id}-g`} x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ecd8a8" />
          <stop offset="0.55" stopColor="#cfa962" />
          <stop offset="1" stopColor="#b08a45" />
        </linearGradient>
      </defs>
      {/* double hairline ring */}
      <circle cx="24" cy="24" r="22.6" stroke={`url(#${id}-g)`} strokeWidth="1" />
      <circle cx="24" cy="24" r="20.4" stroke={`url(#${id}-g)`} strokeWidth="0.45" opacity="0.55" />
      {/* high-contrast A: hairline left stroke, heavy right stroke, flat apex */}
      <path d="M13.6 34.6 23.2 11.6h1.9L15 34.6z" fill={`url(#${id}-g)`} />
      <path d="M23.2 11.6h2.4l9.6 23h-4.1z" fill={`url(#${id}-g)`} />
      {/* serif feet */}
      <path d="M11.4 34.6h6.1M29 34.6h8.2" stroke={`url(#${id}-g)`} strokeWidth="0.9" strokeLinecap="round" />
      {/* crossbar as an ascending flight path */}
      <path d="M16.8 27.4c5.4-2.3 11.6-2.9 18.6-1.6" stroke={`url(#${id}-g)`} strokeWidth="1.05" strokeLinecap="round" />
      {/* four-point guiding star */}
      <path d="M37.9 25.6 38.5 24.3 39.1 25.6 40.4 26.2 39.1 26.8 38.5 28.1 37.9 26.8 36.6 26.2z" fill="#f1e2bb" />
    </svg>
  );
}

export function Logo({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const light = tone === "light";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Monogram className="size-10 shrink-0" />
      <span className="flex flex-col items-center leading-none">
        <span
          className={`font-display text-[1.5rem] font-semibold tracking-[0.2em] [font-feature-settings:'lnum'] ${light ? "text-ivory" : "text-navy-900"}`}
          style={{ marginRight: "-0.2em" }}
        >
          AVIORA
        </span>
        <span className="mt-1.5 flex w-full items-center gap-2" aria-hidden>
          <span className={`h-px flex-1 ${light ? "bg-gold-300/50" : "bg-gold-600/50"}`} />
          <span className={`font-sans text-[0.55rem] font-semibold tracking-[0.42em] ${light ? "text-gold-300" : "text-gold-600"}`} style={{ marginRight: "-0.42em" }}>
            EDU
          </span>
          <span className={`h-px flex-1 ${light ? "bg-gold-300/50" : "bg-gold-600/50"}`} />
        </span>
        <span className="sr-only">EDU</span>
      </span>
    </span>
  );
}
