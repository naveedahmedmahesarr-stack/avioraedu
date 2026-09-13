"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

const steps: { title: string; body: string; icon: IconName }[] = [
  { title: "Free Consultation", body: "A conversation about your goals, background, budget and preferred destinations.", icon: "users" },
  { title: "Profile Assessment", body: "We review your academic records, language scores and experience against typical entry requirements.", icon: "eye" },
  { title: "University & Program Selection", body: "A realistic shortlist that balances ambition, eligibility, cost and career goals.", icon: "compass" },
  { title: "Document Preparation", body: "Guidance on CVs, motivation letters, certificates, translations and recognition steps.", icon: "file" },
  { title: "Application Submission", body: "Support submitting complete, on-time applications via university portals or uni-assist.", icon: "send" },
  { title: "Admission Decision", body: "Universities make the decision. We help you understand offers and next steps.", icon: "graduation" },
  { title: "Visa Guidance", body: "Clear explanations of requirements such as financial proof and health insurance. Decisions rest with the authorities.", icon: "passport" },
  { title: "Pre-Departure Support", body: "Accommodation search tips, packing lists, travel planning and what to expect on arrival.", icon: "luggage" },
  { title: "Arrival in Europe", body: "Help with first steps like address registration, bank account and enrolment.", icon: "plane" },
];

export function AdmissionTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const [fill, setFill] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const mid = window.innerHeight * 0.55;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      setFill(p);
      const items = el.querySelectorAll("li");
      let a = 0;
      items.forEach((li, i) => {
        if (li.getBoundingClientRect().top < mid) a = i;
      });
      setActiveStep(a);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ol ref={ref} className="relative mx-auto max-w-5xl">
      <div aria-hidden className="absolute bottom-0 left-6 top-0 w-px bg-ivory/10 md:left-1/2">
        <div className="w-full origin-top bg-gradient-to-b from-gold-300 to-gold-500" style={{ height: `${fill * 100}%` }} />
      </div>
      {steps.map((s, i) => {
        const on = i <= activeStep;
        const right = i % 2 === 1;
        return (
          <li key={s.title} className="relative grid py-8 pl-20 md:grid-cols-2 md:gap-20 md:pl-0">
            <span
              aria-hidden
              className={`absolute left-6 top-9 flex size-12 -translate-x-1/2 items-center justify-center rounded-full border transition-all duration-700 md:left-1/2 ${
                on ? "border-gold-400 bg-navy-900 text-gold-300 shadow-[0_0_0_8px_rgba(194,154,82,.12)]" : "border-ivory/15 bg-navy-950 text-ivory/40"
              }`}
            >
              <Icon name={s.icon} className="size-5" />
            </span>
            <div className={`${right ? "md:col-start-2" : "md:text-right"} transition-all duration-700 ${on ? "opacity-100" : "opacity-45"}`}>
              <p className="eyebrow text-gold-300">Step {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-3xl text-ivory md:text-4xl">{s.title}</h3>
              <p className={`mt-3 max-w-md leading-relaxed text-navy-300 ${right ? "" : "md:ml-auto"}`}>{s.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
