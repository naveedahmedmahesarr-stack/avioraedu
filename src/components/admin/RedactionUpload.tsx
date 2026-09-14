"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** Box in fractions of the image (0–1), so it survives any preview size. */
type Box = { x: number; y: number; w: number; h: number };

const MAX_WIDTH = 2000;
const CHECKLIST = [
  "Passport photo / face",
  "Visa number (top right and the red vertical number)",
  "Passport number",
  "Date of birth",
  "Machine-readable zone (the two lines with < signs)",
  "Signature / officer name",
  "Supplementary sheet (Zusatzblatt) number, if shown",
];

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Visa document redaction for Admin. The original is opened locally (object URL) and never uploaded:
 * black boxes are burned into a re-encoded JPEG (which also drops EXIF/location metadata), and only
 * that flattened copy is sent to /api/admin/upload.
 */
export function RedactionUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [img, setImg] = useState<{ el: HTMLImageElement; url: string } | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [draft, setDraft] = useState<Box | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const wrap = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!img) return;
    return () => URL.revokeObjectURL(img.url);
  }, [img]);

  const pick = (file: File) => {
    const url = URL.createObjectURL(file);
    const el = new Image();
    el.onload = () => {
      setImg({ el, url });
      setBoxes([]);
      setSelected(null);
      setChecked(false);
      setErr("");
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      setErr("This image could not be read. Use JPG, PNG or WebP.");
    };
    el.src = url;
  };

  const point = (e: React.PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect();
    return { x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) };
  };

  const upload = async () => {
    if (!img) return;
    setBusy(true);
    setErr("");
    try {
      const scale = Math.min(1, MAX_WIDTH / img.el.naturalWidth);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.el.naturalWidth * scale);
      canvas.height = Math.round(img.el.naturalHeight * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser cannot process images.");
      ctx.drawImage(img.el, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000";
      for (const b of boxes) ctx.fillRect(b.x * canvas.width, b.y * canvas.height, b.w * canvas.width, b.h * canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("Could not create the redacted image.");
      const fd = new FormData();
      fd.append("file", new File([blob], "visa-redacted.jpg", { type: "image/jpeg" }));
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || `Upload failed (${res.status})`);
      onChange(json.url);
      setImg(null); // discard the local original
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (!img) {
    return (
      <div>
        {value && (
          <div className="mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded file of unknown size */}
            <img src={value} alt="Current redacted visa document" className="max-h-56 rounded-xl border border-navy-900/10" />
            <button type="button" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-danger hover:underline" onClick={() => onChange("")}>
              <Icon name="trash" className="size-3.5" /> Remove document
            </button>
          </div>
        )}
        <label className="btn btn-outline cursor-pointer">
          <Icon name="upload" className="size-4" /> {value ? "Replace with a new redacted copy" : "Choose visa image to redact"}
          <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} />
        </label>
        {err && <p className="mt-2 text-sm text-danger">{err}</p>}
      </div>
    );
  }

  const shown = draft ? [...boxes, draft] : boxes;
  return (
    <div className="space-y-4 rounded-2xl border border-navy-900/15 bg-white p-4">
      <p className="text-sm text-navy-900">
        <strong>Drag on the image</strong> to draw a black box. Click a box to select it. Nothing is uploaded until you press the upload button.
      </p>
      <div
        ref={wrap}
        tabIndex={0}
        aria-label="Visa image. Drag to add a redaction box; press Delete to remove the selected box."
        className="relative cursor-crosshair touch-none select-none overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-navy-900"
        onKeyDown={(e) => {
          if ((e.key === "Delete" || e.key === "Backspace") && selected !== null) {
            e.preventDefault();
            setBoxes((b) => b.filter((_, i) => i !== selected));
            setSelected(null);
          }
        }}
        onPointerDown={(e) => {
          const p = point(e);
          start.current = p;
          setSelected(null);
          setDraft({ ...p, w: 0, h: 0 });
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Synthetic events cannot capture; drawing still works.
          }
        }}
        onPointerMove={(e) => {
          if (!start.current) return;
          const p = point(e);
          const s = start.current;
          setDraft({ x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) });
        }}
        onPointerUp={(e) => {
          // Use the release position itself: the last rendered draft can lag behind a fast drag,
          // which would save a smaller box than the user dragged and leave data uncovered.
          const s = start.current;
          if (s) {
            const p = point(e);
            const box = { x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) };
            if (box.w > 0.005 && box.h > 0.005) setBoxes((b) => [...b, box]);
          }
          setDraft(null);
          start.current = null;
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local object URL of the original, never uploaded */}
        <img src={img.url} alt="Visa image being redacted" draggable={false} className="block w-full" />
        {shown.map((b, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Redaction box ${i + 1}`}
            className={`absolute bg-black ${selected === i ? "ring-2 ring-gold-500 ring-offset-1" : ""}`}
            style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: `${b.w * 100}%`, height: `${b.h * 100}%` }}
            onPointerDown={(e) => {
              e.stopPropagation();
              setSelected(i);
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-outline" disabled={selected === null} onClick={() => { setBoxes((b) => b.filter((_, i) => i !== selected)); setSelected(null); }}>
          <Icon name="trash" className="size-4" /> Remove selected box
        </button>
        <button type="button" className="btn btn-outline" disabled={!boxes.length} onClick={() => setBoxes((b) => b.slice(0, -1))}>
          Undo last box
        </button>
        <button type="button" className="btn btn-outline" onClick={() => setImg(null)}>
          Cancel
        </button>
      </div>
      <div className="rounded-xl bg-sand/60 p-4 text-sm text-navy-900">
        <p className="font-semibold">Before uploading, make sure every one of these is fully covered:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {CHECKLIST.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <label className="mt-3 flex items-center gap-3 font-semibold">
          <input type="checkbox" className="size-5 accent-navy-900" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          I checked the preview: all personal data is covered.
        </label>
      </div>
      {err && <p className="text-sm text-danger">{err}</p>}
      <button type="button" className="btn btn-navy" disabled={busy || !checked || boxes.length === 0} onClick={upload}>
        <Icon name="upload" className="size-4" /> {busy ? "Uploading…" : `Upload redacted copy (${boxes.length} box${boxes.length === 1 ? "" : "es"})`}
      </button>
    </div>
  );
}
