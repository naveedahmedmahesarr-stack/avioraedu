import { brandIconResponse } from "@/lib/brandIcon";

export const dynamic = "force-static";

/** iOS requests /apple-touch-icon.png directly when saving the site to the home screen. */
export function GET() {
  return brandIconResponse(180);
}
