import "server-only";
import { cache } from "react";
import { siteConfig } from "./config";
import { getSettings } from "./content/store";

/**
 * Central business identity for the public site: Admin → Settings first, environment as fallback.
 * Cached per request so layouts, headers and structured data share one read.
 */
export const getSite = cache(async () => {
  const s = await getSettings();
  const url = (s.siteUrl || siteConfig.url).replace(/\/$/, "");
  const social = {
    instagram: s.socialInstagram || siteConfig.social.instagram,
    facebook: s.socialFacebook || siteConfig.social.facebook,
    linkedin: s.socialLinkedin || siteConfig.social.linkedin,
    youtube: s.socialYoutube || siteConfig.social.youtube,
    tiktok: s.socialTiktok || siteConfig.social.tiktok,
  };
  // City + country are enough to show a location ("Berlin, Germany"). A street address is optional
  // and only published when entered in Admin — never required, never invented.
  const address =
    s.addressCity && s.addressCountry
      ? { street: s.addressStreet, postalCode: s.addressPostalCode, city: s.addressCity, country: s.addressCountry }
      : null;
  const location = address ? `${address.city}, ${address.country}` : "";
  return { name: s.businessName || siteConfig.name, url, email: s.businessEmail, phone: s.phone, social, address, location, settings: s };
});

export type Site = Awaited<ReturnType<typeof getSite>>;

/** Organization reference used by Service/Article structured data. */
export const orgRef = (site: Site) => ({ "@type": "EducationalOrganization", "@id": `${site.url}/#organization`, name: site.name, url: site.url });

/** Schema.org PostalAddress with only the parts that exist (city/country without a street is valid). */
export const postalAddress = (site: Site) =>
  site.address
    ? {
        "@type": "PostalAddress",
        ...(site.address.street ? { streetAddress: site.address.street } : {}),
        ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}),
        addressLocality: site.address.city,
        addressCountry: site.address.country,
      }
    : undefined;
