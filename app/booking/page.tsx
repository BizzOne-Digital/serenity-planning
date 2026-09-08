import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import BookingForm from "@/components/forms/BookingForm";

export const metadata: Metadata = {
  title: "Book a Consultation | Serenity Planning",
  description: "Schedule a no-pressure, no-obligation consultation with Serenity Planning.",
};

export default function BookingPage() {
  return (
    <>
      <PageHero
        heading="Book a Consultation"
        subtext={"Tell us a little about your needs and we’ll follow up to confirm your consultation."}
      />
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-card border border-purple-primary/10 bg-white p-6 shadow-sm md:p-8">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
