import type { Metadata } from "next";
import { getPageContent, getPublishedServices } from "@/lib/data";
import { servicesJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/sections/ServiceCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";

const CASKETS = [
  { src: "/casket-marines.jpg", alt: "U.S. Marine Corps memorial casket" },
  { src: "/casket-army.jpg", alt: "U.S. Army memorial casket" },
  { src: "/casket-airforce.jpg", alt: "U.S. Air Force memorial casket" },
  { src: "/casket-green.jpg", alt: "Traditional green casket option" },
  { src: "/casket-white-rose.jpg", alt: "White and rose-gold casket option" },
];

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("services");
  return {
    title: content?.seo?.title || "Planning Services | Serenity Planning San Antonio",
    description:
      content?.seo?.description ||
      "Explore pre-need burial, cremation and memorial planning services offered by Serenity Planning.",
  };
}

export default async function ServicesPage() {
  const [content, services] = await Promise.all([getPageContent("services"), getPublishedServices()]);
  const hero = (content?.sections as Record<string, { heading?: string }> | undefined)?.hero;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd(services)) }}
      />
      <PageHero heading={hero?.heading || "Pre-Need Planning With Compassion and Clarity"} />

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s._id} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Casket options gallery */}
      <section className="bg-cream py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Casket Options"
            heading="A Range of Dignified Options, Including Military Honors"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CASKETS.map((c, i) => (
              <FadeIn key={c.src} delay={i * 0.05}>
                <div className="overflow-hidden rounded-2xl border border-gold-warm/30 bg-white shadow-md">
                  <SafeImage src={c.src} alt={c.alt} className="aspect-[4/3] w-full object-cover" />
                </div>
              </FadeIn>
            ))}
            <FadeIn delay={0.25}>
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gold-warm/30 bg-purple-deep p-6 text-center text-ivory">
                <SafeImage
                  src="/ricardo-showroom.jpg"
                  alt="Ricardo Mercado in the Serenity Planning showroom"
                  className="mb-4 aspect-[4/3] w-full rounded-xl object-cover"
                />
                <p className="font-serif text-lg italic text-gold-champagne">Affordable Funeral Plans</p>
              </div>
            </FadeIn>
          </div>
          <p className="mt-6 text-center text-xs text-ink/50">
            Casket styles shown are examples only. Availability, pricing and military emblem options vary by
            provider and selected arrangement — we&apos;ll review current options during your consultation.
          </p>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-2xl font-semibold text-purple-deep">
            Not sure which option is right for you?
          </h2>
          <p className="mt-3 text-ink/70">
            We&apos;ll walk you through every option in a relaxed, no-pressure conversation.
          </p>
          <div className="mt-6">
            <PrimaryButton href="/booking">Schedule a Conversation</PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
