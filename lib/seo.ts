import type { Metadata } from "next";

/**
 * Preferred public origin. Canonicals, sitemap, Open Graph and JSON-LD all use it,
 * so it must be the final https://www host (non-www and http already redirect here).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.serenityfuneralplans.com").replace(
  /\/+$/,
  ""
);

export const BRAND = "Serenity Planning";
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const DEFAULT_OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: `${BRAND} — Pre-Need Services` };

/**
 * Verified social profiles. Leave empty until the owner confirms the real URLs —
 * empty entries are not rendered in the footer or added to structured data.
 */
export const SOCIAL_LINKS: { facebook: string; instagram: string } = {
  facebook: "",
  instagram: "",
};

export type PageKey =
  | "home"
  | "about"
  | "services"
  | "contact"
  | "booking"
  | "memorial-tshirts"
  | "privacy-policy"
  | "terms"
  | "disclaimer";

interface PageSeo {
  path: string;
  title: string;
  description: string;
  h1: string;
}

/** Page-specific titles, descriptions and H1s from the on-page SEO audit (sections 11-15). */
export const PAGE_SEO: Record<PageKey, PageSeo> = {
  home: {
    path: "/",
    title: "Pre-Need Funeral Planning San Antonio | Serenity Planning",
    description:
      "Explore burial and cremation planning in San Antonio with Serenity Planning. Discuss your wishes, understand available options and request a consultation.",
    h1: "Pre-Need Funeral Planning in San Antonio",
  },
  about: {
    path: "/about",
    title: "About Ricardo Mercado | Serenity Planning San Antonio",
    description:
      "Meet Ricardo Mercado of Serenity Planning in San Antonio. Read the personal story behind his mission to help families document their wishes and plan ahead.",
    h1: "Ricardo Mercado and Serenity Planning in San Antonio",
  },
  services: {
    path: "/services",
    title: "Burial & Cremation Planning San Antonio | Serenity Planning",
    description:
      "Explore pre-need burial, cremation and memorial planning in San Antonio. Understand available options with guidance from Serenity Planning. Request a conversation.",
    h1: "Burial, Cremation & Memorial Planning in San Antonio",
  },
  contact: {
    path: "/contact",
    title: "Contact Serenity Planning | San Antonio, TX",
    description:
      "Contact Serenity Planning in San Antonio with questions about burial, cremation or memorial planning. Call, email or send an inquiry for personal guidance.",
    h1: "Contact Serenity Planning in San Antonio",
  },
  booking: {
    path: "/booking",
    title: "Request a Consultation | Serenity Planning San Antonio",
    description:
      "Request a pre-need planning consultation in San Antonio. Share your burial or cremation preferences and preferred time; Serenity Planning will follow up.",
    h1: "Request a Planning Consultation in San Antonio",
  },
  "memorial-tshirts": {
    path: "/memorial-tshirts",
    title: "Memorial T-Shirts San Antonio | Serenity Planning",
    description:
      "Explore custom memorial T-shirt examples from Serenity Planning in San Antonio. Personalize a tribute with a loved one's name, photo and dates. Ask for details.",
    h1: "Custom Memorial T-Shirts in San Antonio",
  },
  "privacy-policy": {
    path: "/privacy-policy",
    title: "Privacy Policy | Serenity Planning",
    description:
      "Read how Serenity Planning uses contact and booking information, shares details with service providers and answers questions about your personal information.",
    h1: "Privacy Policy",
  },
  terms: {
    path: "/terms",
    title: "Terms of Use | Serenity Planning",
    description:
      "Review the terms for using the Serenity Planning website, including general information, provider-dependent offerings and how to contact us with questions.",
    h1: "Terms of Use",
  },
  disclaimer: {
    path: "/disclaimer",
    title: "Disclaimer | Serenity Planning",
    description:
      "Read Serenity Planning's notice about provider-dependent plans, pricing, availability and eligibility, and the limits of information on this website.",
    h1: "Disclaimer",
  },
};

export function absoluteUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Ensures the brand appears exactly once, whether or not an editor already typed it. */
export function withBrand(title: string): string {
  let seenBrand = false;
  const cleaned = title
    .replace(/serenity planning/gi, (match) => {
      if (seenBrand) return "";
      seenBrand = true;
      return match;
    })
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" | ");
  return seenBrand ? cleaned : `${cleaned} | ${BRAND}`;
}

interface SeoOverrides {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

/**
 * Builds complete page metadata: one brand per title (absolute, so the layout
 * template is never applied twice), a self-canonical, and Open Graph/Twitter tags.
 * `overrides` are the admin-editable SEO fields stored for DB-driven pages.
 */
export function buildMetadata(page: PageKey, overrides: SeoOverrides = {}): Metadata {
  const defaults = PAGE_SEO[page];
  const title = withBrand(overrides.title?.trim() || defaults.title);
  const description = overrides.description?.trim() || defaults.description;
  // All nine public pages have distinct purposes. Legacy CMS canonicals must not
  // collapse a page into the homepage or include an inquiry query/fragment.
  const canonical = absoluteUrl(defaults.path);
  const ogTitle = overrides.ogTitle?.trim() || title;
  const ogDescription = overrides.ogDescription?.trim() || description;
  const ogImage = overrides.ogImage?.trim() ? { url: overrides.ogImage.trim(), alt: ogTitle } : DEFAULT_OG_IMAGE;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: BRAND,
      locale: "en_US",
      url: canonical,
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage.url],
    },
  };
}

export const ABOUT_HERO_SUBTEXT = "Our story: guiding San Antonio families with honesty and heart.";
