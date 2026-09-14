"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CHAPTERS, INTRO_END, clamp01, damp } from "./anim";
import { LoadingScreen } from "./LoadingScreen";
import { HeroFallback } from "./HeroFallback";
import { Flag } from "@/components/ui/Flag";
import { Icon } from "@/components/ui/Icon";
import { destinationMarkers, sourceMarkets } from "./geo";
import { useLp, useUi } from "@/i18n/LocaleProvider";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

type Mode = "pending" | "webgl" | "fallback";

let webglCache: boolean | null = null;
function renderMode(): Mode {
  // `?3d=off` forces the non-WebGL fallback (useful for QA and low-power demos).
  if (new URLSearchParams(window.location.search).get("3d") === "off") return "fallback";
  if (webglCache === null) {
    try {
      const c = document.createElement("canvas");
      webglCache = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglCache = false;
    }
  }
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  const saveData = nav.connection?.saveData;
  // Low-power phones get the animated SVG hero: three.js would block the main thread for seconds there.
  const small = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  const lowPower = small && ((nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4);
  return webglCache && !saveData && !lowPower ? "webgl" : "fallback";
}

const noopSubscribe = () => () => {};

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function Hero({ headline, subheadline, message }: { headline: string; subheadline: string; message: string }) {
  const section = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const mode = useSyncExternalStore<Mode>(noopSubscribe, renderMode, () => "pending");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const compact = useMediaQuery("(max-width: 767px), (pointer: coarse)");
  const [ready, setReady] = useState(false);
  const [start3d, setStart3d] = useState(false);
  const [active, setActive] = useState(true);
  const [chapter, setChapter] = useState(0);
  const t = useUi().hero;
  const href = useLp();

  // Load the WebGL scene once the browser is idle, so the heading, text and buttons paint and respond first.
  // The branded loading screen still covers first visits.
  useEffect(() => {
    if (mode !== "webgl") return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setStart3d(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(() => setStart3d(true), 300);
    return () => clearTimeout(t);
  }, [mode]);

  // Pause rendering when the hero is off-screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Story progress: automatic intro, then scroll-driven chapters.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const start = last;
    let lastChapter = -1;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const el = section.current;
      let scrollP = 0;
      if (el) {
        const rect = el.getBoundingClientRect();
        const travel = el.offsetHeight - window.innerHeight;
        scrollP = travel > 0 ? clamp01(-rect.top / travel) : 0;
      }
      let target: number;
      if (reduced) {
        target = 0.5 + scrollP * 0.5; // no automatic camera motion
        progress.current = target;
      } else {
        const auto = Math.min(INTRO_END, ((now - start) / 9000) * INTRO_END);
        target = scrollP > 0.001 ? INTRO_END + scrollP * (1 - INTRO_END) : auto;
        target = Math.max(target, scrollP > 0.001 ? 0 : auto);
        progress.current = damp(progress.current, target, 3.2, dt);
      }
      const p = progress.current;
      overlay.current?.style.setProperty("--p", p.toFixed(4));
      let idx = 0;
      CHAPTERS.forEach((c, i) => {
        if (p >= c.start) idx = i;
      });
      if (idx !== lastChapter) {
        lastChapter = idx;
        setChapter(idx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const jumpTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const p = CHAPTERS[i].start;
    const scrollP = p <= INTRO_END ? 0 : (p + 0.02 - INTRO_END) / (1 - INTRO_END);
    window.scrollTo({ top: el.offsetTop + travel * scrollP, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <>
      {mode === "webgl" && <LoadingScreen ready={ready} />}
      <section
        ref={section}
        aria-labelledby="hero-title"
        className={`relative bg-navy-950 text-ivory ${reduced ? "h-[180svh]" : "h-[520svh]"}`}
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* Visual layer */}
          <div className="absolute inset-0">
            {mode === "webgl" ? (
              start3d ? (
                <Hero3D progress={progress} reducedMotion={reduced} compact={compact} active={active} berlinFocus={chapter >= 3} onReady={() => setReady(true)} />
              ) : null
            ) : mode === "fallback" ? (
              <HeroFallback />
            ) : null}
          </div>
          {/* Cinematic grading: vignette + lower scrim for text contrast */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_60%_40%,transparent_40%,rgba(5,13,28,.85)_100%)]"
          />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />

          {/* Story overlay — all chapters stay in the DOM for SEO and screen readers */}
          {/* Pointer events pass through to the 3D canvas (landmark clicks); links and buttons stay interactive. */}
          <div
            ref={overlay}
            className="pointer-events-none relative h-full [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
            style={{ "--p": 0 } as React.CSSProperties}
          >
            <div
              className="container-x absolute inset-x-0 bottom-[12svh] md:bottom-[14svh]"
              style={{ opacity: "clamp(0, calc((0.46 - var(--p)) * 10), 1)", transform: "translateY(calc(max(0, var(--p) - 0.36) * -300px))" }}
            >
              <p className="eyebrow animate-fade-up flex items-center gap-3 text-gold-300" style={{ animationDelay: "300ms" }}>
                <span className="h-px w-10 bg-gold-300/60" /> {t.eyebrow}
              </p>
              <h1
                id="hero-title"
                className="animate-fade-up mt-6 max-w-[15ch] text-[clamp(2.9rem,7.4vw,6.2rem)] leading-[0.95] tracking-[-0.02em]"
                style={{ animationDelay: "450ms" }}
              >
                {headline.replace(/\.$/, "")}
                <span className="gold-text">.</span>
              </h1>
              <div className="animate-fade-up mt-7 flex max-w-2xl gap-5" style={{ animationDelay: "650ms" }}>
                <span aria-hidden className="mt-2 hidden h-auto w-px shrink-0 bg-gradient-to-b from-gold-300/70 to-transparent sm:block" />
                <div>
                  <p className="font-display text-2xl italic text-gold-300 md:text-[1.7rem]">{subheadline}</p>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-ivory/80 md:text-lg">{message}</p>
                </div>
              </div>
              <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "850ms" }}>
                <Link href={href("/contact#consultation")} className="btn btn-gold">
                  {t.primary} <Icon name="arrowRight" className="size-4" />
                </Link>
                <Link href={href("/services")} className="btn btn-ghost-light">
                  {t.secondary}
                </Link>
              </div>
            </div>

            {/* Chapter: source markets vs destinations */}
            <div
              className="container-x absolute inset-x-0 bottom-[10svh]"
              style={{ opacity: "clamp(0, min((var(--p) - 0.4) * 14, (0.6 - var(--p)) * 14), 1)" }}
              aria-hidden={chapter !== 1 && chapter !== 2}
            >
              <div className="glass-dark grid max-w-3xl gap-6 rounded-3xl p-6 sm:grid-cols-2 md:p-8">
                <div>
                  <h2 className="eyebrow text-navy-300">{t.sourceTitle}</h2>
                  <ul className="mt-4 space-y-2.5">
                    {sourceMarkets.map((s) => (
                      <li key={s.key} className="flex items-center gap-3 text-sm text-ivory/90">
                        <Flag code={s.flag} decorative /> {t.markets[s.key] ?? s.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="sm:border-l sm:border-gold-300/15 sm:pl-6">
                  <h2 className="eyebrow text-gold-300">{t.destTitle}</h2>
                  <ul className="mt-4 space-y-2.5">
                    {destinationMarkers.map((d) => (
                      <li key={d.key} className={`flex items-center gap-3 text-sm ${d.primary ? "font-semibold text-gold-300" : "text-ivory/90"}`}>
                        <Flag code={d.flag} decorative /> {t.dests[d.key] ?? d.label}
                        {d.primary && <span className="eyebrow ml-auto !text-[0.6rem] text-gold-400">{t.primaryDest}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div
              className="container-x absolute inset-x-0 bottom-[12svh]"
              style={{ opacity: "clamp(0, min((var(--p) - 0.62) * 14, (0.78 - var(--p)) * 14), 1)" }}
            >
              <p className="eyebrow text-gold-300">{t.berlinEyebrow}</p>
              <h2 className="mt-4 max-w-2xl text-[clamp(2.4rem,6vw,4.8rem)] leading-none">
                {t.berlinTitle} <em className="gold-text not-italic">{t.berlinEm}</em>
                {t.berlinTitleEnd}
              </h2>
              <p className="mt-4 max-w-lg text-ivory/75">{t.berlinBody}</p>
            </div>

            <div
              className="container-x absolute inset-x-0 bottom-[12svh]"
              style={{ opacity: "clamp(0, min((var(--p) - 0.78) * 14, (0.9 - var(--p)) * 14), 1)" }}
            >
              <p className="eyebrow text-gold-300">{t.campusEyebrow}</p>
              <h2 className="mt-4 max-w-2xl text-[clamp(2.4rem,6vw,4.8rem)] leading-none">{t.campusTitle}</h2>
              <p className="mt-4 max-w-lg text-ivory/75">{t.campusBody}</p>
            </div>

            <div
              className="container-x absolute inset-x-0 bottom-[12svh] text-center"
              style={{ opacity: "clamp(0, (var(--p) - 0.9) * 14, 1)" }}
            >
              <p className="font-display text-[clamp(2.6rem,7vw,5.5rem)] tracking-[0.2em]">
                AVIORA <span className="gold-text">EDU</span>
              </p>
              <p className="mt-3 text-ivory/75">{t.brandBody}</p>
              <Link href={href("/contact#consultation")} className="btn btn-gold mt-7" tabIndex={chapter === CHAPTERS.length - 1 ? 0 : -1}>
                {t.primary}
              </Link>
            </div>

            {/* Progress rail */}
            <nav aria-label={t.chaptersAria} className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:right-8 md:block">
              <ol className="flex flex-col gap-4">
                {CHAPTERS.map((c, i) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      className="group flex items-center justify-end gap-3 py-1"
                      aria-current={chapter === i ? "step" : undefined}
                    >
                      <span
                        className={`eyebrow !text-[0.6rem] transition-opacity ${chapter === i ? "text-gold-300 opacity-100" : "text-ivory/60 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}
                      >
                        {t.chapters[c.id] ?? c.label}
                      </span>
                      <span className={`block rounded-full transition-all duration-500 ${chapter === i ? "h-6 w-1 bg-gold-400" : "size-1 bg-ivory/40"}`} />
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div
              aria-hidden
              className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/60"
              style={{ opacity: "clamp(0, calc((0.4 - var(--p)) * 10), 1)" }}
            >
              <span className="eyebrow !text-[0.58rem]">{t.scroll}</span>
              <span className="h-10 w-px bg-gradient-to-b from-gold-300 to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
