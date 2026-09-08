const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Serenity Planning",
    description:
      "Affordable, pressure-free pre-need burial and cremation planning services for San Antonio, TX families.",
    url: SITE_URL,
    telephone: "210-854-9095",
    email: "Serenityplanning210@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Antonio",
      addressRegion: "TX",
      addressCountry: "US",
    },
    areaServed: "San Antonio, TX and surrounding communities",
  };
}

export function servicesJsonLd(
  services: { title: string; shortDescription: string; slug: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "Service",
      position: i + 1,
      name: s.title,
      description: s.shortDescription,
      url: `${SITE_URL}/services#${s.slug}`,
      provider: { "@type": "LocalBusiness", name: "Serenity Planning" },
    })),
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
