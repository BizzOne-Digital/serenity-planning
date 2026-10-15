import type { Metadata } from "next";
import { getPageContent, getPublishedServices } from "@/lib/data";
import { servicesJsonLd } from "@/lib/jsonld";
import { Heart } from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/sections/ServiceCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { PAGE_SEO, buildMetadata } from "@/lib/seo";

const CASKETS = [
  { src: "/casket-marines.jpg", alt: "Example casket design with U.S. Marine Corps emblem", width: 1427, height: 873 },
  { src: "/casket-army.jpg", alt: "Example casket design with U.S. Army emblem", width: 1412, height: 864 },
  { src: "/casket-airforce.jpg", alt: "Example casket design with U.S. Air Force emblem", width: 1409, height: 886 },
  { src: "/casket-green.jpg", alt: "Example traditional green casket design", width: 640, height: 430 },
  { src: "/casket-white-rose.jpg", alt: "Example white and rose-gold casket design", width: 1500, height: 1000 },
];

const GALLERY_SIZES = "(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("services");
  return buildMetadata("services", content?.seo);
}

export default async function ServicesPage() {
  const [content, services] = await Promise.all([getPageContent("services"), getPublishedServices()]);
  const hero = (content?.sections as Record<string, { heading?: string; subtext?: string }> | undefined)?.hero;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd(services)) }}
      />
      <PageHero
        heading={hero?.heading || PAGE_SEO.services.h1}
        subtext={
          hero?.subtext ||
          "Pre-need planning with compassion and clarity for San Antonio families. Each option below explains what we help you plan and decide."
        }
      />

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Our Services"
            heading="Pre-Need Planning Services We Offer"
            subtext="Every plan is built around your wishes. Inclusions, pricing and availability depend on the provider and the arrangement you choose, and we review them with you before you decide."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s._id} service={s} index={i} detailed />
            ))}
          </div>
        </div>
      </section>

      {/* Casket options gallery */}
      <section className="bg-cream py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Casket Options"
            heading="Example Casket Designs, Including Military-Themed Options"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CASKETS.map((c, i) => (
              <FadeIn key={c.src} delay={i * 0.05}>
                <div className="overflow-hidden rounded-2xl border border-gold-warm/30 bg-white shadow-md">
                  <SafeImage
                    src={c.src}
                    alt={c.alt}
                    width={c.width}
                    height={c.height}
                    sizes={GALLERY_SIZES}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </FadeIn>
            ))}
            <FadeIn delay={0.25}>
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gold-warm/30 bg-purple-deep p-6 text-center text-ivory">
                <SafeImage
                  src="/ricardo-showroom.jpg"
                  alt="Ricardo Mercado in the Serenity Planning showroom"
                  width={957}
                  height={960}
                  sizes={GALLERY_SIZES}
                  className="mb-4 aspect-[4/3] w-full rounded-xl object-cover"
                />
                <p className="font-serif text-lg italic text-gold-champagne">Affordable Funeral Plans</p>
              </div>
            </FadeIn>
          </div>
          <p className="mt-6 text-center text-xs text-ink/50">
            Casket styles shown are example designs only. Military emblem designs are a casket style choice; they
            are not military funeral honors or veterans&apos; benefits. Availability,
            pricing and emblem options vary by provider and selected arrangement — we&apos;ll review current options
            during your consultation.
          </p>
        </div>
      </section>

      {/* Memorial T-shirts callout */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <Link
              href="/memorial-tshirts"
              className="group flex flex-col items-center gap-4 rounded-2xl border border-gold-warm/40 bg-purple-deep px-8 py-10 text-center transition-colors hover:bg-purple-primary sm:flex-row sm:text-left"
            >
              <Heart className="h-10 w-10 shrink-0 text-gold-warm" aria-hidden="true" />
              <div className="flex-1">
                <h2 className="font-serif text-2xl font-semibold text-ivory">
                  In Memory Of — Custom Memorial T-Shirts
                </h2>
                <p className="mt-1 text-ivory/75">
                  A lasting, wearable tribute to honor the life and memory of someone you love.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-gold-warm px-5 py-2.5 text-sm font-semibold text-purple-deep transition-colors group-hover:bg-gold-champagne">
                View Memorial T-Shirt Examples
              </span>
            </Link>
          </FadeIn>
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
