import { NextResponse } from "next/server";
import { consultationInputSchema } from "@/lib/content/schemas";
import { create, StorageUnavailableError } from "@/lib/content/store";
import { emailConfigured, sendConsultationEmail } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`consult:${clientIp(req)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = consultationInputSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    // Honeypot filled: respond like a validation failure without revealing why.
    return NextResponse.json({ error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const input = parsed.data;
  let stored = false;
  let emailed = false;
  let storageError: string | null = null;

  try {
    await create("submissions", { ...input, company: undefined, consent: undefined, status: "new", published: false });
    stored = true;
  } catch (err) {
    storageError = err instanceof StorageUnavailableError ? err.message : "storage failed";
    console.error("[consultation] storage error:", err);
  }

  if (emailConfigured()) {
    try {
      await sendConsultationEmail(input);
      emailed = true;
    } catch (err) {
      console.error("[consultation] email error:", err);
    }
  }

  if (!stored && !emailed) {
    return NextResponse.json(
      {
        error:
          "Your request could not be delivered because the consultation inbox is not configured yet. Please try again later or contact us directly.",
        configurationRequired: true,
        detail: process.env.NODE_ENV === "development" ? storageError : undefined,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, stored, emailed });
}
