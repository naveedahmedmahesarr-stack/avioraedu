import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getSite } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  const { url } = await getSite();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${url}/sitemap.xml`,
  };
}
