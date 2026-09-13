import "server-only";
import type { ConsultationInput } from "./content/schemas";

/**
 * Optional email notification via Resend's REST API.
 * CONFIGURATION REQUIRED: RESEND_API_KEY, CONSULTATION_TO_EMAIL, CONSULTATION_FROM_EMAIL
 * (the from-address domain must be verified in Resend).
 */
export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONSULTATION_TO_EMAIL && process.env.CONSULTATION_FROM_EMAIL);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function sendConsultationEmail(input: ConsultationInput) {
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
      to: [process.env.CONSULTATION_TO_EMAIL],
      reply_to: input.email,
      subject: `New consultation request — ${input.fullName} (${input.destination})`,
      html: `<h2>New consultation request</h2><table>${rows}</table>`,
    }),
  });
  if (!res.ok) throw new Error(`Email provider responded ${res.status}`);
}
