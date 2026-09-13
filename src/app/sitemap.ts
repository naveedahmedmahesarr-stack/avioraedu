import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { list } from "@/lib/content/store";
import { guides } from "@/lib/content/guides";
import { markets } from "@/lib/content/markets";
import { legalDocs } from "./legal/docs";
import { getSite } from "@/lib/site";
import { lp } from "@/i18n/locales";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const { url: base } = await getSite();
  const paths = [
    "/",
    "/study-in-germany",
    "/services",
    "/student-support",
    "/founder",
    ...markets.map((m) => `/study-in-germany/from/${m.slug}`),
    "/destinations",
    "/universities",
    "/how-it-works",
    "/guides",
    ...guides.map((g) => `/guides/${g.slug}`),
    "/dream-stories",
    "/reviews",
    "/about",
    "/contact",
    "/legal",
    // Legal drafts stay out of the sitemap while they are noindex (details pending).
    ...Object.entries(legalDocs)
      .filter(([, d]) => !d.draft)
      .map(([slug]) => `/legal/${slug}`),
  ];
  const destinations = (await list("destinations", { publishedOnly: true })).filter((d) => d.slug !== "germany").map((d) => `/destinations/${d.slug}`);
  const abs = (p: string) => `${base}${p === "/" ? "" : p}`;
  return [...paths, ...destinations].flatMap((path) => {
    const languages = { en: abs(path), de: abs(lp("de", path)), "x-default": abs(path) };
    const priority = path === "/" ? 1 : ["/study-in-germany", "/services", "/student-support"].includes(path) ? 0.9 : path.startsWith("/study-in-germany/from") || path === "/founder" ? 0.8 : 0.7;
    return (["en", "de"] as const).map((l) => ({
      url: abs(lp(l, path)),
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
