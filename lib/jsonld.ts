import { BRAND, BUSINESS_ID, SITE_URL, SOCIAL_LINKS, absoluteUrl } from "@/lib/seo";

const sameAs = Object.values(SOCIAL_LINKS).filter(Boolean);

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    // Kept as LocalBusiness: the business plans with families and works with funeral
    // providers; it should not be typed as a FuneralHome unless it operates as one.
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: BRAND,
    description:
      "Pressure-free pre-need burial and cremation planning guidance for families in San Antonio, TX.",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: "+1-210-854-9095",
    email: "Serenityplanning210@gmail.com",
    // Only city/region are published; add streetAddress/postalCode only if a genuine
    // public office address exists and the owner wants it displayed.
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Antonio",
      addressRegion: "TX",
      addressCountry: "US",
    },
    areaServed: { "@type": "City", name: "San Antonio, TX" },
    founder: { "@type": "Person", name: "Ricardo Mercado", url: absoluteUrl("/about") },
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function servicesJsonLd(
  services: { title: string; shortDescription: string; slug: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.shortDescription,
        url: `${SITE_URL}/services#${s.slug}`,
        areaServed: { "@type": "City", name: "San Antonio, TX" },
        provider: { "@id": BUSINESS_ID },
      },
    })),
  };
}

export function memorialTshirtJsonLd() {
  // Deliberately no Offer/price/availability/rating: none are published for this service.
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom Memorial T-Shirts",
    serviceType: "Custom memorial T-shirt design",
    description:
      "Custom 'In Loving Memory' T-shirts personalized with a loved one's name, photo and dates.",
    url: absoluteUrl("/memorial-tshirts"),
    areaServed: { "@type": "City", name: "San Antonio, TX" },
    provider: { "@id": BUSINESS_ID },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
