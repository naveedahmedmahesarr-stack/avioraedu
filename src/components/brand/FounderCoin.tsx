"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Circular 3D personal logo for the founder.
 * - A stack of thin gold discs forms the extruded rim; the face carries the full name in the
 *   center and on a circular ring, set in the site's display serif with the existing gold/navy palette.
 * - A slow, gentle sway (CSS) gives continuous depth; pointer/touch movement tilts it and moves the
 *   light reflection. prefers-reduced-motion: static, no sway, no tilt.
 * - Transform-only animation (GPU friendly); pointer handling is throttled to animation frames.
 */
export function FounderCoin({ name, label, className = "" }: { name: string; label: string; className?: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const words = name.trim().split(/\s+/);
  const first = (words[0] ?? "").toUpperCase();
  const rest = words.slice(1).join(" ").toUpperCase();
  const ring = `${name.toUpperCase()} · ${label.toUpperCase()} · `;

  useEffect(() => {
    const el = sceneRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--tilt-x", `${ty.toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${tx.toFixed(2)}deg`);
      el.style.setProperty("--sheen", `${(50 + tx * 2).toFixed(1)}%`);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      tx = nx * 18;
      ty = -ny * 14;
      el.dataset.interacting = "true";
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      delete el.dataset.interacting;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);
    el.addEventListener("pointerup", (e) => e.pointerType !== "mouse" && onLeave());
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
    };
  }, []);

  const layers = 14;
  return (
    <div ref={sceneRef} role="img" aria-label={name} data-founder-coin className={`founder-coin-scene relative aspect-square w-full touch-pan-y select-none ${className}`}>
      <div aria-hidden className="founder-coin-tilt absolute inset-0">
        <div className="founder-coin relative h-full w-full">
          {/* Extruded rim */}
          {Array.from({ length: layers }, (_, i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                transform: `translateZ(${-(i + 1) * 1.1}px)`,
                background: i === layers - 1 ? "#3d2e14" : `linear-gradient(135deg, #e7cf9b 0%, #a8813c ${40 + i}%, #5b4420 100%)`,
              }}
            />
          ))}
          {/* Face */}
          <div className="absolute inset-0 overflow-hidden rounded-full [transform:translateZ(0.5px)]">
            <svg viewBox="0 0 240 240" className="h-full w-full">
              <defs>
                <radialGradient id={`${uid}-face`} cx="36%" cy="30%" r="80%">
                  <stop offset="0" stopColor="#1a3357" />
                  <stop offset=".58" stopColor="#0a1830" />
                  <stop offset="1" stopColor="#050d1c" />
                </radialGradient>
                <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f3e2b8" />
                  <stop offset=".45" stopColor="#d8b674" />
                  <stop offset=".75" stopColor="#a8813c" />
                  <stop offset="1" stopColor="#ecd6a2" />
                </linearGradient>
                <path id={`${uid}-ring`} d="M120 120 m-93 0 a93 93 0 1 1 186 0 a93 93 0 1 1 -186 0" />
              </defs>
              <circle cx="120" cy="120" r="119" fill={`url(#${uid}-gold)`} />
              <circle cx="120" cy="120" r="113" fill={`url(#${uid}-face)`} />
              <circle cx="120" cy="120" r="109" fill="none" stroke={`url(#${uid}-gold)`} strokeWidth="0.9" />
              <circle cx="120" cy="120" r="78" fill="none" stroke={`url(#${uid}-gold)`} strokeWidth="0.9" />
              <circle cx="120" cy="120" r="74.5" fill="none" stroke="#d8b674" strokeOpacity=".3" strokeWidth=".6" />
              <text className="font-sans" fill={`url(#${uid}-gold)`} fontSize="10.4" fontWeight="600" letterSpacing="3.1">
                <textPath href={`#${uid}-ring`} startOffset="0" textLength="566" lengthAdjust="spacing">
                  {ring}
                </textPath>
              </text>
              <text x="120" y="112" textAnchor="middle" className="font-display" fill={`url(#${uid}-gold)`} fontSize={first.length > 7 ? 24 : 28} fontWeight="500" letterSpacing="3.4">
                {first}
              </text>
              <g stroke="#d8b674" strokeOpacity=".75" strokeWidth=".8">
                <path d="M84 124h26M130 124h26" />
                <path d="M120 120.5l3.5 3.5-3.5 3.5-3.5-3.5z" fill="none" />
              </g>
              {rest && (
                <text x="120" y="150" textAnchor="middle" className="font-display" fill={`url(#${uid}-gold)`} fontSize={rest.length > 7 ? 24 : 28} fontWeight="500" letterSpacing="4.2">
                  {rest}
                </text>
              )}
            </svg>
            {/* Moving light reflection */}
            <span className="founder-coin-sheen pointer-events-none absolute inset-0 rounded-full" />
          </div>
        </div>
      </div>
      <span aria-hidden className="founder-coin-shadow pointer-events-none absolute -bottom-[7%] left-[18%] right-[18%] h-[9%] rounded-[50%] bg-black/45 blur-xl" />
    </div>
  );
}
