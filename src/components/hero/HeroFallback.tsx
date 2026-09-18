"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { destinationMarkers, places, project, sourceMarkets, type GeoCountry } from "./geo";

const fill = { primary: "#d8b674", destination: "#8c7650", source: "#1d3a64", other: "#12223d" };

const pt = (lon: number, lat: number) => {
  const [x, y] = project(lon, lat);
  return [x * 60, -y * 60] as const;
};

/** Keep every n-th vertex of background countries — invisible at phone size, ~3× fewer path points to rasterise. */
function simplify(geo: GeoCountry[], step: number) {
  if (step <= 1) return geo;
  return geo.map((c) =>
    c.role === "other" ? { ...c, rings: c.rings.map((r) => (r.length > 12 ? r.filter((_, i) => i % step === 0) : r)) } : c,
  );
}

/**
 * Germany route map used on phones/tablets and whenever WebGL is unavailable.
 *
 * Performance model: the country paths are drawn once into a static SVG that is
 * promoted to its own compositor layer. All motion (slow camera drift, Berlin
 * pulse, route shimmer) is CSS transform/opacity on separate light layers, so
 * the thousands of map paths are never re-rasterised while the page scrolls.
 * Animations pause as soon as the hero leaves the viewport.
 */
export function HeroFallback({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const zoom = useRef<HTMLDivElement>(null);
  const fx = useRef<SVGSVGElement>(null);
  const [reduced, setReduced] = useState(false);
  const [geo, setGeo] = useState<GeoCountry[] | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let alive = true;
    import("@/data/geo-region.json").then((m) => alive && setGeo(m.default as GeoCountry[]));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // SMIL flights pause with the rest of the hero when it is off-screen.
  useEffect(() => {
    const svg = fx.current;
    if (!svg || typeof svg.pauseAnimations !== "function") return;
    if (visible && !reduced) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [visible, reduced, geo]);

  // Scroll-linked depth on phones: as the hero scrolls away the map pushes in and sinks
  // slower than the page (parallax). One passive listener, one rAF write of a
  // compositor-only transform — nothing is laid out or painted per frame.
  useEffect(() => {
    const el = zoom.current;
    if (!compact || reduced || !visible || !el) return;
    let raf = 0;
    const write = () => {
      raf = 0;
      const h = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      el.style.transform = `translate3d(0, ${(p * h * 0.38).toFixed(1)}px, 0) scale(${(1 + p * 0.32).toFixed(4)})`;
      el.style.opacity = (1 - p * 0.55).toFixed(3);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [compact, reduced, visible]);

  const shapes = useMemo(() => (geo ? simplify(geo, compact ? 3 : 1) : null), [geo, compact]);
  const [bx, by] = pt(places.berlin.lon, places.berlin.lat);

  // Portrait phones need the whole route (Germany ← South Asia) visible, so `meet`;
  // landscape/desktop fills the screen with `slice`.
  const viewBox = compact ? "-470 -300 1100 520" : "-480 -330 1100 580";
  const aspect = compact ? "xMidYMid meet" : "xMidYMid slice";
  const svgClass = compact ? "hero-map-svg absolute inset-x-0 top-[7svh] h-[46svh] w-full" : "hero-map-svg absolute inset-0 h-full w-full";

  const routes = sourceMarkets.map((s) => {
    const [sx, sy] = pt(places[s.key].lon, places[s.key].lat);
    return { key: s.key, sx, sy, d: `M${sx},${sy} Q${(sx + bx) / 2},${(sy + by) / 2 - 60} ${bx},${by}` };
  });

  return (
    <div ref={root} className="hero-map absolute inset-0 overflow-hidden bg-navy-950" data-paused={visible ? undefined : ""} aria-hidden>
      <div ref={zoom} className="hero-map-zoom absolute inset-0">
      {compact && <MobileBackdrop />}
      <div className="hero-map-drift absolute inset-0">
        {/* Layer 1 — static geography (rasterised once) */}
        <svg viewBox={viewBox} preserveAspectRatio={aspect} className={svgClass}>
          <defs>
            <radialGradient id="fb-glow">
              <stop offset="0" stopColor="#d8b674" stopOpacity=".35" />
              <stop offset="1" stopColor="#d8b674" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={bx} cy={by} r="120" fill="url(#fb-glow)" />
          {shapes?.map((c) =>
            c.rings.map((r, i) => (
              <path
                key={`${c.id}-${i}`}
                d={`M${r.map(([lon, lat]) => pt(lon, lat).map((v) => v.toFixed(1)).join(",")).join("L")}Z`}
                fill={fill[c.role]}
                stroke={c.role === "primary" ? "#f3e2b8" : "#5d7aa6"}
                strokeOpacity={c.role === "other" ? 0.25 : 0.6}
                strokeWidth={c.role === "primary" ? 1.2 : 0.5}
                className={c.role === "primary" ? "hero-map-germany" : undefined}
              />
            )),
          )}
        </svg>

        {/* Layer 2 — routes + markers (few nodes; the only part that animates) */}
        <svg ref={fx} viewBox={viewBox} preserveAspectRatio={aspect} className={`${svgClass} hero-map-fx`}>
          {routes.map((r, i) => (
            <g key={r.key}>
              <path d={r.d} fill="none" stroke="#9fb8dc" strokeOpacity=".35" strokeWidth="1.2" strokeDasharray="6 5" />
              <path
                d={r.d}
                fill="none"
                stroke="#f3e2b8"
                strokeWidth="1.8"
                strokeLinecap="round"
                pathLength={1}
                className="hero-route"
                style={{ animationDelay: `${0.4 + i * 0.25}s` }}
              />
              <circle cx={r.sx} cy={r.sy} r="3.5" fill="#cfe0ff" />
            </g>
          ))}
          {destinationMarkers.map((d) => {
            const [x, y] = pt(places[d.key].lon, places[d.key].lat);
            return <circle key={d.key} cx={x} cy={y} r={d.primary ? 6 : 3.5} fill="#f3e2b8" stroke="#050d1c" strokeWidth="1.5" />;
          })}
          <g transform={`translate(${bx} ${by})`}>
            <circle r="10" fill="none" stroke="#f3e2b8" strokeWidth="1.2" className="hero-pulse" />
            <circle r="10" fill="none" stroke="#f3e2b8" strokeWidth="1.2" className="hero-pulse" style={{ animationDelay: "1.4s" }} />
          </g>
          {/* Flights: one aircraft per route, flying source → Berlin on a loop, nose following the arc */}
          {!reduced &&
            routes.map((r, i) => {
              const dur = 5.6 + (i % 3) * 0.9;
              const begin = `${2.6 + i * 1.1}s`;
              return (
                <g key={`plane-${r.key}`} opacity="0">
                  <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite" rotate="auto" path={r.d} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines=".45 0 .35 1" />
                  <animate attributeName="opacity" dur={`${dur}s`} begin={begin} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;.12;.82;1" />
                  <g transform={`scale(${compact ? 2.4 : 1.2})`}>
                  <circle r="9" fill="url(#plane-glow)" />
                  <path d="M7 0 L-3 -1.6 L-6 -6.5 L-8 -6.5 L-6.2 -1.4 L-9.5 -1.1 L-11 -3.2 L-12.2 -3.2 L-11.2 0 L-12.2 3.2 L-11 3.2 L-9.5 1.1 L-6.2 1.4 L-8 6.5 L-6 6.5 L-3 1.6 Z" fill="#fff4da" />
                  </g>
                </g>
              );
            })}
          <defs>
            <radialGradient id="plane-glow">
              <stop offset="0" stopColor="#ffd98f" stopOpacity=".75" />
              <stop offset="1" stopColor="#ffd98f" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy-950/70 to-transparent md:hidden" />
    </div>
  );
}

const STARS = (() => {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 46 }, () => ({ x: rnd() * 100, y: rnd() * 62, r: rnd() * 0.9 + 0.25, o: rnd() * 0.5 + 0.2 }));
})();

/** Static cinematic layers behind the phone map: starfield, gold horizon glow, earth-limb arc. */
function MobileBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(90%_55%_at_45%_30%,#12264a_0%,#07142b_55%,#050d1c_100%)]" />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.18} fill="#f3e2b8" opacity={s.o} />
        ))}
      </svg>
      <div className="absolute left-1/2 top-[30svh] h-[46svh] w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(216,182,116,.28),rgba(216,182,116,.06)_60%,transparent)]" />
      <div className="absolute left-1/2 top-[52svh] h-[80vw] w-[190vw] -translate-x-1/2 rounded-[50%] border-t border-gold-300/35 shadow-[0_-18px_60px_-20px_rgba(231,207,155,.45)]" />
    </div>
  );
}
