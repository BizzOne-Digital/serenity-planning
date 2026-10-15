import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import BookingForm from "@/components/forms/BookingForm";
import { PAGE_SEO, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("booking");

const LINK = "font-semibold text-purple-primary underline hover:text-gold-warm";

export default function BookingPage() {
  return (
    <>
      <PageHero
        heading={PAGE_SEO.booking.h1}
        subtext={"Tell us a little about your needs and we’ll follow up to confirm your consultation."}
      />
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <div className="mb-8 rounded-card bg-cream p-6">
            <h2 className="font-serif text-xl font-semibold text-purple-deep">What to Expect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/75 leading-relaxed">
              <li>
                We talk through your wishes and answer your questions about{" "}
                <Link href="/services#burial-pre-need-plans" className={LINK}>
                  burial
                </Link>{" "}
                and{" "}
                <Link href="/services#cremation-pre-need-plans" className={LINK}>
                  cremation
                </Link>{" "}
                planning options, with no pressure and no obligation.
              </li>
              <li>
                The date and time you choose below are preferences, not a confirmed appointment. A member of our
                team will follow up to confirm a time that works for you.
              </li>
              <li>
                Think about any existing arrangements, your preferences and the questions you want to ask.
                You can start the conversation even if you are unsure what you want.
              </li>
            </ul>
            <p className="mt-4 text-sm text-ink/70">
              Want to learn more first?{" "}
              <Link href="/services" className={LINK}>
                Explore our pre-need planning services
              </Link>
              .
            </p>
          </div>
          <div className="rounded-card border border-purple-primary/10 bg-white p-6 shadow-sm md:p-8">
            <BookingForm />
            <p className="mt-4 text-xs text-ink/60">
              Read how we handle consultation information in our{" "}
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
