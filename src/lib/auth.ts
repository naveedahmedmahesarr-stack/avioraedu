/**
 * Minimal, dependency-free admin session using an HMAC-signed cookie.
 * Uses Web Crypto so it runs in both the Node runtime and proxy.ts.
 *
 * CONFIGURATION REQUIRED: set ADMIN_PASSWORD (min 10 chars) and
 * ADMIN_SESSION_SECRET (min 32 random chars). Without them the admin area
 * stays locked — there is no default password.
 */
export const SESSION_COOKIE = "aviora_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export function adminConfigured() {
  return (process.env.ADMIN_PASSWORD ?? "").length >= 10 && (process.env.ADMIN_SESSION_SECRET ?? "").length >= 32;
}

const enc = new TextEncoder();

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(process.env.ADMIN_SESSION_SECRET ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Buffer.from(sig).toString("base64url");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function createSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin.${exp}`;
  return { token: `${payload}.${await hmac(payload)}`, maxAge: SESSION_TTL_SECONDS };
}

export async function verifySessionToken(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [sub, exp, sig] = parts;
  if (sub !== "admin" || Number(exp) < Date.now() / 1000) return false;
  return timingSafeEqual(sig, await hmac(`${sub}.${exp}`));
}

export async function verifyPassword(input: string) {
  if (!adminConfigured()) return false;
  // Compare HMAC digests so comparison time does not depend on the password.
  const [a, b] = await Promise.all([hmac(`pw:${input}`), hmac(`pw:${process.env.ADMIN_PASSWORD}`)]);
  return timingSafeEqual(a, b);
}
