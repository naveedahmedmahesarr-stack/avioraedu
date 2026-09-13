import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { getUi } from "@/i18n/server";
import { lp } from "@/i18n/locales";

export default async function NotFound() {
  const { locale, t } = await getUi();
  return (
    <>
      <PageHeader eyebrow="404" title={t.notFound.title} intro={t.notFound.intro} />
      <section className="bg-ivory py-20">
        <div className="container-x">
          <Link href={lp(locale, "/")} className="btn btn-navy">
            {t.common.backHome}
          </Link>
        </div>
      </section>
    </>
  );
}
