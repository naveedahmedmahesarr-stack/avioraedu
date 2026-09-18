import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const pillars: { icon: IconName; title: string; body: string }[] = [
  { icon: "eye", title: "Transparent process", body: "Clear steps, clear responsibilities and honest explanations of what we can and cannot influence." },
  { icon: "compass", title: "European destination focus", body: "Five countries, understood in depth — rather than a long list covered superficially." },
  { icon: "users", title: "Student-focused support", body: "Advice built around your profile, goals and budget, not around pushing a particular institution." },
  { icon: "file", title: "Application assistance", body: "Structured help with documents, deadlines and portals so nothing important is missed." },
  { icon: "luggage", title: "Pre-departure guidance", body: "Practical preparation for travel, accommodation, insurance and your first weeks." },
  { icon: "home", title: "Post-arrival support", body: "Help navigating the first administrative steps once you land in Europe." },
];

export function TrustSection() {
  return (
    <section aria-labelledby="trust" className="bg-sand/60 py-28 md:py-40">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why AVIORA EDU"
          align="center"
          title={<span id="trust">Guidance you can trust — because we tell you the truth.</span>}
          intro="No guaranteed admissions. No guaranteed visas. Just experienced, careful guidance at every step."
        />
        <ul className="mt-20 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 70} className="group">
              <div className="flex items-center gap-4">
                <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-300 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3">
                  <Icon name={p.icon} className="size-6" />
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
