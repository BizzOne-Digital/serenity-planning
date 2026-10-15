import type { Metadata } from "next";
import { Heart } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import SafeImage from "@/components/ui/SafeImage";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PAGE_SEO, buildMetadata } from "@/lib/seo";
import { memorialTshirtJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata("memorial-tshirts");

const ORDER_STEPS = [
  {
    title: "Tell us about your loved one",
    body: "Reach out with the name, photo and dates you would like included, plus any words or details that matter to your family.",
  },
  {
    title: "Discuss your design",
    body: "Tell us how you would like the name, photo and dates arranged. Ask how a design can be reviewed and approved before an order is placed.",
  },
  {
    title: "Talk through the details",
    body: "Ask about available sizes, materials, quantities, pricing, turnaround and pickup or delivery options. Confirm the details for your order before committing.",
  },
];

const EXAMPLES = [
  { src: "/tribute-tee-4.jpg", width: 900, height: 822, alt: "Custom memorial tribute design example — In Loving Memory, Patricia Ovalle" },
  { src: "/tribute-tee-1.jpg", width: 900, height: 1273, alt: "Custom memorial tribute design example — In Loving Memory, Juan Castañeda" },
  { src: "/tribute-tee-2.jpg", width: 900, height: 1316, alt: "Custom memorial tribute design example — In Loving Memory of Joshua Elliot Solis" },
  { src: "/tribute-tee-3.jpg", width: 900, height: 1202, alt: "Custom memorial tribute design example — In Loving Memories of Enemencio Huerta" },
  { src: "/tribute-tee-template.jpg", width: 900, height: 794, alt: "Custom memorial tribute design template — Heaven Need An Angel" },
];

export default function MemorialTshirtsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(memorialTshirtJsonLd()) }} />
      <PageHero
        heading={PAGE_SEO["memorial-tshirts"].h1}
        subtext="In Memory Of — a lasting, wearable tribute to honor the life and memory of someone you love."
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
                  <SafeImage
                    src={e.src}
                    alt={e.alt}
                    width={e.width}
                    height={e.height}
                    sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[3/4] w-full object-cover"
                  />
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

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading eyebrow="How It Works" heading="Start Your Memorial T-Shirt Inquiry" />
          <ol className="grid gap-6 md:grid-cols-3">
            {ORDER_STEPS.map((step, i) => (
              <li key={step.title} className="rounded-card bg-cream p-6 text-center">
                <p className="font-serif text-3xl font-semibold text-gold-warm/70">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-serif text-lg font-semibold text-purple-deep">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-2xl font-semibold text-purple-deep">
            Ready to create a tribute for your loved one?
          </h2>
          <p className="mt-3 text-ink/70">
            Reach out and we&apos;ll help you design a custom memorial T-shirt they&apos;d be proud to be
            remembered by.
          </p>
          <div className="mt-6">
            <PrimaryButton href="/contact?interest=memorial-tshirt">Ask About a Memorial T-Shirt</PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
