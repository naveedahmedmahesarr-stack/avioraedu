import Link from "next/link";
import { markets } from "@/lib/content/markets";
import { marketName } from "@/lib/content/markets.de";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/Reveal";

/** Internal links to the country landing pages. */
export async function CountryLinks({ exclude, tone = "sand" }: { exclude?: string; tone?: "sand" | "ivory" }) {
  const { locale, t } = await getUi();
  const c = t.countryLinks;
  const items = markets.filter((m) => m.slug !== exclude);
  return (
    <section aria-labelledby="study-from" className={`${tone === "sand" ? "bg-sand/50" : "bg-ivory"} py-20 md:py-28`}>
      <div className="container-x">
        <SectionHeading eyebrow={c.eyebrow} title={<span id="study-from">{c.title}</span>} intro={c.intro} />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((m) => (
            <li key={m.slug}>
              <Link
                href={lp(locale, `/study-in-germany/from/${m.slug}`)}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-navy-900/10 bg-white px-5 py-4 text-navy-900 transition-colors hover:border-gold-500/40"
              >
                <span className="font-display text-xl">{marketName(m.slug, locale, "from")}</span>
                <Icon name="arrowRight" className="size-4 shrink-0 text-gold-600 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
