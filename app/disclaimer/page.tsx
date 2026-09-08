import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Disclaimer | Serenity Planning" };

export default function DisclaimerPage() {
  return (
    <>
      <PageHero heading="Disclaimer" />
      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-4 px-6 text-ink/75 leading-relaxed">
          <p>
            Services, plans, payment options, pricing, inclusions and availability may vary by funeral provider and
            applicable state requirements. Information provided on this website is for general informational
            purposes and does not constitute legal, financial or insurance advice.
          </p>
          <p>
            Serenity Planning does not guarantee specific pricing, savings, or eligibility for any plan. Please
            speak with a member of our team for details relevant to your specific situation.
          </p>
        </div>
      </section>
    </>
  );
}
