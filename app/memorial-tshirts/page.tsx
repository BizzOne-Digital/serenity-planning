import type { Metadata } from "next";
import { Heart } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import SafeImage from "@/components/ui/SafeImage";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export const metadata: Metadata = {
  title: "In Memory Of — Custom Memorial T-Shirts | Serenity Planning",
  description:
    "Custom 'In Loving Memory' T-shirts and keepsakes to honor and remember your loved one. Designed with care by Serenity Planning in San Antonio, TX.",
};

const EXAMPLES = [
  { src: "/tribute-tee-4.jpg", alt: "Custom memorial tribute design example — In Loving Memory, Patricia Ovalle" },
  { src: "/tribute-tee-1.jpg", alt: "Custom memorial tribute design example — In Loving Memory, Juan Castañeda" },
  { src: "/tribute-tee-2.jpg", alt: "Custom memorial tribute design example — In Loving Memory of Joshua Elliot Solis" },
  { src: "/tribute-tee-3.jpg", alt: "Custom memorial tribute design example — In Loving Memories of Enemencio Huerta" },
  { src: "/tribute-tee-template.jpg", alt: "Custom memorial tribute design template — Heaven Need An Angel" },
];

export default function MemorialTshirtsPage() {
  return (
    <>
      <PageHero
        heading="In Memory Of — Custom Memorial T-Shirts"
        subtext="A lasting, wearable tribute to honor the life and memory of someone you love."
      />

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <Heart className="mx-auto mb-4 h-9 w-9 text-gold-warm" aria-hidden="true" />
            <SectionHeading heading="A Keepsake Your Family Can Wear" />
            <p className="text-ink/75 leading-relaxed">
              Alongside our pre-need planning services, Serenity Planning designs custom memorial T-shirts —
              a meaningful way for family and friends to carry a loved one&apos;s memory with them. Each design
              is personalized with their name, photo and dates, so every gathering becomes a chance to
              remember and celebrate their life together.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Examples of Our Work" heading="Designed With Care, Made to Honor" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EXAMPLES.map((e, i) => (
              <FadeIn key={e.src} delay={i * 0.05}>
                <div className="overflow-hidden rounded-2xl border border-gold-warm/30 bg-white shadow-md">
                  <SafeImage src={e.src} alt={e.alt} className="aspect-[3/4] w-full object-cover" />
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-ink/50">
            Designs shown were created for families we&apos;ve had the honor of serving and are shared here
            with their memory in mind. Every tribute shirt is fully customized for your loved one.
          </p>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-2xl font-semibold text-purple-deep">
            Ready to create a tribute for your loved one?
          </h2>
          <p className="mt-3 text-ink/70">
            Reach out and we&apos;ll help you design a custom memorial T-shirt they&apos;d be proud to be
            remembered by.
          </p>
          <div className="mt-6">
            <PrimaryButton href="/contact">Get Started</PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
