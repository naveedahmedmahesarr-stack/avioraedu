import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { UPLOAD_DIR } from "@/lib/content/store";
import { UPLOAD_RULES } from "@/lib/media/rules";

// Auth enforced in src/proxy.ts. Local-disk media driver.
// CONFIGURATION REQUIRED for serverless hosting: replace with S3/R2/Supabase Storage.

const ALLOWED = UPLOAD_RULES;

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
    case "video/quicktime":
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
  if (!rule) return NextResponse.json({ error: "Unsupported file type (JPG, PNG, WebP, AVIF, MP4, WebM, MOV)" }, { status: 415 });
  if (file.size > rule.max) return NextResponse.json({ error: `File is too large (max ${rule.max / 1024 / 1024} MB)` }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!sniff(bytes, file.type)) return NextResponse.json({ error: "File content does not match its type" }, { status: 415 });

  const name = `${randomUUID()}.${rule.ext}`;
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), bytes);
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
