import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getPageContent } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import { PAGE_SEO, buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("contact");
  return buildMetadata("contact", content?.seo);
}

const LINK = "font-semibold text-purple-primary underline hover:text-gold-warm";

export default async function ContactPage({ searchParams }: { searchParams: { interest?: string | string[] } }) {
  const content = await getPageContent("contact");
  const hero = (content?.sections as Record<string, { heading?: string; subtext?: string }> | undefined)?.hero;
  const interest = typeof searchParams.interest === "string" ? searchParams.interest : "";
  // Accept only the published inquiry value, including for direct visits with
  // unknown or repeated parameters. Never look up untrusted object properties.
  const defaultInterest = interest === "memorial-tshirt" ? "Memorial T-Shirt" : "";

  return (
    <>
      <PageHero
        heading={hero?.heading || PAGE_SEO.contact.h1}
        subtext={hero?.subtext || "We’re here to help you plan with peace of mind."}
      />

      <section className="py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-purple-deep">Get in Touch</h2>
            <p className="mt-3 text-ink/70 leading-relaxed">
              Have questions about planning ahead? Reach out and we&apos;ll respond with honest, pressure-free
              guidance. You can ask about{" "}
              <Link href="/services#burial-pre-need-plans" className={LINK}>
                burial pre-need plans
              </Link>
              ,{" "}
              <Link href="/services#cremation-pre-need-plans" className={LINK}>
                cremation pre-need plans
              </Link>
              ,{" "}
              <Link href="/services#funeral-memorial-service-planning" className={LINK}>
                funeral and memorial service planning
              </Link>{" "}
              or{" "}
              <Link href="/memorial-tshirts" className={LINK}>
                custom memorial T-shirts
              </Link>
              .
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              We help you understand and document your planning preferences. Ask which provider would supply
              the arrangements you are considering and what that provider&apos;s terms include.
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

            <div className="mt-10 rounded-card bg-cream p-6">
              <h2 className="font-serif text-xl font-semibold text-purple-deep">What Happens After You Reach Out</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/75 leading-relaxed">
                <li>
                  A member of the Serenity Planning team reviews your message and contacts you using the method you
                  prefer: email, phone or text.
                </li>
                <li>
                  Ask anything about planning ahead. There is no pressure and no obligation to move forward.
                </li>
                <li>
                  Ready to sit down and talk through your options?{" "}
                  <Link href="/booking" className={LINK}>
                    Request a planning consultation
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-card border border-purple-primary/10 bg-white p-6 shadow-sm md:p-8">
            <ContactForm key={defaultInterest} defaultInterest={defaultInterest} />
            <p className="mt-4 text-xs text-ink/60">
              Read how we handle inquiry information in our{" "}
              <Link href="/privacy-policy" className="underline hover:text-purple-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
