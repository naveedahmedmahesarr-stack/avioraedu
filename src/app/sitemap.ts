import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { list } from "@/lib/content/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const statics = ["", "/study-in-germany", "/destinations", "/universities", "/how-it-works", "/dream-stories", "/reviews", "/about", "/contact"];
  const legal = ["privacy-policy", "imprint", "terms", "cookie-policy"].map((d) => `/legal/${d}`);
  const destinations = (await list("destinations", { publishedOnly: true })).filter((d) => d.slug !== "germany").map((d) => `/destinations/${d.slug}`);
  return [...statics, ...destinations, ...legal].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : path === "/study-in-germany" ? 0.9 : 0.7,
  }));
}
