import { NextResponse } from "next/server";
import { isCollection } from "@/lib/content/schemas";
import { getById, remove, update } from "@/lib/content/store";
import { deleteUploadedFile } from "@/lib/media/files";
import { adminError } from "../../errors";

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/[collection]/[id]">) {
  const { collection, id } = await ctx.params;
  if (!isCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  try {
    const item = await update(collection, id, await req.json());
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch (err) {
    return adminError(err);
  }
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/[collection]/[id]">) {
  const { collection, id } = await ctx.params;
  if (!isCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  try {
    const media = collection === "media" ? await getById("media", id) : null;
    const ok = await remove(collection, id);
    // Free the stored files once the record is gone.
    if (ok && media) await Promise.all([deleteUploadedFile(media.src), deleteUploadedFile(media.poster)]);
    return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    return adminError(err);
  }
}
