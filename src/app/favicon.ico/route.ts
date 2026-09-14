import { brandIconResponse } from "@/lib/brandIcon";

export const dynamic = "force-static";

/** Browsers request /favicon.ico regardless of <link rel="icon">; serve the brand mark instead of a 404. */
export function GET() {
  return brandIconResponse(48);
}
