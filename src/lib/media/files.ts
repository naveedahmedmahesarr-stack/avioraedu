import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { del } from "@vercel/blob";
import { UPLOAD_DIR } from "@/lib/content/store";

/** Deletes an uploaded file (local /api/media/… or Vercel Blob URL). Bundled /brand assets are never touched. */
export async function deleteUploadedFile(url: string) {
  if (!url) return;
  try {
    const local = url.match(/^\/api\/media\/([0-9a-f-]{36}\.(?:jpg|png|webp|avif|mp4|webm|mov))$/);
    if (local) await fs.unlink(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, local[1]));
    else if (/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/media\//.test(url) && process.env.BLOB_READ_WRITE_TOKEN) await del(url);
  } catch (err) {
    console.warn("[media] could not delete", url, (err as Error).message);
  }
}
