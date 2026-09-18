"use client";

import { useEffect, useState } from "react";
import { Monogram } from "@/components/brand/Logo";

/**
 * Short branded intro. Dismisses as soon as the 3D scene reports ready,
 * never later than `maxMs`, and only plays once per browser session.
 */
export function LoadingScreen({ ready, maxMs = 2400 }: { ready: boolean; maxMs?: number }) {
  // Only ever mounted client-side (after WebGL detection), so reading storage here is hydration-safe.
  const [phase, setPhase] = useState<"show" | "hide" | "gone">(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("aviora-intro") === "1";
      sessionStorage.setItem("aviora-intro", "1");
    } catch {}
    return seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "gone" : "show";
  });

  useEffect(() => {
    const t = setTimeout(() => setPhase((p) => (p === "show" ? "hide" : p)), maxMs);
    return () => clearTimeout(t);
  }, [maxMs]);

  useEffect(() => {
    if (!ready || phase !== "show") return;
    const t = setTimeout(() => setPhase("hide"), 900);
    return () => clearTimeout(t);
  }, [ready, phase]);

  useEffect(() => {
    if (phase !== "hide") return;
    const t = setTimeout(() => setPhase("gone"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;
  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center bg-navy-950 transition-opacity duration-[900ms] ${
        phase === "hide" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-fade-up">
        <Monogram className="size-20" />
      </div>
      <p className="animate-fade-up mt-6 font-display text-3xl tracking-[0.3em] text-ivory" style={{ animationDelay: "150ms" }}>
        AVIORA <span className="text-gold-300">EDU</span>
      </p>
      <svg viewBox="0 0 240 40" className="mt-8 w-60" fill="none">
        <path
          d="M4 34 C 70 2, 170 2, 236 20"
          stroke="#d8b674"
          strokeWidth="1.2"
          strokeDasharray="1"
          pathLength={1}
          style={{ animation: "route-draw 1.6s cubic-bezier(.22,1,.36,1) .2s both" }}
        />
        <circle cx="236" cy="20" r="2.5" fill="#f3e2b8" />
      </svg>
    </div>
  );
}
