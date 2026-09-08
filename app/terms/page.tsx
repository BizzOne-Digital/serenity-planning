import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Terms of Use | Serenity Planning" };

export default function TermsPage() {
  return (
    <>
      <PageHero heading="Terms of Use" />
      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-4 px-6 text-ink/75 leading-relaxed">
          <p>
            By using this website, you agree that the information provided is for general informational purposes
            only and does not constitute legal, financial or insurance advice.
          </p>
          <p>
            Services, plans, payment options, pricing, inclusions and availability may vary by funeral provider and
            applicable state requirements.
          </p>
          <p>For questions about these terms, contact Serenity Planning at 210-854-9095.</p>
        </div>
      </section>
    </>
  );
}
