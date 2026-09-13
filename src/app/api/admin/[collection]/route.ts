import { NextResponse } from "next/server";
import { isCollection } from "@/lib/content/schemas";
import { create, list } from "@/lib/content/store";
import { adminError } from "../errors";

// Auth is enforced in src/proxy.ts for every /api/admin/* route.

export async function GET(_req: Request, ctx: RouteContext<"/api/admin/[collection]">) {
  const { collection } = await ctx.params;
  if (!isCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  return NextResponse.json({ items: await list(collection) });
}

export async function POST(req: Request, ctx: RouteContext<"/api/admin/[collection]">) {
  const { collection } = await ctx.params;
  if (!isCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  try {
    const item = await create(collection, await req.json());
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return adminError(err);
  }
}
