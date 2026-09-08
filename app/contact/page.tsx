import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getPageContent } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/forms/ContactForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("contact");
  return {
    title: content?.seo?.title || "Contact Serenity Planning | San Antonio, TX",
    description:
      content?.seo?.description ||
      "Reach out to Serenity Planning to schedule a no-pressure consultation about your funeral and cremation planning options.",
  };
}

export default async function ContactPage() {
  const content = await getPageContent("contact");
  const hero = (content?.sections as Record<string, { heading?: string }> | undefined)?.hero;

  return (
    <>
      <PageHero heading={hero?.heading || "We’re Here to Help You Plan With Peace of Mind"} />

      <section className="py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-purple-deep">Get in Touch</h2>
            <p className="mt-3 text-ink/70 leading-relaxed">
              Have questions about planning ahead? Reach out and we&apos;ll respond with honest, pressure-free
              guidance.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold-warm" aria-hidden="true" />
                <a href="tel:2108549095" className="text-ink hover:text-purple-primary">210-854-9095</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold-warm" aria-hidden="true" />
                <a href="mailto:Serenityplanning210@gmail.com" className="text-ink hover:text-purple-primary break-all">
                  Serenityplanning210@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gold-warm" aria-hidden="true" />
                <span className="text-ink">San Antonio, TX and surrounding communities</span>
              </li>
            </ul>
          </div>

          <div className="rounded-card border border-purple-primary/10 bg-white p-6 shadow-sm md:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
