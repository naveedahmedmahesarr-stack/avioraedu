import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { saveMedia } from "@/lib/content/store";

// Auth enforced in src/proxy.ts. Stored on disk locally, or in Redis when KV_REST_API_URL is set (Vercel).
// Vercel limits request bodies to 4.5 MB, so larger files only upload on a self-hosted server.

const ALLOWED: Record<string, { ext: string; max: number }> = {
  "image/jpeg": { ext: "jpg", max: 8 * 1024 * 1024 },
  "image/png": { ext: "png", max: 8 * 1024 * 1024 },
  "image/webp": { ext: "webp", max: 8 * 1024 * 1024 },
  "image/avif": { ext: "avif", max: 8 * 1024 * 1024 },
  "video/mp4": { ext: "mp4", max: 150 * 1024 * 1024 },
  "video/webm": { ext: "webm", max: 150 * 1024 * 1024 },
};

function sniff(buf: Uint8Array, type: string) {
  const hex = Buffer.from(buf.slice(0, 12)).toString("hex");
  const ascii = Buffer.from(buf.slice(0, 12)).toString("latin1");
  switch (type) {
    case "image/jpeg":
      return hex.startsWith("ffd8ff");
    case "image/png":
      return hex.startsWith("89504e47");
    case "image/webp":
      return ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP";
    case "image/avif":
    case "video/mp4":
      return ascii.slice(4, 8) === "ftyp";
    case "video/webm":
      return hex.startsWith("1a45dfa3");
    default:
      return false;
  }
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  const rule = ALLOWED[file.type];
  if (!rule) return NextResponse.json({ error: "Unsupported file type (JPG, PNG, WebP, AVIF, MP4, WebM)" }, { status: 415 });
  if (file.size > rule.max) return NextResponse.json({ error: "File is too large" }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!sniff(bytes, file.type)) return NextResponse.json({ error: "File content does not match its type" }, { status: 415 });

  const name = `${randomUUID()}.${rule.ext}`;
  try {
    await saveMedia(name, bytes);
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json(
      {
        error: "CONFIGURATION REQUIRED: upload storage is not writable. Set UPLOAD_DIR or configure cloud storage.",
        configurationRequired: true,
      },
      { status: 503 },
    );
  }
  return NextResponse.json({ url: `/api/media/${name}` }, { status: 201 });
}
