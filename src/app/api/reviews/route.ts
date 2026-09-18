import { NextResponse } from "next/server";
import { reviewInputSchema } from "@/lib/content/schemas";
import { create, StorageUnavailableError } from "@/lib/content/store";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** Public review submission. Reviews are stored as pending and never auto-published. */
export async function POST(req: Request) {
  if (!rateLimit(`review:${clientIp(req)}`, 3, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }
  const parsed = reviewInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0] ?? "form")] ??= i.message;
    return NextResponse.json({ error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }
  const { name, country, rating, review } = parsed.data;
  try {
    await create("reviews", {
      name,
      country,
      rating,
      review,
      source: "website",
      status: "pending",
      verified: false,
      published: false,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[reviews] storage error:", err);
    const configurationRequired = err instanceof StorageUnavailableError;
    return NextResponse.json(
      { error: "Your review could not be saved right now. Please try again later.", configurationRequired },
      { status: configurationRequired ? 503 : 500 },
    );
  }
}
