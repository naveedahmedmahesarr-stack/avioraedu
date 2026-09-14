import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { collections, type CollectionMap, type CollectionName } from "./schemas";
import { seed } from "./seed";

/**
 * Content repository — local JSON file driver.
 *
 * Works on any Node host with a persistent, writable disk (VPS, Docker volume,
 * `next start`). Serverless hosts (e.g. Vercel) have a read-only filesystem:
 * reads fall back to seed content and writes raise StorageUnavailableError.
 * CONFIGURATION REQUIRED for serverless: implement the same functions against
 * a database (Postgres/Supabase/etc.) and set CONTENT_STORAGE accordingly.
 */
export class StorageUnavailableError extends Error {
  constructor(detail: string) {
    super(
      `CONFIGURATION REQUIRED: content storage is not writable (${detail}). ` +
        "Set CONTENT_DIR to a persistent writable directory or configure a database driver in src/lib/content/store.ts.",
    );
  }
}

export const CONTENT_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.CONTENT_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), ".data", "content"));
export const UPLOAD_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), ".data", "uploads"));

const locks = new Map<string, Promise<unknown>>();
function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  locks.set(key, next.catch(() => undefined));
  return next;
}

/**
 * Serverless driver: Upstash Redis over its REST API (private; no SDK needed). Enabled when the
 * Upstash integration from the Vercel Marketplace is connected, which sets these variables.
 */
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const kvEnabled = Boolean(kvUrl && kvToken);

async function kv(command: string[]): Promise<string | null> {
  const res = await fetch(kvUrl!, {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  }).catch((err: unknown) => {
    throw new StorageUnavailableError(`redis unreachable: ${err instanceof Error ? err.message : "network error"}`);
  });
  const data = (await res.json().catch(() => null)) as { result?: string | null; error?: string } | null;
  if (!res.ok || !data || data.error) throw new StorageUnavailableError(`redis ${res.status}${data?.error ? `: ${data.error}` : ""}`);
  return data.result ?? null;
}

/** `strict` (used before writes) never falls back to built-in content, so a Redis outage can't overwrite saved data. */
async function readRaw<K extends CollectionName>(name: K, strict = true): Promise<CollectionMap[K][]> {
  const file = path.join(CONTENT_DIR, `${name}.json`);
  try {
    const text = kvEnabled ? await kv(["GET", `content:${name}`]) : await fs.readFile(file, "utf8");
    if (text === null) return structuredClone(seed[name] as CollectionMap[K][]);
    const raw = JSON.parse(text) as unknown[];
    const schema = collections[name];
    return raw.flatMap((item) => {
      const parsed = schema.safeParse(item);
      return parsed.success ? [parsed.data as CollectionMap[K]] : [];
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return structuredClone(seed[name] as CollectionMap[K][]);
    }
    if (!strict && err instanceof StorageUnavailableError) {
      // Keep the public site online with built-in content if Redis is briefly unavailable.
      console.error(`[store] reading ${name} failed, serving built-in content:`, err.message);
      return structuredClone(seed[name] as CollectionMap[K][]);
    }
    throw err;
  }
}

async function writeRaw<K extends CollectionName>(name: K, items: CollectionMap[K][]) {
  if (kvEnabled) {
    await kv(["SET", `content:${name}`, JSON.stringify(items)]);
    return;
  }
  try {
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    const file = path.join(CONTENT_DIR, `${name}.json`);
    const tmp = `${file}.${randomUUID()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(items, null, 2), "utf8");
    await fs.rename(tmp, file);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code ?? "unknown";
    if (["EROFS", "EACCES", "EPERM", "ENOENT"].includes(code)) throw new StorageUnavailableError(code);
    throw err;
  }
}

export async function list<K extends CollectionName>(name: K, opts: { publishedOnly?: boolean } = {}) {
  const items = await readRaw(name, false);
  return opts.publishedOnly ? items.filter((i) => i.published) : items;
}

export async function getById<K extends CollectionName>(name: K, id: string) {
  return (await readRaw(name, false)).find((i) => i.id === id) ?? null;
}

export async function create<K extends CollectionName>(name: K, input: unknown) {
  return withLock(name, async () => {
    const now = new Date().toISOString();
    const parsed = collections[name].parse({
      ...(input as object),
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    }) as CollectionMap[K];
    const items = await readRaw(name);
    items.push(parsed);
    await writeRaw(name, items);
    return parsed;
  });
}

export async function update<K extends CollectionName>(name: K, id: string, patch: unknown) {
  return withLock(name, async () => {
    const items = await readRaw(name);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const merged = collections[name].parse({
      ...items[idx],
      ...(patch as object),
      id,
      createdAt: items[idx].createdAt,
      updatedAt: new Date().toISOString(),
    }) as CollectionMap[K];
    items[idx] = merged;
    await writeRaw(name, items);
    return merged;
  });
}

export async function remove(name: CollectionName, id: string) {
  return withLock(name, async () => {
    const items = await readRaw(name);
    const next = items.filter((i) => i.id !== id);
    if (next.length === items.length) return false;
    await writeRaw(name, next);
    return true;
  });
}

/** Uploaded media: Redis (base64) when configured, otherwise UPLOAD_DIR on disk. */
export async function saveMedia(name: string, bytes: Uint8Array) {
  if (kvEnabled) {
    await kv(["SET", `media:${name}`, Buffer.from(bytes).toString("base64")]);
    return;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), bytes);
}

export async function readMedia(name: string): Promise<Buffer | null> {
  try {
    if (kvEnabled) {
      const b64 = await kv(["GET", `media:${name}`]);
      return b64 === null ? null : Buffer.from(b64, "base64");
    }
    return await fs.readFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name));
  } catch {
    return null;
  }
}

/** Central business contact settings (WhatsApp, email, phone) — the single source for the public site. */
export async function getSettings() {
  const [settings] = await list("settings");
  return settings ?? seed.settings[0];
}

export async function getHomepage() {
  const [home] = await list("homepage");
  return home ?? seed.homepage[0];
}
