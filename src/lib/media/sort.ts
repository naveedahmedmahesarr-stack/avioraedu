import type { Media } from "@/lib/content/schemas";

/** Featured first, then admin sort order, then newest. */
export const sortMedia = (items: Media[]) =>
  [...items].sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order || String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));
