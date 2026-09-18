"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MEDIA_CATEGORIES, type Media } from "@/lib/content/schemas";
import { ACCEPT_IMAGES, ACCEPT_VIDEOS, UPLOAD_RULES, checkFile } from "@/lib/media/rules";
import { Icon } from "@/components/ui/Icon";
import { api, prepareImage, prepareVideo, uploadFile, type StorageDriver } from "./upload";

type Category = (typeof MEDIA_CATEGORIES)[number];
type Job = { key: string; name: string; kind: "image" | "video"; pct: number; stage: string; error?: string; file: File };

const prettify = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase())
    .slice(0, 120) || "Untitled";

const fmtDur = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/** Germany Insights library: bulk upload with progress, auto poster frames, edit / publish / delete. */
export function MediaManager({ storage }: { storage: StorageDriver }) {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [category, setCategory] = useState<Category>("Germany Visits");
  const [publishNow, setPublishNow] = useState(true);
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<Media | null>(null);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const { items } = await api("/api/admin/media");
      setItems((items as Media[]).sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""))));
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    api("/api/admin/media")
      .then(({ items }) => alive && setItems((items as Media[]).sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")))))
      .catch((x) => alive && setErr((x as Error).message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const setJob = (key: string, patch: Partial<Job>) => setJobs((js) => js.map((j) => (j.key === key ? { ...j, ...patch } : j)));

  const run = async (job: Job, cat: Category, publish: boolean) => {
    const { file, key } = job;
    try {
      setJob(key, { stage: "Preparing…", pct: 0, error: undefined });
      let src = "";
      let poster = "";
      let width = 1600;
      let height = 900;
      let duration = 0;
      if (job.kind === "image") {
        const img = await prepareImage(file);
        ({ width, height } = img);
        setJob(key, { stage: "Uploading…" });
        src = await uploadFile(img.blob, img.type, storage, (pct) => setJob(key, { pct }));
      } else {
        const v = await prepareVideo(file);
        ({ width, height, duration } = v);
        setJob(key, { stage: "Uploading video…" });
        src = await uploadFile(file, file.type, storage, (pct) => setJob(key, { pct: pct * 0.95 }));
        if (v.poster) {
          setJob(key, { stage: "Saving thumbnail…" });
          poster = await uploadFile(v.poster, "image/webp", storage);
        }
      }
      setJob(key, { stage: "Saving…", pct: 99 });
      await api("/api/admin/media", {
        method: "POST",
        body: JSON.stringify({ kind: job.kind, title: prettify(file.name), description: "", category: cat, src, poster, width, height, duration: Math.round(duration * 10) / 10, published: publish }),
      });
      setJobs((js) => js.filter((j) => j.key !== key));
      load();
    } catch (x) {
      setJob(key, { error: (x as Error).message || "Upload failed", stage: "Failed" });
    }
  };

  const addFiles = (files: FileList | File[]) => {
    const list = [...files];
    const rejected: string[] = [];
    const next: Job[] = [];
    for (const file of list) {
      const problem = checkFile(file);
      if (problem) {
        rejected.push(problem);
        continue;
      }
      next.push({ key: crypto.randomUUID(), name: file.name, kind: UPLOAD_RULES[file.type].kind, pct: 0, stage: "Queued", file });
    }
    setErr(rejected.join("\n"));
    if (!next.length) return;
    setJobs((js) => [...js, ...next]);
    // Sequential: keeps phones/slow links responsive and progress readable.
    (async () => {
      for (const j of next) await run(j, category, publishNow);
    })();
  };

  const patch = async (m: Media, body: Partial<Media>) => {
    setItems((xs) => xs.map((x) => (x.id === m.id ? { ...x, ...body } : x)));
    try {
      await api(`/api/admin/media/${m.id}`, { method: "PATCH", body: JSON.stringify(body) });
    } catch (x) {
      setErr((x as Error).message);
    }
    load();
  };
  const remove = async (m: Media) => {
    if (!confirm(`Delete “${m.title}”? The file will be removed permanently.`)) return;
    try {
      await api(`/api/admin/media/${m.id}`, { method: "DELETE" });
      setItems((xs) => xs.filter((x) => x.id !== m.id));
    } catch (x) {
      setErr((x as Error).message);
    }
  };

  const shown = useMemo(
    () => items.filter((m) => (filter === "all" || m.category === filter) && (status === "all" || (status === "published") === m.published)),
    [items, filter, status],
  );
  const counts = { total: items.length, live: items.filter((m) => m.published).length, videos: items.filter((m) => m.kind === "video").length };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-3 text-sm text-stone">
        <span className="rounded-full bg-white px-4 py-2 ring-1 ring-navy-900/10">{counts.total} items</span>
        <span className="rounded-full bg-white px-4 py-2 ring-1 ring-navy-900/10">{counts.live} published</span>
        <span className="rounded-full bg-white px-4 py-2 ring-1 ring-navy-900/10">{counts.videos} videos</span>
        <a href="/germany-insights" target="_blank" className="ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-semibold text-gold-600 hover:underline">
          View public page <Icon name="arrowUpRight" className="size-4" />
        </a>
      </div>

      {/* Upload */}
      <section aria-label="Upload media" className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-navy-900/10 md:p-7">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label className="label" htmlFor="up-cat">
              Category for new uploads
            </label>
            <select id="up-cat" className="field md:max-w-xs" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {MEDIA_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm font-medium text-navy-800">
            <input type="checkbox" className="size-5 accent-[#c29a52]" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} />
            Publish immediately
          </label>
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`mt-5 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${drag ? "border-gold-500 bg-gold-300/15" : "border-navy-900/15 bg-ivory"}`}
        >
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-navy-950 text-gold-300">
            <Icon name="upload" className="size-6" />
          </span>
          <p className="font-display text-2xl text-navy-900">Drop photos & videos here</p>
          <p className="max-w-md text-sm text-stone">
            JPG, PNG, WebP, AVIF up to 15 MB · MP4, WebM, MOV up to 500 MB. Large photos are resized to 2560px automatically and a thumbnail is created for every video.
          </p>
          <button type="button" className="btn btn-navy mt-2" onClick={() => input.current?.click()}>
            Choose files
          </button>
          <input
            ref={input}
            type="file"
            multiple
            className="sr-only"
            accept={`${ACCEPT_IMAGES},${ACCEPT_VIDEOS}`}
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {jobs.length > 0 && (
          <ul className="mt-5 space-y-2" aria-live="polite">
            {jobs.map((j) => (
              <li key={j.key} className="rounded-xl border border-navy-900/10 p-3">
                <div className="flex items-center gap-3 text-sm">
                  <Icon name={j.kind === "video" ? "play" : "upload"} className="size-4 shrink-0 text-gold-600" />
                  <span className="min-w-0 flex-1 truncate font-medium text-navy-900">{j.name}</span>
                  <span className={j.error ? "text-danger" : "text-stone"}>{j.error ? "Failed" : `${j.stage} ${j.pct ? Math.round(j.pct) + "%" : ""}`}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
                  <div className={`h-full origin-left rounded-full transition-transform ${j.error ? "bg-danger" : "bg-gold-500"}`} style={{ transform: `scaleX(${j.error ? 1 : j.pct / 100})` }} />
                </div>
                {j.error && (
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex-1 text-danger">{j.error}</span>
                    <button type="button" className="font-semibold text-navy-800 underline" onClick={() => run(j, category, publishNow)}>
                      Retry
                    </button>
                    <button type="button" className="text-stone underline" onClick={() => setJobs((js) => js.filter((x) => x.key !== j.key))}>
                      Dismiss
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {err && (
        <p role="alert" className="mt-6 whitespace-pre-line rounded-2xl border border-danger/30 bg-white p-4 text-sm text-danger">
          {err}
        </p>
      )}

      {/* Library */}
      <div className="mt-10 flex flex-wrap items-center gap-2">
        {(["all", ...MEDIA_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === c ? "bg-navy-950 text-gold-300" : "bg-white text-navy-800 ring-1 ring-navy-900/10 hover:ring-gold-500"}`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
        <select aria-label="Status filter" className="field ml-auto !min-h-10 !w-auto !py-1" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-10 text-stone">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-navy-900/20 p-10 text-center text-stone">No media here yet — upload your first photo or video above.</p>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-navy-900/10">
              <div className="relative aspect-video bg-navy-950">
                {m.kind === "video" && !m.poster ? (
                  <video src={`${m.src}#t=1`} preload="metadata" muted playsInline className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.kind === "video" ? m.poster : m.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                )}
                <span className="absolute left-3 top-3 rounded-full bg-navy-950/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-300">
                  {m.kind === "video" ? `Video · ${fmtDur(m.duration)}` : "Photo"}
                </span>
                <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold ${m.published ? "bg-success text-white" : "bg-sand text-stone"}`}>{m.published ? "Published" : "Draft"}</span>
              </div>
              <div className="p-4">
                <p className="truncate font-semibold text-navy-900">{m.title}</p>
                <p className="mt-0.5 text-xs text-stone">
                  {m.category}
                  {m.featured && " · Featured"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn btn-outline !min-h-10 flex-1 !px-3" onClick={() => patch(m, { published: !m.published })}>
                    {m.published ? "Unpublish" : "Publish"}
                  </button>
                  <button className="btn btn-outline !min-h-10 !px-3" onClick={() => setEditing(m)} aria-label={`Edit ${m.title}`}>
                    <Icon name="edit" className="size-4" />
                  </button>
                  <button className="btn btn-outline !min-h-10 !px-3 hover:!border-danger hover:!text-danger" onClick={() => remove(m)} aria-label={`Delete ${m.title}`}>
                    <Icon name="trash" className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <EditMedia
          item={editing}
          storage={storage}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function EditMedia({ item, storage, onClose, onSaved }: { item: Media; storage: StorageDriver; onClose: () => void; onSaved: () => void }) {
  const [v, setV] = useState(item);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof Media>(k: K, val: Media[K]) => setV((x) => ({ ...x, [k]: val }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = async () => {
    setBusy(true);
    setErr("");
    try {
      await api(`/api/admin/media/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: v.title, description: v.description, category: v.category, published: v.published, featured: v.featured, order: v.order, poster: v.poster }),
      });
      onSaved();
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="edit-media-title" className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-ivory p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 id="edit-media-title" className="text-3xl text-navy-900">
            Edit {item.kind}
          </h2>
          <button type="button" className="inline-flex size-10 items-center justify-center rounded-full ring-1 ring-navy-900/15" onClick={onClose} aria-label="Close">
            <Icon name="close" className="size-4" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="m-title">
              Title
            </label>
            <input id="m-title" className="field" maxLength={120} value={v.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="m-desc">
              Short description
            </label>
            <textarea id="m-desc" className="field min-h-24" maxLength={400} value={v.description} onChange={(e) => set("description", e.target.value)} />
            <p className="mt-1 text-right text-xs text-stone">{v.description.length}/400</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="m-cat">
                Category
              </label>
              <select id="m-cat" className="field" value={v.category} onChange={(e) => set("category", e.target.value as Category)}>
                {MEDIA_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="m-order">
                Sort order
              </label>
              <input id="m-order" type="number" className="field" value={v.order} onChange={(e) => set("order", Number(e.target.value) || 0)} />
            </div>
          </div>
          {item.kind === "video" && (
            <div>
              <span className="label">Thumbnail</span>
              <div className="flex items-center gap-3">
                {v.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.poster} alt="" className="h-16 w-28 rounded-lg object-cover" />
                ) : (
                  <span className="text-sm text-stone">No thumbnail</span>
                )}
                <label className="btn btn-outline !min-h-10 cursor-pointer !px-4">
                  Replace
                  <input
                    type="file"
                    accept={ACCEPT_IMAGES}
                    className="sr-only"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      if (!f) return;
                      const problem = checkFile(f);
                      if (problem) return setErr(problem);
                      setBusy(true);
                      try {
                        const img = await prepareImage(f);
                        set("poster", await uploadFile(img.blob, img.type, storage));
                      } catch (x) {
                        setErr((x as Error).message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
              <input type="checkbox" className="size-5 accent-[#c29a52]" checked={v.published} onChange={(e) => set("published", e.target.checked)} /> Published
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
              <input type="checkbox" className="size-5 accent-[#c29a52]" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured (shown first)
            </label>
          </div>
          {err && <p className="whitespace-pre-line text-sm text-danger">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn btn-gold flex-1" disabled={busy || !v.title.trim()} onClick={save}>
              {busy ? "Saving…" : "Save changes"}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
