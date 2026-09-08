import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Privacy Policy | Serenity Planning" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero heading="Privacy Policy" />
      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-4 px-6 text-ink/75 leading-relaxed">
          <p>
            Serenity Planning respects your privacy. Information submitted through our contact and booking forms is
            used solely to respond to your inquiry and provide the services you request.
          </p>
          <p>
            We do not sell your personal information to third parties. Information may be shared with trusted
            service providers strictly to fulfill your request.
          </p>
          <p>
            If you have questions about how your information is handled, please contact us at
            Serenityplanning210@gmail.com or 210-854-9095.
          </p>
        </div>
      </section>
    </>
  );
}
