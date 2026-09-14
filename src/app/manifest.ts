import type { MetadataRoute } from "next";

/** Web app manifest: name, colors and icons used when the site is saved to a home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AVIORA EDU",
    short_name: "AVIORA EDU",
    description: "Education consultancy in Berlin for studying in Germany and Europe.",
    start_url: "/",
    display: "standalone",
    background_color: "#050d1c",
    theme_color: "#050d1c",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
