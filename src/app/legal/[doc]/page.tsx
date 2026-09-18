import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";

/**
 * LEGAL TEMPLATES — CONFIGURATION REQUIRED.
 * These pages provide structure only. Company details must be filled in and
 * the text reviewed by a qualified lawyer before launch (e.g. German TMG/DDG
 * Impressum and GDPR requirements if operating in or targeting the EU).
 */
const Req = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded bg-gold-300/40 px-1.5 py-0.5 font-semibold text-navy-900">CONFIGURATION REQUIRED: {children}</span>
);

const docs = {
  "privacy-policy": {
    title: "Privacy Policy",
    body: (
      <>
        <p>
          This policy explains how AVIORA EDU (“we”) processes personal data submitted through this website. <Req>controller name, address and contact</Req>
        </p>
        <h2>Data we collect</h2>
        <ul className="list-disc pl-6">
          <li>Consultation requests: name, email, phone, country, study preferences and your message.</li>
          <li>Review submissions: name, country, rating and review text.</li>
          <li>Technical data necessary to deliver the site (e.g. server logs).</li>
        </ul>
        <h2>Purpose and legal basis</h2>
        <p>We use your data to respond to your enquiry and provide consultancy services (pre-contractual measures / consent). <Req>confirm legal bases with counsel</Req></p>
        <h2>Storage and recipients</h2>
        <p>Submissions are stored on our hosting infrastructure and, if enabled, delivered by email via our email provider. <Req>hosting provider, email provider, retention period</Req></p>
        <h2>Your rights</h2>
        <p>You may request access, correction, deletion, restriction or portability of your data, and object to processing. <Req>contact for data requests, supervisory authority</Req></p>
      </>
    ),
  },
  imprint: {
    title: "Imprint",
    body: (
      <>
        <p><Req>legal company name and legal form</Req></p>
        <p><Req>registered address</Req></p>
        <p><Req>represented by (managing director)</Req></p>
        <p><Req>contact email and phone</Req></p>
        <p><Req>commercial register and number, VAT ID (if applicable)</Req></p>
        <h2>Disclaimer</h2>
        <p>AVIORA EDU is an independent education consultancy. We are not affiliated with any university unless explicitly stated. Admission and visa decisions are made solely by universities and the competent authorities.</p>
      </>
    ),
  },
  terms: {
    title: "Terms",
    body: (
      <>
        <p><Req>full terms of service reviewed by counsel</Req></p>
        <h2>No guarantee of outcomes</h2>
        <p>Our services support students in preparing applications. We do not and cannot guarantee admission to any institution, the grant of any visa or residence permit, or any scholarship.</p>
        <h2>Information accuracy</h2>
        <p>University, tuition and immigration information changes frequently. Always verify details with the official institution or authority.</p>
      </>
    ),
  },
  "cookie-policy": {
    title: "Cookie Policy",
    body: (
      <>
        <h2>Essential storage only</h2>
        <p>This website currently uses only strictly necessary storage:</p>
        <ul className="list-disc pl-6">
          <li><code>aviora-consent-v1</code> (local storage) — remembers your cookie banner choice.</li>
          <li><code>aviora-intro</code> (session storage) — plays the intro animation only once per visit.</li>
          <li><code>aviora_admin</code> (cookie) — secure session for authorised administrators only.</li>
        </ul>
        <p>No analytics or advertising cookies are set. If this changes, this policy and the consent banner will be updated first.</p>
      </>
    ),
  },
} as const;

type Doc = keyof typeof docs;

export function generateStaticParams() {
  return Object.keys(docs).map((doc) => ({ doc }));
}

export async function generateMetadata(props: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const { doc } = await props.params;
  const d = docs[doc as Doc];
  return d ? { title: d.title, alternates: { canonical: `/legal/${doc}` }, robots: { index: true } } : {};
}

export default async function LegalPage(props: PageProps<"/legal/[doc]">) {
  const { doc } = await props.params;
  const d = docs[doc as Doc];
  if (!d) notFound();
  return (
    <>
      <PageHeader eyebrow="Legal" title={d.title} />
      <section className="bg-ivory py-20">
        <div className="container-x prose-legal max-w-3xl">{d.body}</div>
      </section>
    </>
  );
}
