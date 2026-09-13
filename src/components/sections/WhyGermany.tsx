import Link from "next/link";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";

const reasons: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "graduation",
    title: "Public universities",
    body: "Most public universities charge no general tuition for most programmes. A semester contribution applies, and some states charge non-EU students — we explain what applies to you.",
  },
  { icon: "flask", title: "Research environment", body: "A dense network of universities and research institutes, with strong links between academia and industry." },
  { icon: "briefcase", title: "Career opportunities", body: "Graduates may apply for a residence permit to look for qualified work after completing their degree, subject to current rules." },
  { icon: "globe", title: "International community", body: "Hundreds of thousands of international students, with English-taught programmes especially common at master's level." },
  { icon: "book", title: "Different pathways", body: "Research universities, Universities of Applied Sciences, and preparatory routes such as Studienkolleg where required." },
  { icon: "shield", title: "Degree recognition", body: "Bachelor's and master's degrees follow the Bologna structure used across the European Higher Education Area." },
];

export function WhyGermany() {
  return (
    <section aria-labelledby="why-germany" className="relative overflow-hidden bg-ivory py-28 md:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.35fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Why Germany"
            title={
              <span id="why-germany">
                Europe&apos;s most compelling place to <em className="text-gold-600">study</em>.
              </span>
            }
            intro="Germany remains a first choice for ambitious international students. Here is what makes it strong — stated plainly, without overpromising."
          />
          <Reveal delay={150}>
            <Link href="/study-in-germany" className="btn btn-navy mt-10">
              Study in Germany <Icon name="arrowRight" className="size-4" />
            </Link>
          </Reveal>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-3xl bg-navy-900/10 sm:grid-cols-2">
          {reasons.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 70} className="group bg-ivory p-8 transition-colors duration-500 hover:bg-white md:p-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex size-12 items-center justify-center rounded-full border border-gold-500/40 text-gold-600 transition-colors group-hover:bg-navy-900 group-hover:text-gold-300">
                  <Icon name={r.icon} />
                </span>
                <span className="font-display text-2xl text-navy-900/25">0{i + 1}</span>
              </div>
              <h3 className="mt-8 text-3xl text-navy-900">{r.title}</h3>
              <p className="mt-3 leading-relaxed text-stone">{r.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
