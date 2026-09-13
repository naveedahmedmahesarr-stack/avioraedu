"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { consultationInputSchema } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";

const COUNTRIES = ["Pakistan", "India", "United Arab Emirates", "Saudi Arabia", "Bangladesh", "Other"];
const DESTINATIONS = ["Germany", "Italy", "Poland", "Portugal", "Austria", "Not sure yet"];
const LEVELS = ["Bachelor", "Master", "PhD", "Foundation / Studienkolleg", "Not sure yet"];
const INTAKES = ["Summer 2027", "Winter 2027/28", "Summer 2028", "Winter 2028/29", "Not decided"];

type Status = "idle" | "submitting" | "success" | "error";

export function ConsultationForm({ defaultDestination = "" }: { defaultDestination?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");

  const collect = () => {
    const fd = new FormData(formRef.current!);
    // Unselected <select>s (disabled placeholder) are omitted from FormData; treat them as empty.
    const blank = { fullName: "", email: "", phone: "", country: "", destination: "", studyLevel: "", studyField: "", intake: "", message: "" };
    return { ...blank, ...Object.fromEntries(fd), consent: fd.get("consent") === "on" } as Record<string, unknown>;
  };

  const validateField = (name: string) => {
    const parsed = consultationInputSchema.safeParse(collect());
    const issue = parsed.success ? undefined : parsed.error.issues.find((i) => i.path[0] === name);
    setErrors((prev) => {
      const next = { ...prev };
      if (issue) next[name] = issue.message;
      else delete next[name];
      return next;
    });
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = collect();
    const parsed = consultationInputSchema.safeParse(data);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[String(i.path[0])] ??= i.message));
      setErrors(fe);
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(fe)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/consultation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(json.fieldErrors ?? {});
        setServerMessage(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setServerMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="animate-fade-up rounded-[2rem] bg-white p-10 text-center md:p-14">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-navy-900 text-gold-300">
          <Icon name="check" className="size-8" />
        </span>
        <h3 className="mt-6 text-4xl text-navy-900">Thank you — your request has been received.</h3>
        <p className="mx-auto mt-3 max-w-md text-stone">A member of our team will review your details and contact you by email or phone.</p>
      </div>
    );
  }

  const describe = (n: string) => (errors[n] ? `${n}-error` : undefined);
  const Err = ({ n }: { n: string }) =>
    errors[n] ? (
      <p id={`${n}-error`} className="mt-1.5 text-sm text-danger">
        {errors[n]}
      </p>
    ) : null;

  const text = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`cf-${name}`} className="label">
        {label} <span aria-hidden className="text-gold-600">*</span>
      </label>
      <input id={`cf-${name}`} name={name} className="field" required aria-invalid={!!errors[name]} aria-describedby={describe(name)} onBlur={() => validateField(name)} {...props} />
      <Err n={name} />
    </div>
  );
  const select = (name: string, label: string, options: string[], defaultValue = "") => (
    <div>
      <label htmlFor={`cf-${name}`} className="label">
        {label} <span aria-hidden className="text-gold-600">*</span>
      </label>
      <select id={`cf-${name}`} name={name} className="field" required defaultValue={defaultValue} aria-invalid={!!errors[name]} aria-describedby={describe(name)} onBlur={() => validateField(name)}>
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <Err n={name} />
    </div>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Consultation request" className="grid gap-5 rounded-[2rem] bg-white p-6 shadow-[0_40px_80px_-50px_rgba(5,13,28,.5)] sm:grid-cols-2 md:p-10">
      {text("fullName", "Full name", { autoComplete: "name" })}
      {text("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
      {text("phone", "Phone (with country code)", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "+92 …" })}
      {select("country", "Your country", COUNTRIES)}
      {select("destination", "Preferred destination", DESTINATIONS, DESTINATIONS.includes(defaultDestination) ? defaultDestination : "")}
      {select("studyLevel", "Study level", LEVELS)}
      {text("studyField", "Study field", { placeholder: "e.g. Computer Science" })}
      {select("intake", "Preferred intake", INTAKES)}
      <div className="sm:col-span-2">
        <label htmlFor="cf-message" className="label">
          Message <span className="font-normal text-stone">(optional)</span>
        </label>
        <textarea id="cf-message" name="message" rows={4} className="field" maxLength={3000} />
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-stone">
          <input type="checkbox" name="consent" className="mt-1 size-4 accent-navy-900" aria-describedby={describe("consent")} onChange={() => errors.consent && validateField("consent")} />
          <span>
            I agree that AVIORA EDU may contact me about this enquiry and process my data as described in the{" "}
            <Link href="/legal/privacy-policy" className="text-navy-900 underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <Err n="consent" />
      </div>
      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger/5 p-4 text-sm text-danger sm:col-span-2">
          <Icon name="alert" className="mt-0.5 size-4 shrink-0" /> {serverMessage}
        </p>
      )}
      <div className="flex flex-col items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-stone">We never guarantee admission or visa outcomes.</p>
        <button type="submit" className="btn btn-gold w-full sm:w-auto" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" aria-hidden /> Sending…
            </>
          ) : (
            <>
              Request Consultation <Icon name="arrowRight" className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
