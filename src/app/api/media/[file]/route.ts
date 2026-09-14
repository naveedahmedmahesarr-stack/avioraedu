import { readMedia } from "@/lib/content/store";

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
  const data = await readMedia(file);
  if (!data) return new Response("Not found", { status: 404 });
  const headers: Record<string, string> = {
    "Content-Type": TYPES[file.split(".").pop()!],
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
    // Uploaded files include redacted visa documents: keep them out of image search results.
    "X-Robots-Tag": "noindex, noimageindex",
  };
  const range = req.headers.get("range");
  const m = range?.match(/bytes=(\d*)-(\d*)/);
  if (m) {
    const start = m[1] ? Number(m[1]) : 0;
    const end = m[2] ? Math.min(Number(m[2]), data.length - 1) : data.length - 1;
    const part = data.subarray(start, end + 1);
    return new Response(new Uint8Array(part), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${data.length}`, "Content-Length": String(part.length) },
    });
  }
  return new Response(new Uint8Array(data), { headers: { ...headers, "Content-Length": String(data.length) } });
}
