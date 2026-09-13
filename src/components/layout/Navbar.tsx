"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { stripLocale } from "@/i18n/locales";
import { useLp, useUi } from "@/i18n/LocaleProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavKey = "studyInGermany" | "services" | "studentSupport" | "destinations" | "guides" | "founder" | "about" | "reviews" | "contact";
const items: { key: NavKey; href: string; desktop: boolean }[] = [
  { key: "studyInGermany", href: "/study-in-germany", desktop: true },
  { key: "services", href: "/services", desktop: true },
  { key: "studentSupport", href: "/student-support", desktop: true },
  { key: "destinations", href: "/destinations", desktop: true },
  { key: "guides", href: "/guides", desktop: true },
  { key: "founder", href: "/founder", desktop: true },
  { key: "about", href: "/about", desktop: false },
  { key: "reviews", href: "/reviews", desktop: false },
  { key: "contact", href: "/contact", desktop: false },
];

export function Navbar() {
  const rawPath = usePathname() ?? "/";
  const { path: pathname } = stripLocale(rawPath);
  const t = useUi();
  const href = useLp();
  const [scrolled, setScrolled] = useState(false);
  // Menu is tied to the path it was opened on, so navigating closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === rawPath;
  const setOpen = (v: boolean | ((prev: boolean) => boolean)) => setOpenOn((typeof v === "function" ? v(open) : v) ? rawPath : null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  // Homepage hero is dark; inner pages start on a dark header too, so the bar turns solid on scroll or off-home.
  const solid = scrolled || pathname !== "/";
  const isActive = (h: string) => pathname === h || pathname.startsWith(`${h}/`);
  const mobile = [{ key: "home" as const, href: "/" }, ...items];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500 print:hidden ${
          solid ? "bg-navy-950/85 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,.6)] backdrop-blur-xl" : "bg-transparent py-5"
        }`}
      >
        <nav aria-label={t.nav.main} className="container-x flex items-center justify-between gap-5">
          <Link href={href("/")} aria-label={t.nav.homeAria} className="shrink-0 rounded-md">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-0.5 xl:flex">
            {items
              .filter((i) => i.desktop)
              .map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={href(item.href)}
                      aria-current={active ? "page" : undefined}
                      className={`group relative whitespace-nowrap rounded-full px-3 py-2 text-[0.8rem] font-medium tracking-wide transition-colors 2xl:px-3.5 ${
                        active ? "text-gold-300" : "text-ivory/80 hover:text-ivory"
                      }`}
                    >
                      {t.nav[item.key]}
                      <span
                        aria-hidden
                        className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gold-400 transition-transform duration-500 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                      />
                    </Link>
                  </li>
                );
              })}
          </ul>

          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden sm:flex" />
            <Link href={href("/contact#consultation")} className="btn btn-gold hidden !min-h-10 whitespace-nowrap !px-5 !text-[0.8rem] !tracking-[0.05em] md:inline-flex">
              {t.nav.book}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-12 items-center justify-center rounded-full border border-ivory/20 text-ivory transition-colors hover:border-gold-300/60 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become the containing block for this fixed panel. */}
      <div id="mobile-menu" ref={panelRef} hidden={!open} className="fixed inset-0 z-40 overflow-y-auto bg-navy-950 xl:hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_100%_0%,rgba(194,154,82,.14),transparent_70%)]" />
        <div className="container-x relative flex min-h-full flex-col pb-10 pt-28">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-gold-300/80">{t.nav.menu}</p>
            <LanguageSwitcher />
          </div>
          <ul className="mt-4 flex flex-col">
            {mobile.map((item, i) => {
              const active = item.href === "/" ? pathname === "/" : isActive(item.href);
              return (
                <li key={item.href} className="animate-fade-up border-b border-ivory/10" style={{ animationDelay: `${i * 30}ms` }}>
                  <Link
                    href={href(item.href)}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-baseline gap-4 py-3.5 font-display text-[1.85rem] leading-none transition-colors ${active ? "text-gold-300" : "text-ivory hover:text-gold-300"}`}
                  >
                    <span className="w-6 font-sans text-[0.65rem] tracking-[0.2em] text-ivory/35">{String(i + 1).padStart(2, "0")}</span>
                    {t.nav[item.key]}
                    <Icon name="arrowRight" className="ml-auto size-5 self-center text-gold-400/70 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto pt-10">
            <Link href={href("/contact#consultation")} className="btn btn-gold w-full">
              {t.nav.bookFree}
            </Link>
            <p className="mt-4 text-center text-xs text-navy-300">{t.nav.menuTagline}</p>
          </div>
        </div>
      </div>
    </>
  );
}
