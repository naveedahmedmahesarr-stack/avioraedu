import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { getUi } from "@/i18n/server";

const icons: IconName[] = ["eye", "compass", "users", "file", "luggage", "home"];

export async function TrustSection() {
  const { t } = await getUi();
  const s = t.trust;
  return (
    <section aria-labelledby="trust" className="bg-sand/60 py-28 md:py-40">
      <div className="container-x">
        <SectionHeading eyebrow={s.eyebrow} align="center" title={<span id="trust">{s.title}</span>} intro={s.intro} />
        <ul className="mt-20 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {s.pillars.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 70} className="group">
              <div className="flex items-center gap-4">
                <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-300 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3">
                  <Icon name={icons[i]} className="size-6" />
                </span>
                <span className="hairline flex-1" aria-hidden />
              </div>
              <h3 className="mt-6 text-3xl text-navy-900">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-stone">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
