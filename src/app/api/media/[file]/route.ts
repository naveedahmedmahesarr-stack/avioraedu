import { promises as fs } from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/content/store";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
};

export async function GET(req: Request, ctx: RouteContext<"/api/media/[file]">) {
  const { file } = await ctx.params;
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp|avif|mp4|webm)$/.test(file)) return new Response("Not found", { status: 404 });
  const full = path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, file);
  try {
    const stat = await fs.stat(full);
    const type = TYPES[file.split(".").pop()!];
    const headers: Record<string, string> = {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
    };
    const range = req.headers.get("range");
    const m = range?.match(/bytes=(\d*)-(\d*)/);
    if (m) {
      const start = m[1] ? Number(m[1]) : 0;
      const end = m[2] ? Math.min(Number(m[2]), stat.size - 1) : stat.size - 1;
      const handle = await fs.open(full, "r");
      const buf = Buffer.alloc(end - start + 1);
      await handle.read(buf, 0, buf.length, start);
      await handle.close();
      return new Response(buf, {
        status: 206,
        headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Content-Length": String(buf.length) },
      });
    }
    return new Response(await fs.readFile(full), { headers: { ...headers, "Content-Length": String(stat.size) } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
