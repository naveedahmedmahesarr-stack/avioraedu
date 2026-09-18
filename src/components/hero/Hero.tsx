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

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

type Mode = "pending" | "webgl" | "fallback";

let webglCache: boolean | null = null;
function renderMode(): Mode {
  // `?3d=off` forces the non-WebGL fallback (useful for QA and low-power demos).
  if (new URLSearchParams(window.location.search).get("3d") === "off") return "fallback";
  // The cinematic scene is deliberately desktop-only. On phones and other
  // coarse-pointer devices it was expensive to render, awkward to scroll and
  // the wide map was cropped before users could understand it.
  if (window.matchMedia("(max-width: 767px), (pointer: coarse)").matches) return "fallback";
  if (webglCache === null) {
    try {
      const c = document.createElement("canvas");
      webglCache = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglCache = false;
    }
  }
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return webglCache && !saveData ? "webgl" : "fallback";
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
  const [active, setActive] = useState(true);
  const [chapter, setChapter] = useState(0);

  // Pause rendering when the hero is off-screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Story progress: automatic intro, then scroll-driven chapters.
  // Desktop only: on phones/tablets the hero is a single static-height screen,
  // so no per-frame layout reads (getBoundingClientRect) run while touch-scrolling.
  // The loop also stops entirely once the hero is off-screen.
  useEffect(() => {
    if (compact) {
      progress.current = 0;
      overlay.current?.style.setProperty("--p", "0");
      return;
    }
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const start = last - (progress.current / INTRO_END) * 9000;
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
  }, [reduced, compact, active]);

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
        className={`hero-shell relative bg-navy-950 text-ivory ${reduced ? "h-[180svh]" : "h-[520svh]"}`}
      >
        <div className="hero-stage sticky top-0 h-svh overflow-hidden">
          {/* Visual layer */}
          <div className="absolute inset-0">
            {mode === "webgl" ? (
              <Hero3D progress={progress} reducedMotion={reduced} compact={compact} active={active} berlinFocus={chapter >= 3} onReady={() => setReady(true)} />
            ) : mode === "fallback" ? (
              <HeroFallback compact={compact} />
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
              className="container-x absolute inset-x-0 bottom-[8svh] md:bottom-[14svh]"
              style={{ opacity: "clamp(0, calc((0.46 - var(--p)) * 10), 1)", transform: "translateY(calc(max(0, var(--p) - 0.36) * -300px))" }}
            >
              <p className="eyebrow animate-fade-up flex items-center gap-3 !text-[0.6rem] !tracking-[0.3em] text-gold-300 md:!text-[0.72rem] md:!tracking-[0.28em]" style={{ animationDelay: "300ms" }}>
                <span className="h-px w-8 bg-gold-300/60 md:w-10" /> <span className="md:hidden">Germany &amp; Europe</span><span className="hidden md:inline">Germany · Italy · Poland · Portugal · Austria</span>
              </p>
              <h1
                id="hero-title"
                className="animate-fade-up mt-3 max-w-4xl text-[clamp(1.85rem,8.4vw,2.6rem)] uppercase leading-[0.98] tracking-[0.01em] md:mt-5 md:text-[clamp(2.8rem,8vw,6.6rem)] md:leading-[0.92] md:tracking-[-0.01em]"
                style={{ animationDelay: "450ms" }}
              >
                {headline.replace(/\.$/, "")}
                <span className="gold-text">.</span>
              </h1>
              <p className="animate-fade-up mt-3 font-display text-lg italic text-gold-300 md:mt-5 md:text-3xl" style={{ animationDelay: "600ms" }}>
                {subheadline}
              </p>
              <p className="animate-fade-up mt-2 max-w-xl text-[0.82rem] leading-relaxed text-ivory/70 md:mt-4 md:text-lg md:text-ivory/80" style={{ animationDelay: "700ms" }}>
                {message}
              </p>
              <div className="animate-fade-up mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:gap-3 [&>a]:max-sm:min-h-11 [&>a]:max-sm:px-3 [&>a]:max-sm:text-[0.78rem]" style={{ animationDelay: "850ms" }}>
                <Link href="/destinations" className="btn btn-gold">
                  <span className="sm:hidden">Explore</span><span className="hidden sm:inline">Explore Study Options</span> <Icon name="arrowRight" className="size-4" />
                </Link>
                <Link href="/contact#consultation" className="btn btn-ghost-light">
                  <span className="sm:hidden">Consultation</span><span className="hidden sm:inline">Book a Consultation</span>
                </Link>
              </div>
            </div>

            {/* Chapter: source markets vs destinations */}
            <div
              className="hero-desktop-only container-x absolute inset-x-0 bottom-[7svh] md:bottom-[10svh]"
              style={{ opacity: "clamp(0, min((var(--p) - 0.4) * 14, (0.6 - var(--p)) * 14), 1)" }}
              aria-hidden={chapter !== 1 && chapter !== 2}
            >
              <div className="glass-dark grid max-w-3xl grid-cols-2 gap-3 rounded-3xl p-4 sm:gap-6 sm:p-6 md:p-8">
                <div>
                  <h2 className="eyebrow text-navy-300">Where students come from</h2>
                  <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                    {sourceMarkets.map((s) => (
                      <li key={s.key} className="flex items-center gap-2 text-[0.7rem] text-ivory/90 sm:gap-3 sm:text-sm">
                        <Flag code={s.flag} decorative /> {s.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-l border-gold-300/15 pl-3 sm:pl-6">
                  <h2 className="eyebrow text-gold-300">Where students study</h2>
                  <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                    {destinationMarkers.map((d) => (
                      <li key={d.key} className={`flex items-center gap-2 text-[0.7rem] sm:gap-3 sm:text-sm ${d.primary ? "font-semibold text-gold-300" : "text-ivory/90"}`}>
                        <Flag code={d.flag} decorative /> {d.label}
                        {d.primary && <span className="eyebrow ml-auto hidden !text-[0.6rem] text-gold-400 sm:inline">Primary</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div
              className="hero-desktop-only container-x absolute inset-x-0 bottom-[9svh] md:bottom-[12svh]"
              style={{ opacity: "clamp(0, min((var(--p) - 0.62) * 14, (0.78 - var(--p)) * 14), 1)" }}
            >
              <p className="eyebrow text-gold-300">Chapter · Berlin</p>
              <h2 className="mt-3 max-w-2xl text-[clamp(2.15rem,10vw,4.8rem)] leading-none md:mt-4 md:text-[clamp(2.4rem,6vw,4.8rem)]">
                A capital of <em className="gold-text not-italic">science</em>, culture and opportunity.
              </h2>
              <p className="mt-4 max-w-lg text-ivory/75">From the Fernsehturm to the Brandenburger Tor — the city where many international journeys begin.</p>
            </div>

            <div
              className="hero-desktop-only container-x absolute inset-x-0 bottom-[9svh] md:bottom-[12svh]"
              style={{ opacity: "clamp(0, min((var(--p) - 0.78) * 14, (0.9 - var(--p)) * 14), 1)" }}
            >
              <p className="eyebrow text-gold-300">Chapter · Campus</p>
              <h2 className="mt-3 max-w-2xl text-[clamp(2.15rem,10vw,4.8rem)] leading-none md:mt-4 md:text-[clamp(2.4rem,6vw,4.8rem)]">From the city skyline to your lecture hall.</h2>
              <p className="mt-4 max-w-lg text-ivory/75">Libraries, laboratories and a genuinely international student community.</p>
            </div>

            <div
              className="hero-desktop-only container-x absolute inset-x-0 bottom-[10svh] text-center md:bottom-[12svh]"
              style={{ opacity: "clamp(0, (var(--p) - 0.9) * 14, 1)" }}
            >
              <p className="font-display text-[clamp(2.6rem,7vw,5.5rem)] tracking-[0.2em]">
                AVIORA <span className="gold-text">EDU</span>
              </p>
              <p className="mt-3 text-ivory/75">Guidance from application to arrival.</p>
              <Link
                href="/contact#consultation"
                className="btn btn-gold mt-7"
                tabIndex={chapter === CHAPTERS.length - 1 ? 0 : -1}
              >
                Book a Consultation
              </Link>
            </div>

            {/* Progress rail */}
            <nav aria-label="Hero story chapters" className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:right-8 md:block">
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
                        {c.label}
                      </span>
                      <span className={`block rounded-full transition-all duration-500 ${chapter === i ? "h-6 w-1 bg-gold-400" : "size-1 bg-ivory/40"}`} />
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div
              aria-hidden
              className="hero-desktop-only absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/60"
              style={{ opacity: "clamp(0, calc((0.4 - var(--p)) * 10), 1)" }}
            >
              <span className="eyebrow !text-[0.58rem]">Scroll to begin the journey</span>
              <span className="h-10 w-px bg-gradient-to-b from-gold-300 to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
