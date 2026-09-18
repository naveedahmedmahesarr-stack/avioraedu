import { NextResponse } from "next/server";
import { adminConfigured, createSessionToken, SESSION_COOKIE, verifyPassword } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      {
        error:
          "CONFIGURATION REQUIRED: set ADMIN_PASSWORD (10+ chars) and ADMIN_SESSION_SECRET (32+ chars) in your environment, then restart the server.",
        configurationRequired: true,
      },
      { status: 503 },
    );
  }
  if (!rateLimit(`login:${clientIp(req)}`, 8, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  if (typeof body.password !== "string" || !(await verifyPassword(body.password))) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }
  const { token, maxAge } = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
