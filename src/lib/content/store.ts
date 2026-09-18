import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { get as blobGet, put as blobPut } from "@vercel/blob";
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

/**
 * Storage driver. With BLOB_READ_WRITE_TOKEN set (Vercel Blob — required on Vercel, whose
 * filesystem is read-only) content JSON lives in Blob; otherwise on local disk.
 * Content blobs sit under an unguessable path derived from ADMIN_SESSION_SECRET and are
 * read with `useCache: false`, so admin edits are visible immediately.
 */
export const usingBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const contentKey = (name: string) =>
  `content/${createHash("sha256").update(`aviora:${process.env.ADMIN_SESSION_SECRET ?? ""}`).digest("hex").slice(0, 40)}/${name}.json`;

async function readJson(name: string): Promise<unknown[] | null> {
  if (usingBlob()) {
    const res = await blobGet(contentKey(name), { access: "public", useCache: false }).catch((err) => {
      if (String(err?.message ?? err).toLowerCase().includes("not found")) return null;
      throw err;
    });
    if (!res || res.statusCode !== 200 || !res.stream) return null;
    return JSON.parse(await new Response(res.stream).text()) as unknown[];
  }
  try {
    return JSON.parse(await fs.readFile(path.join(CONTENT_DIR, `${name}.json`), "utf8")) as unknown[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

const locks = new Map<string, Promise<unknown>>();
function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  locks.set(key, next.catch(() => undefined));
  return next;
}

async function readRaw<K extends CollectionName>(name: K): Promise<CollectionMap[K][]> {
  const raw = await readJson(name);
  if (!raw) return structuredClone(seed[name] as CollectionMap[K][]);
  const schema = collections[name];
  return raw.flatMap((item) => {
    const parsed = schema.safeParse(item);
    return parsed.success ? [parsed.data as CollectionMap[K]] : [];
  });
}

async function writeRaw<K extends CollectionName>(name: K, items: CollectionMap[K][]) {
  if (usingBlob()) {
    try {
      await blobPut(contentKey(name), JSON.stringify(items), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      });
      return;
    } catch (err) {
      console.error("[store:blob]", err);
      throw new StorageUnavailableError(`blob write failed: ${(err as Error).message}`);
    }
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
  const items = await readRaw(name);
  return opts.publishedOnly ? items.filter((i) => i.published) : items;
}

export async function getById<K extends CollectionName>(name: K, id: string) {
  return (await readRaw(name)).find((i) => i.id === id) ?? null;
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

/** Central business contact settings (WhatsApp, email, phone) — the single source for the public site. */
export async function getSettings() {
  const [settings] = await list("settings");
  return settings ?? seed.settings[0];
}

export async function getHomepage() {
  const [home] = await list("homepage");
  return home ?? seed.homepage[0];
}
