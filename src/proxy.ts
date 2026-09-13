import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { LOCALE_HEADER, stripLocale } from "@/i18n/locales";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CSRF defence in depth (on top of SameSite=Strict): every state-changing API call —
  // admin and public forms alike — must come from this site's own origin when an Origin is sent.
  if (pathname.startsWith("/api/") && !["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (origin) {
      let sameSite = false;
      try {
        sameSite = new URL(origin).host === host;
      } catch {}
      if (!sameSite) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Language: "/de/*" renders the same routes in German. Admin and API have no German prefix.
  const { locale, path } = stripLocale(pathname);
  if (locale === "de" && (path.startsWith("/admin") || path.startsWith("/api"))) {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  }

  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
  if (isAdmin && !isLogin) {
    const ok = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!ok) {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Never trust a locale header sent by the client; only the "/de" prefix sets it.
  const headers = new Headers(request.headers);
  headers.delete(LOCALE_HEADER);
  if (locale === "de") {
    headers.set(LOCALE_HEADER, "de");
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.rewrite(url, { request: { headers } });
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|draco/|favicon.ico).*)"],
};
