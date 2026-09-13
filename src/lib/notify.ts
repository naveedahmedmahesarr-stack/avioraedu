import "server-only";
import type { ConsultationInput } from "./content/schemas";

/**
 * Optional email notification via Resend's REST API.
 * CONFIGURATION REQUIRED: RESEND_API_KEY and CONSULTATION_FROM_EMAIL (domain verified in Resend).
 * Recipient: CONSULTATION_TO_EMAIL, or the business email from Admin → Settings when that is unset.
 */
export function emailConfigured(fallbackTo?: string) {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONSULTATION_FROM_EMAIL && (process.env.CONSULTATION_TO_EMAIL || fallbackTo));
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function sendConsultationEmail(input: ConsultationInput, fallbackTo?: string) {
  const rows = (
    [
      ["Name", input.fullName],
      ["Email", input.email],
      ["Phone", input.phone],
      ["Country", input.country],
      ["Destination", input.destination],
      ["Study level", input.studyLevel],
      ["Field", input.studyField],
      ["Intake", input.intake],
      ["Message", input.message || "—"],
    ] as const
  )
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${esc(v)}</td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONSULTATION_FROM_EMAIL,
      to: [process.env.CONSULTATION_TO_EMAIL || fallbackTo],
      reply_to: input.email,
      subject: `New consultation request — ${input.fullName.replace(/[\r\n]/g, " ")} (${input.destination.replace(/[\r\n]/g, " ")})`,
      html: `<h2>New consultation request</h2><table>${rows}</table>`,
    }),
  });
  if (!res.ok) throw new Error(`Email provider responded ${res.status}`);
}
