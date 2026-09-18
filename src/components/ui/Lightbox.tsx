"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";

export type LightboxItem = { src: string; w: number; h: number; alt: string; caption?: string };

/** `const lb = useLightbox(items)` → call `lb.open(i)` and render `lb.node`. */
export function useLightbox(items: LightboxItem[]) {
  const [index, setIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => setIndex(i), []);
  const node =
    index === null ? null : <Lightbox items={items} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />;
  return { open, node };
}

const MAX = 4;
const CLOSE_MS = 240;

/**
 * Full-screen viewer: pinch / wheel / double-tap zoom, drag to pan, swipe or arrows to
 * navigate, Esc to close. Transforms are written straight to the <img> inside one rAF,
 * so zooming never re-renders React. Page scroll is locked while open.
 */
function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const item = items[index];
  const many = items.length > 1;
  const [closing, setClosing] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const view = useRef({ s: 1, x: 0, y: 0 });
  const raf = useRef(0);

  const apply = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const { s, x, y } = view.current;
      if (img.current) img.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
    });
  }, []);

  const clamp = useCallback(() => {
    const v = view.current;
    const el = img.current;
    if (!el) return;
    v.s = Math.min(MAX, Math.max(1, v.s));
    const mx = (el.offsetWidth * (v.s - 1)) / 2;
    const my = (el.offsetHeight * (v.s - 1)) / 2;
    v.x = Math.min(mx, Math.max(-mx, v.x));
    v.y = Math.min(my, Math.max(-my, v.y));
    setZoomed(v.s > 1.01);
  }, []);

  /** Zoom to `ns` keeping the stage point (px, py) — relative to stage centre — fixed. */
  const zoomAt = useCallback(
    (ns: number, px = 0, py = 0) => {
      const v = view.current;
      const k = Math.min(MAX, Math.max(1, ns)) / v.s;
      v.x = px - (px - v.x) * k;
      v.y = py - (py - v.y) * k;
      v.s *= k;
      clamp();
      apply();
    },
    [apply, clamp],
  );

  const reset = useCallback(() => {
    view.current = { s: 1, x: 0, y: 0 };
    setZoomed(false);
    apply();
  }, [apply]);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(onClose, CLOSE_MS);
  }, [onClose]);

  const go = useCallback(
    (d: number) => {
      if (!many) return;
      reset();
      setLoaded(false);
      onIndex((index + d + items.length) % items.length);
    },
    [index, items.length, many, onIndex, reset],
  );

  // Scroll lock + focus management
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const sbw = window.innerWidth - html.clientWidth;
    const prevOverflow = html.style.overflow;
    const prevPad = document.body.style.paddingRight;
    html.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    closeBtn.current?.focus();
    return () => {
      html.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      cancelAnimationFrame(raf.current);
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") zoomAt(view.current.s * 1.5);
      else if (e.key === "-") zoomAt(view.current.s / 1.5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, go, zoomAt]);

  // Gestures: wheel needs a non-passive listener to stop page zoom/scroll.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const rel = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect();
      return [cx - r.left - r.width / 2, cy - r.top - r.height / 2] as const;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const [px, py] = rel(e.clientX, e.clientY);
      zoomAt(view.current.s * Math.exp(-e.deltaY * 0.0022), px, py);
    };
    const pts = new Map<number, { x: number; y: number }>();
    let pinch0 = 0;
    let s0 = 1;
    let start: { x: number; y: number; t: number } | null = null;
    let lastTap = 0;

    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* synthetic / already-released pointer */
      }
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) start = { x: e.clientX, y: e.clientY, t: performance.now() };
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        pinch0 = Math.hypot(a.x - b.x, a.y - b.y);
        s0 = view.current.s;
      }
    };
    const move = (e: PointerEvent) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const [px, py] = rel((a.x + b.x) / 2, (a.y + b.y) / 2);
        zoomAt((s0 * Math.hypot(a.x - b.x, a.y - b.y)) / pinch0, px, py);
      } else if (view.current.s > 1) {
        view.current.x += dx;
        view.current.y += dy;
        clamp();
        apply();
      }
    };
    const up = (e: PointerEvent) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size > 0 || !start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const dt = performance.now() - start.t;
      start = null;
      if (view.current.s <= 1.01 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 600) {
        go(dx < 0 ? 1 : -1);
        return;
      }
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
        const now = performance.now();
        if (now - lastTap < 300) {
          lastTap = 0;
          const [px, py] = rel(e.clientX, e.clientY);
          if (view.current.s > 1.01) reset();
          else zoomAt(2.5, px, py);
        } else lastTap = now;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [apply, clamp, go, reset, zoomAt]);

  const btn =
    "size-11 items-center justify-center rounded-full border border-gold-300/30 bg-navy-950/80 text-ivory transition-colors hover:border-gold-300 hover:text-gold-300";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className={`lb fixed inset-0 z-[200] flex flex-col bg-[#03080f]/[.97] text-ivory ${closing ? "lb-leave" : "lb-enter"}`}
    >
      <div className="flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <p className="eyebrow min-w-0 truncate !text-[0.62rem] text-gold-300">
          {many && <span className="mr-3 text-ivory/50">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>}
          {item.caption}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" className={`${btn} hidden sm:flex`} onClick={() => zoomAt(view.current.s / 1.6)} aria-label="Zoom out" disabled={!zoomed}>
            <span className="text-xl leading-none">−</span>
          </button>
          <button type="button" className={`${btn} hidden sm:flex`} onClick={() => zoomAt(view.current.s * 1.6)} aria-label="Zoom in">
            <span className="text-xl leading-none">+</span>
          </button>
          <button ref={closeBtn} type="button" className={`${btn} flex`} onClick={close} aria-label="Close image viewer">
            <Icon name="close" className="size-5" />
          </button>
        </div>
      </div>

      <div ref={stage} className="lb-stage relative flex min-h-0 flex-1 touch-none select-none items-center justify-center overflow-hidden p-3 sm:p-8" style={{ cursor: zoomed ? "grab" : "zoom-in" }}>
        {!loaded && <span aria-hidden className="absolute size-8 animate-spin rounded-full border-2 border-gold-300/20 border-t-gold-300" />}
        {/* eslint-disable-next-line @next/next/no-img-element -- full-resolution original for inspection */}
        <img
          key={item.src}
          ref={img}
          src={item.src}
          alt={item.alt}
          width={item.w}
          height={item.h}
          draggable={false}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`lb-img max-h-full max-w-full rounded-lg object-contain shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)] ring-1 ring-gold-300/15 transition-opacity duration-300 will-change-transform ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ width: "auto", height: "auto" }}
        />
        {many && (
          <>
            <button type="button" className={`${btn} absolute flex left-3 top-1/2 -translate-y-1/2 sm:left-6`} onClick={() => go(-1)} aria-label="Previous image">
              <Icon name="arrowRight" className="size-4 rotate-180" />
            </button>
            <button type="button" className={`${btn} absolute flex right-3 top-1/2 -translate-y-1/2 sm:right-6`} onClick={() => go(1)} aria-label="Next image">
              <Icon name="arrowRight" className="size-4" />
            </button>
          </>
        )}
      </div>

      <p className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-ivory/45">
        <span className="sm:hidden">Pinch or double-tap to zoom{many ? " · swipe to browse" : ""}</span>
        <span className="hidden sm:inline">Scroll or double-click to zoom · drag to pan{many ? " · ← → to browse" : ""} · Esc to close</span>
      </p>
    </div>,
    document.body,
  );
}
