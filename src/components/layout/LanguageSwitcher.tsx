"use client";

import { usePathname } from "next/navigation";
import { lp, stripLocale } from "@/i18n/locales";
import { useLocale, useUi } from "@/i18n/LocaleProvider";

/**
 * English | Deutsch. Uses a full page load (plain <a>) so the whole document — <html lang>,
 * metadata and every server component — switches language together.
 */
export function LanguageSwitcher({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const pathname = usePathname() ?? "/";
  const locale = useLocale();
  const t = useUi();
  const { path } = stripLocale(pathname);
  const item = (target: "en" | "de", label: string, short: string) => {
    const active = locale === target;
    const cls = `rounded-full px-2.5 py-1 transition-colors ${
      active ? (tone === "light" ? "bg-ivory/10 text-gold-300" : "bg-navy-900 text-ivory") : tone === "light" ? "text-ivory/65 hover:text-ivory" : "text-stone hover:text-navy-900"
    }`;
    return active ? (
      <span aria-current="true" className={cls}>
        <span aria-hidden>{short}</span>
        <span className="sr-only">{label}</span>
      </span>
    ) : (
      <a href={lp(target, path)} hrefLang={target} lang={target} className={cls}>
        <span aria-hidden>{short}</span>
        <span className="sr-only">{label}</span>
      </a>
    );
  };
  return (
    <nav aria-label={t.lang.label} className={`flex items-center gap-0.5 text-[0.72rem] font-semibold tracking-[0.14em] ${className}`}>
      {item("en", t.lang.en, "EN")}
      <span aria-hidden className={tone === "light" ? "text-ivory/25" : "text-navy-900/25"}>
        |
      </span>
      {item("de", t.lang.de, "DE")}
    </nav>
  );
}
