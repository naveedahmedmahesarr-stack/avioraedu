"use client";
 

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CitySkyline } from "@/components/brand/CitySkyline";

const BerlinScene = dynamic(() => import("./BerlinScene"), { ssr: false });

let webgl: boolean | null = null;
const canRender = () => {
  if (webgl === null) {
    try {
      const c = document.createElement("canvas");
      webgl = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
};
const noop = () => () => {};

/**
 * Visual for "The Germany Experience": a live 3D Berlin (Brandenburger Tor, Reichstag,
 * Fernsehturm in one city). Loads only when near the viewport; the line-art skyline stays
 * as the poster and as the fallback when WebGL is unavailable.
 */
export function BerlinShowcase() {
  const box = useRef<HTMLDivElement>(null);
  const supported = useSyncExternalStore(noop, canRender, () => false);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="relative mx-auto aspect-[4/3] w-full max-w-5xl sm:aspect-[64/30]">
      <CitySkyline
        code="DE"
        className={`absolute inset-x-0 bottom-0 w-full text-gold-300/80 transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {supported && near && (
        <div className={`absolute inset-0 overflow-hidden rounded-t-[1.25rem] transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <BerlinScene active={inView} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
