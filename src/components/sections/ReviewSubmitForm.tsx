"use client";

import { useState } from "react";
import { reviewInputSchema } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";

type Status = "idle" | "submitting" | "success" | "error";

export function ReviewSubmitForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(fd), rating, consent: fd.get("consent") === "on" };
    const parsed = reviewInputSchema.safeParse(data);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[String(i.path[0])] ??= i.message));
      setErrors(fe);
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(json.fieldErrors ?? {});
        setMessage(json.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-success/30 bg-white p-8">
        <Icon name="check" className="size-8 text-success" />
        <h3 className="mt-4 text-3xl text-navy-900">Thank you for your review.</h3>
        <p className="mt-2 text-stone">It has been received and will be published after moderation.</p>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`rv-${k}-err`} className="mt-1.5 text-sm text-danger">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-3xl border border-navy-900/10 bg-white p-6 md:grid-cols-2 md:p-8">
      <div>
        <label htmlFor="rv-name" className="label">Your name</label>
        <input id="rv-name" name="name" className="field" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "rv-name-err" : undefined} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="rv-country" className="label">Country</label>
        <input id="rv-country" name="country" className="field" autoComplete="country-name" aria-invalid={!!errors.country} aria-describedby={errors.country ? "rv-country-err" : undefined} />
        {err("country")}
      </div>
      <fieldset className="md:col-span-2">
        <legend className="label">Rating</legend>
        <div className="flex gap-1" role="radiogroup">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              className="inline-flex size-11 items-center justify-center rounded-full text-gold-500 hover:bg-sand"
            >
              <Icon name="star" className={`size-6 ${n <= rating ? "fill-current" : ""}`} strokeWidth={1.3} />
            </button>
          ))}
        </div>
        {err("rating")}
      </fieldset>
      <div className="md:col-span-2">
        <label htmlFor="rv-review" className="label">Your experience</label>
        <textarea id="rv-review" name="review" rows={5} className="field" aria-invalid={!!errors.review} aria-describedby={errors.review ? "rv-review-err" : undefined} />
        {err("review")}
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="flex items-start gap-3 text-sm text-stone md:col-span-2">
        <input type="checkbox" name="consent" className="mt-1 size-4 accent-navy-900" />
        I confirm this review describes my own experience and agree that it may be published with my first name and country after moderation.
      </label>
      {err("consent")}
      {status === "error" && (
        <p role="alert" className="text-sm text-danger md:col-span-2">
          {message}
        </p>
      )}
      <div className="md:col-span-2">
        <button type="submit" className="btn btn-navy" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </form>
  );
}
