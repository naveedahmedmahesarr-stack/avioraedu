"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "aviora-consent-v1";

/**
 * The site currently uses only strictly necessary storage (this choice, and the
 * admin session cookie for administrators). No analytics or marketing scripts
 * are loaded. If you add any, gate them on `readConsent() === "accepted"`.
 */
export function readConsent(): "accepted" | "declined" | null {
  try {
    return (localStorage.getItem(KEY) as "accepted" | "declined" | null) ?? null;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (readConsent() === null) {
      const t = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  const choose = (v: "accepted" | "declined") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="animate-fade-up fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-gold-300/20 bg-navy-950/95 p-5 text-ivory shadow-2xl backdrop-blur-xl sm:bottom-6"
    >
      <p className="text-sm leading-relaxed text-ivory/85">
        We use only essential storage to run this site. Optional analytics are not enabled. See our{" "}
        <Link href="/legal/cookie-policy" className="text-gold-300 underline underline-offset-4">
          Cookie Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="btn btn-outline !min-h-11 !border-ivory/25 !text-ivory" onClick={() => choose("declined")}>
          Essential only
        </button>
        <button type="button" className="btn btn-gold !min-h-11" onClick={() => choose("accepted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
