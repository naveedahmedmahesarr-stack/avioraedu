"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

export function Reveal({
  children,
  as = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  // Visibility lives in React state (not a DOM class toggle) so re-renders can never hide revealed content.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => setVisible(true);
    if (!("IntersectionObserver" in window)) {
      const t = setTimeout(show, 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      // Anything already above the fold's bottom edge (including content jumped past) reveals immediately.
      { rootMargin: "0px 0px -4% 0px", threshold: 0 },
    );
    io.observe(el);
    const passed = () => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        show();
        io.disconnect();
        window.removeEventListener("scroll", passed);
      }
    };
    window.addEventListener("scroll", passed, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", passed);
    };
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  align = "left",
  as: H = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  const center = align === "center";
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}>
      <p className={`eyebrow ${tone === "light" ? "text-gold-300" : "text-gold-600"} flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className={`h-px w-8 ${tone === "light" ? "bg-gold-300/60" : "bg-gold-600/60"}`} aria-hidden />
        {eyebrow}
      </p>
      <H className={`mt-5 text-[clamp(2.3rem,5vw,4.2rem)] leading-[1.02] ${tone === "light" ? "text-ivory" : "text-navy-900"}`}>{title}</H>
      {intro ? (
        <p className={`mt-6 text-lg leading-relaxed ${tone === "light" ? "text-navy-300" : "text-stone"}`}>{intro}</p>
      ) : null}
    </Reveal>
  );
}
