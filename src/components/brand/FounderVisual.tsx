import Image from "next/image";
import type { TeamMember } from "@/lib/content/schemas";
import type { Locale } from "@/i18n/locales";
import { FounderCoin } from "./FounderCoin";

/**
 * Premium personal logo for the founder: a circular 3D coin with the full name (FounderCoin),
 * presented in the same navy/gold frame and dimensions as before. No photo, no invented details.
 */
export function FounderWordmark({ name, text, locale, size = "lg" }: { name: string; text?: string; locale: Locale; size?: "lg" | "md" | "sm" }) {
  const label = locale === "de" ? "Gründer · AVIORA EDU" : "Founder · AVIORA EDU";
  const display = text || name;

  if (size === "sm") {
    return (
      <div role="img" aria-label={display} className="relative isolate overflow-hidden rounded-2xl border border-gold-300/30 bg-navy-950/95 px-5 py-4 text-center shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)] backdrop-blur">
        <p className="font-display text-[1.35rem] uppercase leading-none tracking-[0.2em]">
          <span className="gold-text">{display}</span>
        </p>
        <p className="eyebrow mt-2 !text-[0.52rem] text-ivory/55">{label}</p>
      </div>
    );
  }

  const lg = size === "lg";
  return (
    <div
      className={`founder-mark relative isolate flex aspect-[4/5] w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-navy-950 text-center shadow-[0_50px_80px_-40px_rgba(5,13,28,.8)] ${lg ? "max-w-[26rem] px-6" : "max-w-[19rem] px-5"}`}
    >
      <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_55%_at_28%_12%,rgba(231,207,155,.22),transparent_62%),radial-gradient(70%_50%_at_85%_100%,rgba(26,51,87,.95),transparent_70%)]" />
      <span aria-hidden className="absolute inset-3 rounded-[1.6rem] border border-gold-300/25" />
      <span aria-hidden className="absolute inset-[1.15rem] rounded-[1.35rem] border border-gold-300/10" />
      {["left-6 top-6 border-l border-t", "right-6 top-6 border-r border-t", "bottom-6 left-6 border-b border-l", "bottom-6 right-6 border-b border-r"].map((c) => (
        <span key={c} aria-hidden className={`absolute size-4 border-gold-300/60 ${c}`} />
      ))}
      <FounderCoin name={display} label={label} className={lg ? "max-w-[82%]" : "max-w-[80%]"} />
      <p className={`eyebrow text-ivory/55 ${lg ? "mt-10 !text-[0.6rem]" : "mt-8 !text-[0.54rem]"}`}>{label}</p>
    </div>
  );
}

/**
 * Founder visual controlled from Admin → Team:
 * - displayMode "logo": circular 3D logo (or uploaded logo image)
 * - "photo": photo only — falls back to the logo when no photo exists
 * - "logo-photo": photo with the name badge overlapping it — also falls back to the logo without a photo
 */
export function FounderVisual({ founder, locale, size = "lg" }: { founder: TeamMember; locale: Locale; size?: "lg" | "md" }) {
  const lg = size === "lg";
  const alt = locale === "de" ? `Foto von ${founder.name}` : `Photo of ${founder.name}`;
  const mark = founder.logoImage ? (
    <div className={`relative isolate aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-navy-950 shadow-[0_50px_80px_-40px_rgba(5,13,28,.8)] ${lg ? "max-w-[26rem]" : "max-w-[19rem]"}`}>
      <span aria-hidden className="absolute inset-3 rounded-[1.6rem] border border-gold-300/25" />
      <Image src={founder.logoImage} alt={founder.logoText || founder.name} fill sizes={lg ? "26rem" : "19rem"} className="object-contain p-10" />
    </div>
  ) : (
    <FounderWordmark name={founder.name} text={founder.logoText} locale={locale} size={size} />
  );

  const photo = founder.photo ? (
    <figure className={`relative isolate aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-navy-900 shadow-[0_50px_80px_-40px_rgba(5,13,28,.8)] ${lg ? "max-w-[26rem]" : "max-w-[19rem]"}`}>
      <Image src={founder.photo} alt={alt} fill sizes={lg ? "(min-width:1024px) 26rem, 85vw" : "19rem"} className="object-cover" />
      <span aria-hidden className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-gold-300/30" />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/60 to-transparent" />
    </figure>
  ) : null;

  const mode = photo ? founder.displayMode : "logo";
  if (mode === "photo") return <div data-founder-visual="photo">{photo}</div>;
  if (mode === "logo-photo")
    return (
      <div data-founder-visual="logo-photo" className={`relative w-full pb-12 ${lg ? "max-w-[26rem]" : "max-w-[19rem]"}`}>
        {photo}
        <div className="absolute -right-3 bottom-0 w-[72%] sm:-right-6">
          {founder.logoImage ? mark : <FounderWordmark name={founder.name} text={founder.logoText} locale={locale} size="sm" />}
        </div>
      </div>
    );
  return <div data-founder-visual="logo">{mark}</div>;
}
