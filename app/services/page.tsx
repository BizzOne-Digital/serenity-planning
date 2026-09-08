import type { Metadata } from "next";
import { getPageContent, getPublishedServices } from "@/lib/data";
import { servicesJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/sections/ServiceCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

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

      <section className="bg-cream py-16 text-center">
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
