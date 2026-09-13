"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/config";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Menu is tied to the path it was opened on, so navigating closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean | ((prev: boolean) => boolean)) =>
    setOpenOn((typeof v === "function" ? v(open) : v) ? pathname : null);
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

  // Homepage hero is dark; inner pages start on ivory, so the bar is solid there.
  const solid = scrolled || pathname !== "/";

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500 ${
        solid ? "bg-navy-950/85 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,.6)] backdrop-blur-xl" : "bg-transparent py-5"
      }`}
    >
      <nav aria-label="Main" className="container-x flex items-center justify-between gap-6">
        <Link href="/" aria-label="AVIORA EDU — home" className="shrink-0 rounded-md">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {navItems.slice(1).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative rounded-full px-3 py-2 text-[0.82rem] font-medium tracking-wide transition-colors ${
                    active ? "text-gold-300" : "text-ivory/80 hover:text-ivory"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gold-400 transition-transform duration-500 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/contact#consultation" className="btn btn-gold hidden !min-h-10 !px-5 !text-[0.8rem] !tracking-[0.05em] sm:inline-flex">
            Book a Consultation
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full border border-ivory/20 text-ivory xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </nav>
    </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become the containing block for this fixed panel. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 z-40 overflow-y-auto bg-navy-950 xl:hidden"
      >
        <div className="container-x flex h-full flex-col pb-10 pt-28">
          <ul className="flex flex-col">
            {navItems.map((item, i) => (
              <li key={item.href} className="animate-fade-up border-b border-ivory/10" style={{ animationDelay: `${i * 40}ms` }}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-center justify-between py-4 font-display text-3xl text-ivory"
                >
                  {item.label}
                  <Icon name="arrowRight" className="size-5 text-gold-400" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact#consultation" className="btn btn-gold mt-auto w-full">
            Book a Consultation
          </Link>
        </div>
      </div>
    </>
  );
}
