import type { Faq } from "@/lib/content/schemas";
import { Icon } from "@/components/ui/Icon";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  const sorted = [...faqs].sort((a, b) => a.order - b.order);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: sorted.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className="divide-y divide-navy-900/10 border-y border-navy-900/10">
        {sorted.map((f) => (
          <details key={f.id} className="group py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl text-navy-900 md:text-3xl [&::-webkit-details-marker]:hidden">
              {f.question}
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-navy-900/15 transition-transform duration-500 group-open:rotate-45">
                <Icon name="close" className="size-4 rotate-45" />
              </span>
            </summary>
            <p className="mt-4 max-w-3xl leading-relaxed text-stone">{f.answer}</p>
          </details>
        ))}
      </div>
    </>
  );
}
