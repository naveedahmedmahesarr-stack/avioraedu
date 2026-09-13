import { Reveal } from "@/components/ui/Reveal";

export function IntroStatement({ text }: { text: string }) {
  return (
    <section aria-label="Introduction" className="relative bg-navy-950 pb-28 pt-10 text-ivory md:pb-40">
      <div className="container-x">
        <div className="hairline mb-16" />
        <Reveal>
          <p className="mx-auto max-w-5xl text-center font-display text-[clamp(1.8rem,3.6vw,3.2rem)] leading-[1.18] text-ivory/90">
            {text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
