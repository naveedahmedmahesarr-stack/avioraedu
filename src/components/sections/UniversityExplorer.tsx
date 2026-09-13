"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { University } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/ui/Flag";
import { useLocale, useUi } from "@/i18n/LocaleProvider";
import { term } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { ui } from "@/i18n/ui";

const flagFor: Record<string, string> = { Germany: "DE", Italy: "IT", Poland: "PL", Portugal: "PT", Austria: "AT" };

/** Universities arrive with German description/tuition/application text applied on German pages. */
export function UniversityCard({ u, locale }: { u: University; locale: Locale }) {
  const t = ui[locale].unis;
  const L = (v: string) => term(v, locale);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy-900/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_30px_60px_-35px_rgba(5,13,28,.45)]">
      <div className="relative h-36 overflow-hidden bg-navy-900">
        {u.image ? (
          <Image src={u.image} alt={t.campusAlt(u.name)} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(90%_120%_at_100%_0%,rgba(194,154,82,.35),transparent_60%)]" />
        )}
        <div className="absolute inset-x-5 bottom-4 flex items-center gap-2 text-xs text-ivory">
          <Flag code={flagFor[u.country] ?? ""} className="h-3.5 w-5" decorative />
          {L(u.city)}, {L(u.country)}
          <span className="ml-auto rounded-full bg-ivory/10 px-2.5 py-0.5 backdrop-blur">{L(u.institutionType)}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl leading-tight text-navy-900">{u.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone">{u.description}</p>
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-semibold text-navy-800">{t.levels}</dt>
            <dd className="text-stone">{u.studyLevels.map(L).join(", ")}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-semibold text-navy-800">{t.language}</dt>
            <dd className="text-stone">{u.language.map(L).join(", ")}</dd>
          </div>
          {u.tuition && (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-navy-800">{t.tuition}</dt>
              <dd className="text-stone">{u.tuition}</dd>
            </div>
          )}
          {u.applicationInfo && (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-navy-800">{t.apply}</dt>
              <dd className="text-stone">{u.applicationInfo}</dd>
            </div>
          )}
        </dl>
        {u.website && (
          <a href={u.website} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-navy-900 hover:text-gold-600">
            {t.website} <Icon name="arrowUpRight" className="size-4" />
            <span className="sr-only">{ui[locale].common.opensNewTab}</span>
          </a>
        )}
      </div>
    </article>
  );
}

function Select({ label, value, onChange, options, all }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; all: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{all}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function UniversityExplorer({ universities, limit }: { universities: University[]; limit?: number }) {
  const locale = useLocale();
  const t = useUi().unis;
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [field, setField] = useState("");
  const [language, setLanguage] = useState("");

  const options = useMemo(() => {
    const uniq = (xs: string[]) => [...new Set(xs)].map((v) => ({ value: v, label: term(v, locale) })).sort((a, b) => a.label.localeCompare(b.label, locale));
    return {
      country: uniq(universities.map((u) => u.country)),
      level: uniq(universities.flatMap((u) => u.studyLevels)),
      field: uniq(universities.flatMap((u) => u.fields)),
      language: uniq(universities.flatMap((u) => u.language)),
    };
  }, [universities, locale]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return universities.filter(
      (u) =>
        (!needle ||
          [u.name, u.city, term(u.city, locale), u.country, term(u.country, locale), ...u.programs, ...u.fields, ...u.fields.map((f) => term(f, locale))]
            .join(" ")
            .toLowerCase()
            .includes(needle)) &&
        (!country || u.country === country) &&
        (!level || u.studyLevels.includes(level as never)) &&
        (!field || u.fields.includes(field)) &&
        (!language || u.language.includes(language as never)),
    );
  }, [universities, q, country, level, field, language, locale]);

  const shown = limit ? results.slice(0, limit) : results;

  return (
    <div>
      <form role="search" className="grid gap-4 rounded-3xl border border-navy-900/10 bg-white/70 p-5 md:grid-cols-[1.6fr_repeat(4,1fr)] md:p-6" onSubmit={(e) => e.preventDefault()}>
        <label className="block">
          <span className="label">{t.search}</span>
          <span className="relative block">
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone" />
            <input type="search" className="field !pl-11" placeholder={t.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} />
          </span>
        </label>
        <Select label={t.country} value={country} onChange={setCountry} options={options.country} all={t.all} />
        <Select label={t.level} value={level} onChange={setLevel} options={options.level} all={t.all} />
        <Select label={t.field} value={field} onChange={setField} options={options.field} all={t.all} />
        <Select label={t.language} value={language} onChange={setLanguage} options={options.language} all={t.all} />
      </form>

      <p className="mt-6 text-sm text-stone" aria-live="polite">
        {results.length === 0 ? t.none : `${t.showing(shown.length, results.length)} ${t.feesNote}`}
      </p>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((u) => (
          <li key={u.id}>
            <UniversityCard u={u} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}
