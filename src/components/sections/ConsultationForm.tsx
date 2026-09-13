"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { consultationInputSchema } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";
import { useLocale, useLp, useUi } from "@/i18n/LocaleProvider";
import { term } from "@/i18n/content";

// Stored values stay in English (Admin, email notifications); only the labels are translated.
const COUNTRIES = ["Pakistan", "India", "Bangladesh", "United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Bahrain", "Other"];
const DESTINATIONS = ["Germany", "Italy", "Poland", "Portugal", "Austria", "Not sure yet"];
const LEVELS = ["Bachelor", "Master", "PhD", "Foundation / Studienkolleg", "Not sure yet"];
const INTAKES = ["Summer 2027", "Winter 2027/28", "Summer 2028", "Winter 2028/29", "Not decided"];

type Status = "idle" | "submitting" | "success" | "error";

export function ConsultationForm({ defaultDestination = "" }: { defaultDestination?: string }) {
  const locale = useLocale();
  const ui = useUi();
  const t = ui.form;
  const href = useLp();
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
  const msg = (field: string) => t.errors[field] ?? t.generic;

  const validateField = (name: string) => {
    const parsed = consultationInputSchema.safeParse(collect());
    const issue = parsed.success ? undefined : parsed.error.issues.find((i) => i.path[0] === name);
    setErrors((prev) => {
      const next = { ...prev };
      if (issue) next[name] = msg(name);
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
      parsed.error.issues.forEach((i) => (fe[String(i.path[0])] ??= msg(String(i.path[0]))));
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
        setErrors(Object.fromEntries(Object.keys(json.fieldErrors ?? {}).map((k) => [k, msg(k)])));
        setServerMessage(res.status === 429 ? t.tooMany : res.status === 422 ? t.generic : res.status === 503 ? t.unavailable : t.failed);
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setServerMessage(t.network);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="animate-fade-up rounded-3xl border border-gold-300/20 bg-ivory p-10 text-center md:p-14">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full border border-gold-500/40 text-gold-600">
          <Icon name="check" className="size-7" />
        </span>
        <h3 className="mt-6 text-4xl text-navy-900">{t.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-stone">{t.successBody}</p>
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
  const select = (name: string, label: string, options: { value: string; label: string }[], defaultValue = "") => (
    <div>
      <label htmlFor={`cf-${name}`} className="label">
        {label} <span aria-hidden className="text-gold-600">*</span>
      </label>
      <select id={`cf-${name}`} name={name} className="field" required defaultValue={defaultValue} aria-invalid={!!errors[name]} aria-describedby={describe(name)} onBlur={() => validateField(name)}>
        <option value="" disabled>
          {t.select}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Err n={name} />
    </div>
  );
  const opts = (values: string[], map?: Record<string, string>) => values.map((v) => ({ value: v, label: map?.[v] ?? term(v, locale) }));

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label={t.aria} className="grid gap-8 rounded-3xl bg-ivory p-6 shadow-[0_40px_80px_-50px_rgba(0,0,0,.6)] sm:p-8 md:p-10">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 flex w-full items-center gap-3 sm:col-span-2">
          <span className="font-display text-lg text-gold-600">01</span>
          <span className="eyebrow text-navy-900">{t.aboutYou}</span>
          <span aria-hidden className="h-px flex-1 bg-navy-900/10" />
        </legend>
        {text("fullName", t.fullName, { autoComplete: "name" })}
        {text("email", t.email, { type: "email", autoComplete: "email", inputMode: "email" })}
        {text("phone", t.phone, { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: t.phonePlaceholder })}
        {select("country", t.country, opts(COUNTRIES))}
      </fieldset>
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 flex w-full items-center gap-3 sm:col-span-2">
          <span className="font-display text-lg text-gold-600">02</span>
          <span className="eyebrow text-navy-900">{t.yourPlans}</span>
          <span aria-hidden className="h-px flex-1 bg-navy-900/10" />
        </legend>
        {select("destination", t.destination, opts(DESTINATIONS), DESTINATIONS.includes(defaultDestination) ? defaultDestination : "")}
        {select("studyLevel", t.studyLevel, opts(LEVELS, t.levels))}
        {text("studyField", t.studyField, { placeholder: t.studyFieldPlaceholder })}
        {select("intake", t.intake, opts(INTAKES, t.intakes))}
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className="label">
            {t.message} <span className="font-normal normal-case tracking-normal text-stone">{t.optional}</span>
          </label>
          <textarea id="cf-message" name="message" rows={4} className="field" maxLength={3000} placeholder={t.messagePlaceholder} />
        </div>
      </fieldset>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label className="flex items-start gap-3 text-sm text-stone">
          <input type="checkbox" name="consent" className="mt-1 size-4 accent-navy-900" aria-describedby={describe("consent")} onChange={() => errors.consent && validateField("consent")} />
          <span>
            {t.consentBefore}{" "}
            <Link href={href("/legal/privacy-policy")} className="text-navy-900 underline underline-offset-4">
              {t.privacyLink}
            </Link>
            .
          </span>
        </label>
        <Err n="consent" />
      </div>
      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger/5 p-4 text-sm text-danger">
          <Icon name="alert" className="mt-0.5 size-4 shrink-0" /> {serverMessage}
        </p>
      )}
      <div className="flex flex-col items-start gap-4 border-t border-navy-900/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-stone">{t.note}</p>
        <button type="submit" className="btn btn-gold w-full sm:w-auto" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" aria-hidden /> {t.sending}
            </>
          ) : (
            <>
              {t.submit} <Icon name="arrowRight" className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
