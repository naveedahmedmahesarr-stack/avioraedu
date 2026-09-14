import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";

/** Real 404 status (set by Next.js). Offers the main sections so visitors and crawlers are not left at a dead end. */
export default async function NotFound() {
  const { locale, t } = await getUi();
  const links = [
    { href: "/study-in-germany", label: t.nav.studyInGermany },
    { href: "/services", label: t.nav.services },
    { href: "/guides", label: t.nav.guides },
    { href: "/dream-stories", label: t.nav.dreamStories },
  ];
  return (
    <>
      <PageHeader eyebrow="404" title={t.notFound.title} intro={t.notFound.intro} />
      <section className="bg-ivory py-20">
        <div className="container-x">
          <div className="flex flex-wrap gap-3">
            <Link href={lp(locale, "/")} className="btn btn-navy">
              {t.common.backHome}
            </Link>
            <Link href={lp(locale, "/contact#consultation")} className="btn btn-outline">
              {t.nav.contact}
            </Link>
          </div>
          <nav aria-label={t.common.related} className="mt-12">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={lp(locale, l.href)} className="group flex items-center justify-between gap-3 rounded-2xl border border-navy-900/10 bg-white p-5 font-semibold text-navy-900 transition-colors hover:border-gold-500/50">
                    {l.label}
                    <Icon name="arrowRight" className="size-4 shrink-0 text-gold-600 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
