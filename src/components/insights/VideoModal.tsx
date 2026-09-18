"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Media } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";

/** Premium full-screen video player. Native controls (best on iOS/Android), scroll-locked, Esc/backdrop to close. */
export function VideoModal({ item, onClose }: { item: Media; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  const [failed, setFailed] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const closeRef = useRef(() => {});

  const close = () => {
    video.current?.pause();
    setClosing(true);
    window.setTimeout(onClose, 240);
  };
  useEffect(() => {
    closeRef.current = close;
  });

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, []);

  const ratio = item.width / item.height;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className={`fixed inset-0 z-[200] flex flex-col bg-[#03080f]/[.97] text-ivory ${closing ? "lb-leave" : "lb-enter"}`}
      onClick={close}
    >
      <div className="flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6" onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow min-w-0 truncate !text-[0.62rem] text-gold-300">{item.category}</p>
        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          aria-label="Close video"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold-300/30 bg-navy-950/80 transition-colors hover:border-gold-300 hover:text-gold-300"
        >
          <Icon name="close" className="size-5" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-8">
        <div
          className="lb-img relative w-full overflow-hidden rounded-2xl bg-black shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)] ring-1 ring-gold-300/20"
          style={{ aspectRatio: `${item.width} / ${item.height}`, maxWidth: `min(100%, 1280px, calc((100dvh - 13rem) * ${ratio.toFixed(4)}))` }}
          onClick={(e) => e.stopPropagation()}
        >
          {failed ? (
            <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-ivory/70">This video can’t be played in this browser. Please try another device.</p>
          ) : (
            <video
              ref={video}
              src={item.src}
              poster={item.poster || undefined}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>
      </div>
      <div className="mx-auto w-full max-w-3xl px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-2xl leading-tight sm:text-3xl">{item.title}</h2>
        {item.description && <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ivory/65">{item.description}</p>}
      </div>
    </div>,
    document.body,
  );
}
