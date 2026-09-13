import { NextResponse } from "next/server";
import { isCollection } from "@/lib/content/schemas";
import { remove, update } from "@/lib/content/store";
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
    const ok = await remove(collection, id);
    return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    return adminError(err);
  }
}
