"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLp, useUi } from "@/i18n/LocaleProvider";

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
  const t = useUi().cookie;
  const href = useLp();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (readConsent() === null) {
      const timer = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(timer);
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
      aria-label={t.region}
      className="animate-fade-up fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-gold-300/20 bg-navy-950/95 p-4 text-ivory shadow-2xl backdrop-blur-xl sm:bottom-6 sm:flex-row sm:items-center sm:gap-5 sm:p-5 print:hidden"
    >
      <p className="text-xs leading-relaxed text-ivory/85 sm:text-sm">
        {t.text}{" "}
        <Link href={href("/legal/cookie-policy")} className="text-gold-300 underline underline-offset-4">
          {t.policy}
        </Link>
      </p>
      <div className="flex shrink-0 gap-2">
        <button type="button" className="btn btn-outline !min-h-10 flex-1 !px-4 !text-[0.78rem] !border-ivory/25 !text-ivory sm:flex-none" onClick={() => choose("declined")}>
          {t.essential}
        </button>
        <button type="button" className="btn btn-gold !min-h-10 flex-1 !px-5 !text-[0.78rem] sm:flex-none" onClick={() => choose("accepted")}>
          {t.accept}
        </button>
      </div>
    </div>
  );
}
