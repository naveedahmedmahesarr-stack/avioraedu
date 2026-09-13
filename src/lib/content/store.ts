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

async function readRaw<K extends CollectionName>(name: K): Promise<CollectionMap[K][]> {
  const file = path.join(CONTENT_DIR, `${name}.json`);
  try {
    const raw = JSON.parse(await fs.readFile(file, "utf8")) as unknown[];
    const schema = collections[name];
    return raw.flatMap((item) => {
      const parsed = schema.safeParse(item);
      return parsed.success ? [parsed.data as CollectionMap[K]] : [];
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return structuredClone(seed[name] as CollectionMap[K][]);
    }
    throw err;
  }
}

async function writeRaw<K extends CollectionName>(name: K, items: CollectionMap[K][]) {
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
