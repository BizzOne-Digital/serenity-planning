import type { MetadataRoute } from "next";
import { PAGE_SEO, absoluteUrl } from "@/lib/seo";

// Only final, indexable public pages. No lastmod: we don't publish dates we can't verify.
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGE_SEO).map((page) => ({ url: absoluteUrl(page.path) }));
}
