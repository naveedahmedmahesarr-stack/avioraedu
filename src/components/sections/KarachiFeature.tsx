import Link from "next/link";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { CITIES, project, routePath } from "@/lib/globe";
import { Icon } from "@/components/ui/Icon";
import { InteractiveGlobe } from "./InteractiveGlobe";

/**
 * Signature homepage feature: "Karachi, Pakistan — Opening soon".
 * The globe is interactive 3D (see InteractiveGlobe); the server-rendered static globe below is
 * the initial paint and the fallback without JavaScript/canvas.
 * Honest by design: no address, date, team or office imagery.
 */
export async function KarachiFeature() {
  const { locale, t } = await getUi();
  const k = t.karachi;
  const berlin = project(CITIES.berlin.lon, CITIES.berlin.lat);
  const karachi = project(CITIES.karachi.lon, CITIES.karachi.lat);
  const route = routePath(CITIES.berlin, CITIES.karachi, 0.22);
  const [city, country] = k.city.split(",").map((s) => s.trim());
  const hint = locale === "de" ? "Ziehen oder Pfeiltasten zum Drehen" : "Drag or use arrow keys to rotate";

  return (
    <section aria-labelledby="karachi-title" className="relative isolate overflow-hidden bg-navy-950 py-24 text-ivory md:py-36">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_78%_50%,rgba(194,154,82,.16),transparent_70%),radial-gradient(40%_50%_at_10%_10%,rgba(26,51,87,.7),transparent_70%)]" />
      <div aria-hidden className="starfield absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden className="hairline absolute inset-x-0 top-0" />

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
        <div className="relative z-10">
          <p className="eyebrow flex items-center gap-3 text-gold-300">
            <span className="h-px w-10 bg-gold-300/60" aria-hidden /> {k.eyebrow}
          </p>
          <h2 id="karachi-title" className="mt-7">
            <span className="block font-display text-[clamp(3.6rem,10vw,8.4rem)] uppercase leading-[0.85] tracking-[0.02em]">
              <span className="gold-text depth-text">{city}</span>
            </span>
            <span className="mt-4 block text-[clamp(0.95rem,1.8vw,1.35rem)] font-semibold uppercase tracking-[0.5em] text-ivory/75">{country}</span>
          </h2>
          <p className="mt-9 inline-flex items-center gap-3 rounded-full border border-gold-300/45 bg-gradient-to-b from-ivory/[.07] to-ivory/[.02] px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.32em] text-gold-300 shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_18px_40px_-20px_rgba(194,154,82,.5)] backdrop-blur">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-300/70" />
              <span className="relative inline-flex size-2 rounded-full bg-gold-300" />
            </span>
            {k.soon}
          </p>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-ivory/80">{k.body}</p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-navy-300">{k.note}</p>
          <Link href={lp(locale, "/contact?destination=Germany#consultation")} className="btn btn-ghost-light mt-9">
            {k.cta} <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[600px] pb-10 [perspective:1800px]">
          <div className="globe-stage relative aspect-square [transform-style:preserve-3d]">
            <div aria-hidden className="pointer-events-none absolute inset-[4%] rounded-full bg-[radial-gradient(circle,rgba(194,154,82,.28),transparent_68%)] blur-2xl" />
            <div aria-hidden className="orbit pointer-events-none absolute inset-[-2%] rounded-full border border-gold-300/15" />
            <div aria-hidden className="orbit orbit-slow pointer-events-none absolute inset-[8%] rounded-full border border-dashed border-ivory/10" />
            <InteractiveGlobe ariaLabel={k.globeAria} hint={hint} berlinLabel={k.berlin.toUpperCase()} karachiLabel={k.karachi.toUpperCase()}>
              <svg viewBox="-260 -260 520 520" role="img" aria-label={k.globeAria} className="relative h-full w-full drop-shadow-[0_40px_60px_rgba(0,0,0,.55)]">
                <defs>
                  <linearGradient id="kf-route" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#9fb8dc" />
                    <stop offset=".6" stopColor="#e7cf9b" />
                    <stop offset="1" stopColor="#f3e2b8" />
                  </linearGradient>
                  <filter id="kf-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                </defs>
                <image href="/karachi-globe.svg" x="-260" y="-260" width="520" height="520" />
                <path d={route} fill="none" stroke="#e7cf9b" strokeOpacity=".35" strokeWidth="5" filter="url(#kf-glow)" />
                <path d={route} fill="none" stroke="url(#kf-route)" strokeWidth="1.6" strokeLinecap="round" pathLength={1} className="route-draw" />
                <circle cx={berlin.x} cy={berlin.y} r="4" fill="#cfe0ff" />
                <text x={berlin.x - 12} y={berlin.y - 12} textAnchor="end" className="fill-ivory text-[13px] font-semibold tracking-[0.18em]">
                  {k.berlin.toUpperCase()}
                </text>
                <circle cx={karachi.x} cy={karachi.y} r="6" fill="#f3e2b8" />
                <text x={karachi.x + 16} y={karachi.y + 26} className="fill-gold-300 text-[15px] font-semibold tracking-[0.18em]">
                  {k.karachi.toUpperCase()}
                </text>
              </svg>
            </InteractiveGlobe>
            <div
              aria-hidden
              className="glass-card pointer-events-none absolute bottom-[6%] right-[-2%] hidden rounded-2xl border border-gold-300/25 bg-navy-900/55 px-5 py-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)] backdrop-blur-md sm:block [transform:translateZ(80px)]"
            >
              <p className="eyebrow !text-[0.58rem] text-navy-300">{k.route}</p>
              <p className="mt-1 font-display text-2xl leading-none text-ivory">
                {k.karachi} <span className="text-gold-300">·</span> <span className="text-gold-300">{k.soon}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
