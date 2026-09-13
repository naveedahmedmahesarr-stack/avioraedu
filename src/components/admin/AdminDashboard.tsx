"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CollectionName } from "@/lib/content/schemas";
import { collectionMeta, emptyItem, type Field } from "./fields";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";

type Item = Record<string, unknown> & { id?: string; published?: boolean };
const ORDER: CollectionName[] = ["submissions", "settings", "reviews", "dreamStories", "destinations", "universities", "faqs", "team", "homepage"];

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, { ...init, headers: init?.body instanceof FormData ? undefined : { "Content-Type": "application/json" } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error([json.error, ...(json.issues ?? [])].filter(Boolean).join("\n") || `Request failed (${res.status})`);
  return json;
}

function MediaField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isVideo = field.type === "media-video";
  return (
    <div>
      <div className="flex gap-2">
        <input className="field" value={value} onChange={(e) => onChange(e.target.value)} placeholder="/api/media/… or https://…" />
        <label className={`btn btn-outline shrink-0 ${busy ? "opacity-60" : ""}`}>
          <Icon name="upload" className="size-4" /> {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            className="sr-only"
            accept={isVideo ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/avif"}
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setErr("");
              try {
                const fd = new FormData();
                fd.append("file", file);
                const { url } = await api("/api/admin/upload", { method: "POST", body: fd });
                onChange(url);
              } catch (x) {
                setErr((x as Error).message);
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
      </div>
      {err && <p className="mt-1 text-sm text-danger">{err}</p>}
      {value && (
        <button type="button" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-danger hover:underline" onClick={() => onChange("")}>
          <Icon name="trash" className="size-3.5" /> Remove {isVideo ? "video" : "image"}
        </button>
      )}
      {value &&
        (isVideo ? (
          <video src={value} controls className="mt-3 max-h-48 rounded-xl" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="mt-3 max-h-40 rounded-xl object-cover" />
        ))}
    </div>
  );
}

function Editor({ name, item, onClose, onSaved }: { name: CollectionName; item: Item; onClose: () => void; onSaved: () => void }) {
  const [draft, setDraft] = useState<Item>(item);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const meta = collectionMeta[name];
  const set = (k: string, v: unknown) => setDraft((d) => ({ ...d, [k]: v }));

  const save = async () => {
    setBusy(true);
    setErr("");
    try {
      if (name === "dreamStories" && draft.published && !draft.consentConfirmed) throw new Error("Confirm written consent before publishing a Dream Story.");
      const body = { ...draft };
      delete body.id;
      delete body.createdAt;
      delete body.updatedAt;
      if (item.id) await api(`/api/admin/${name}/${item.id}`, { method: "PATCH", body: JSON.stringify(body) });
      else await api(`/api/admin/${name}`, { method: "POST", body: JSON.stringify(body) });
      onSaved();
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="editor-title" className="fixed inset-0 z-50 flex justify-end bg-navy-950/50 backdrop-blur-sm" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="flex h-full w-full max-w-2xl flex-col bg-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-navy-900/10 p-6">
          <h2 id="editor-title" className="text-3xl text-navy-900">
            {item.id ? "Edit" : "New"} · {meta.label}
          </h2>
          <button className="inline-flex size-11 items-center justify-center rounded-full hover:bg-sand" onClick={onClose} aria-label="Close editor" autoFocus>
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {meta.fields.map((f) => {
            const v = draft[f.key];
            const id = `f-${f.key}`;
            return (
              <div key={f.key}>
                {f.type !== "bool" && (
                  <label htmlFor={id} className="label">
                    {f.label}
                  </label>
                )}
                {f.type === "textarea" ? (
                  <textarea id={id} rows={5} className="field" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />
                ) : f.type === "number" ? (
                  <input id={id} type="number" className="field" value={Number(v ?? 0)} onChange={(e) => set(f.key, Number(e.target.value))} />
                ) : f.type === "bool" ? (
                  <label className="flex items-center gap-3 text-sm font-semibold text-navy-900">
                    <input id={id} type="checkbox" className="size-5 accent-navy-900" checked={Boolean(v)} onChange={(e) => set(f.key, e.target.checked)} />
                    {f.label}
                  </label>
                ) : f.type === "list" ? (
                  <textarea id={id} rows={4} className="field" value={((v as string[]) ?? []).join("\n")} onChange={(e) => set(f.key, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />
                ) : f.type === "select" ? (
                  <select id={id} className="field" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)}>
                    {f.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : f.type === "multi" ? (
                  <div className="flex flex-wrap gap-2">
                    {f.options.map((o) => {
                      const arr = (v as string[]) ?? [];
                      const on = arr.includes(o);
                      return (
                        <button key={o} type="button" aria-pressed={on} onClick={() => set(f.key, on ? arr.filter((x) => x !== o) : [...arr, o])} className={`rounded-full border px-4 py-2 text-sm ${on ? "border-navy-900 bg-navy-900 text-ivory" : "border-navy-900/20"}`}>
                          {o}
                        </button>
                      );
                    })}
                  </div>
                ) : f.type === "media-image" || f.type === "media-video" ? (
                  <MediaField field={f} value={String(v ?? "")} onChange={(x) => set(f.key, x)} />
                ) : (
                  <input id={id} type={f.type === "url" ? "url" : f.type === "date" ? "date" : "text"} className="field" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />
                )}
                {f.help && <p className="mt-1 text-xs text-stone">{f.help}</p>}
              </div>
            );
          })}
        </div>
        <div className="border-t border-navy-900/10 p-6">
          {err && (
            <p role="alert" className="mb-4 whitespace-pre-line rounded-xl bg-danger/5 p-3 text-sm text-danger">
              {err}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-navy" onClick={save} disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<CollectionName>("submissions");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const meta = collectionMeta[tab];

  const load = useCallback(async () => {
    try {
      const { items } = await api(`/api/admin/${tab}`);
      setErr("");
      setItems((items as Item[]).sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""))));
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    let cancelled = false;
    api(`/api/admin/${tab}`)
      .then(({ items }) => {
        if (cancelled) return;
        setErr("");
        setItems((items as Item[]).sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""))));
      })
      .catch((x) => !cancelled && setErr((x as Error).message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const patch = async (item: Item, body: Record<string, unknown>) => {
    try {
      await api(`/api/admin/${tab}/${item.id}`, { method: "PATCH", body: JSON.stringify(body) });
      load();
    } catch (x) {
      setErr((x as Error).message);
    }
  };
  const del = async (item: Item) => {
    if (!confirm(`Delete “${String(item[meta.titleKey] ?? "item")}”? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/${tab}/${item.id}`, { method: "DELETE" });
      load();
    } catch (x) {
      setErr((x as Error).message);
    }
  };
  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="bg-navy-950 p-6 text-ivory lg:w-72 lg:shrink-0">
        <Logo />
        <nav aria-label="Content collections" className="mt-10">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col">
            {ORDER.map((c) => (
              <li key={c}>
                <button
                  onClick={() => {
                    if (c === tab) return;
                    setLoading(true);
                    setItems([]);
                    setTab(c);
                  }}
                  aria-current={tab === c ? "page" : undefined}
                  className={`w-full whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-medium transition ${tab === c ? "bg-gold-400 text-navy-950" : "text-ivory/80 hover:bg-ivory/10"}`}
                >
                  {collectionMeta[c].label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={logout} className="mt-8 inline-flex items-center gap-2 text-sm text-ivory/70 hover:text-gold-300">
          <Icon name="logout" className="size-4" /> Sign out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-5xl text-navy-900">{meta.label}</h1>
          {meta.canCreate && (
            <button className="btn btn-gold" onClick={() => setEditing(emptyItem(tab))}>
              + New
            </button>
          )}
        </div>
        {err && (
          <p role="alert" className="mt-6 whitespace-pre-line rounded-2xl border border-danger/30 bg-white p-4 text-sm text-danger">
            {err}
          </p>
        )}
        {loading ? (
          <p className="mt-10 text-stone">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-navy-900/20 p-10 text-center text-stone">Nothing here yet.</p>
        ) : (
          <ul className="mt-8 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col gap-4 rounded-2xl border border-navy-900/10 bg-white p-5 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-navy-900">{String(item[meta.titleKey] ?? "(untitled)")}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone">
                    {meta.subtitleKey && <span>{String(item[meta.subtitleKey] ?? "")}</span>}
                    {tab !== "submissions" && (
                      <span className={`rounded-full px-2 py-0.5 font-semibold ${item.published ? "bg-success/10 text-success" : "bg-sand text-stone"}`}>{item.published ? "Published" : "Draft"}</span>
                    )}
                    {Boolean(item.sample) && <span className="rounded-full bg-gold-300/40 px-2 py-0.5 font-semibold text-gold-600">Sample</span>}
                    {Boolean(item.createdAt) && <span>{new Date(String(item.createdAt)).toLocaleString()}</span>}
                  </p>
                  {tab === "submissions" && (
                    <p className="mt-2 text-sm text-stone">
                      {String(item.phone)} · {String(item.country)} → {String(item.destination)} · {String(item.studyLevel)} · {String(item.studyField)} · {String(item.intake)}
                      {item.message ? <span className="mt-1 block italic">“{String(item.message)}”</span> : null}
                    </p>
                  )}
                  {tab === "reviews" && <p className="mt-2 line-clamp-2 text-sm text-stone">★ {String(item.rating)} — {String(item.review)}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {tab === "reviews" && item.status !== "approved" && (
                    <button className="btn btn-outline !min-h-10 !px-4" onClick={() => patch(item, { status: "approved", published: true })}>
                      Approve & publish
                    </button>
                  )}
                  {tab === "reviews" && item.status !== "rejected" && (
                    <button className="btn btn-outline !min-h-10 !px-4" onClick={() => patch(item, { status: "rejected", published: false })}>
                      Reject
                    </button>
                  )}
                  {tab === "submissions" ? (
                    <select aria-label="Submission status" className="field !min-h-10 !w-auto !py-1" value={String(item.status)} onChange={(e) => patch(item, { status: e.target.value })}>
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="closed">closed</option>
                    </select>
                  ) : (
                    <button className="btn btn-outline !min-h-10 !px-4" onClick={() => patch(item, { published: !item.published })}>
                      {item.published ? "Unpublish" : "Publish"}
                    </button>
                  )}
                  {tab !== "submissions" && (
                    <button className="btn btn-outline !min-h-10 !px-4" onClick={() => setEditing(item)} aria-label="Edit">
                      <Icon name="edit" className="size-4" />
                    </button>
                  )}
                  {!meta.single && (
                    <button className="btn btn-outline !min-h-10 !px-4 hover:!border-danger hover:!text-danger" onClick={() => del(item)} aria-label="Delete">
                      <Icon name="trash" className="size-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {editing && (
        <Editor
          key={editing.id ?? "new"}
          name={tab}
          item={editing}
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
