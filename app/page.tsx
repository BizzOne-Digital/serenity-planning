import type { Metadata } from "next";
import {
  ShieldCheck,
  HeartHandshake,
  HandCoins,
  Users,
  Lock,
  CheckCircle2,
  Phone,
  MessageCircleHeart,
  ListChecks,
  Compass,
  ClipboardCheck,
  Signpost,
} from "lucide-react";
import { getPageContent, getPublishedFaqs, getPublishedServices, getPublishedTestimonials } from "@/lib/data";
import { faqJsonLd, servicesJsonLd } from "@/lib/jsonld";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/sections/ServiceCard";
import BenefitCard from "@/components/sections/BenefitCard";
import FAQAccordion from "@/components/sections/FAQAccordion";
import TestimonialsSlider from "@/components/sections/TestimonialsSlider";
import FadeIn from "@/components/ui/FadeIn";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import SafeImage from "@/components/ui/SafeImage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("home");
  return {
    title: content?.seo?.title || "Serenity Planning | Pre-Need Burial & Cremation Planning in San Antonio, TX",
    description:
      content?.seo?.description ||
      "Affordable, pressure-free burial and cremation planning for San Antonio families.",
  };
}

const HOW_IT_WORKS = [
  { step: "01", title: "Schedule a Conversation", icon: MessageCircleHeart },
  { step: "02", title: "Tell Us Your Wishes", icon: ListChecks },
  { step: "03", title: "Understand Your Options", icon: Compass },
  { step: "04", title: "Choose What Feels Right", icon: ClipboardCheck },
  { step: "05", title: "Give Your Family Clear Direction", icon: Signpost },
];

export default async function HomePage() {
  const [content, services, faqs, testimonials] = await Promise.all([
    getPageContent("home"),
    getPublishedServices(),
    getPublishedFaqs(),
    getPublishedTestimonials(),
  ]);

  const sections = (content?.sections || {}) as Record<string, any>;
  const hero = sections.hero || {};
  const intro = sections.intro || {};
  const founder = sections.founder || {};
  const finalCta = sections.finalCta || {};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd(services)) }}
      />
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />
      )}

      {/* Hero */}
      <section
        className="relative flex min-h-[100svh] items-center overflow-hidden bg-purple-deep bg-cover bg-[position:65%_center] py-28 sm:min-h-[90vh] sm:bg-center md:min-h-[92vh]"
        style={{ backgroundImage: "url('/hero.png')" }}
      >
        {/* Scrim so text stays readable over the flowers/photo on every crop */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-deep/90 via-purple-deep/55 to-transparent sm:from-purple-deep/85 sm:via-purple-deep/35 sm:to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-6">
          <div className="max-w-xl text-left">
            <FadeIn>
              <h1 className="font-serif text-4xl font-semibold leading-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] md:text-6xl">
                {hero.heading || "Give Your Loved Ones"}{" "}
                <span className="text-gold-champagne">{hero.headingEmphasis || "Peace of Mind"}</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                {hero.subtext ||
                  "Affordable burial and cremation planning with compassionate, pressure-free guidance for families in San Antonio and surrounding communities."}
              </p>
              <p className="mt-3 font-serif text-xl italic text-gold-champagne [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                {hero.tagline || "Plan Today. Peace Tomorrow."}
              </p>

              <div className="mt-9 flex flex-col items-stretch justify-start gap-4 sm:flex-row">
                <PrimaryButton href={hero.primaryCtaHref || "/booking"}>
                  {hero.primaryCtaLabel || "Book a Consultation"}
                </PrimaryButton>
                <SecondaryButton href={hero.secondaryCtaHref || "/services"}>
                  {hero.secondaryCtaLabel || "Explore Planning Options"}
                </SecondaryButton>
              </div>

              <p className="mt-8 text-sm font-medium uppercase tracking-widest text-gold-champagne [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">
                {hero.trustLine || "No Pressure • No Obligation • Honest Guidance"}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-cream py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
          <BenefitCard icon={HeartHandshake} title="Pressure-Free Guidance" description="No pressure. Just caring support." />
          <BenefitCard icon={ClipboardCheck} title="Personalized Planning" description="Plans designed around your wishes." />
          <BenefitCard icon={HandCoins} title="Affordable Options" description="Understand your available options clearly." />
          <BenefitCard icon={Users} title="Family Peace of Mind" description="Reduce difficult decisions for your loved ones." />
        </div>
      </section>

      {/* Intro / About Serenity Planning */}
      <section className="overflow-hidden py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <FadeIn>
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-3 -z-10 rounded-2xl border border-gold-warm/40" aria-hidden="true" />
              <SafeImage
                src="/flyer.jpg"
                alt="Serenity Planning — Ricardo Mercado, Founder"
                className="w-full rounded-2xl object-cover shadow-xl"
              />
            </div>
          </FadeIn>
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-warm">About Serenity Planning</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-purple-deep md:text-4xl">
              {intro.heading || "Planning Ahead Is an Act of Love"}
            </h2>
            <p className="mt-5 text-ink/75 leading-relaxed">
              {intro.body ||
                "Serenity Planning was founded on a simple belief: families deserve honest, pressure-free guidance when planning ahead. We help San Antonio families make their wishes known, understand their options and protect the people they love from difficult decisions during an emotional time."}
            </p>
            <p className="mt-4 font-serif text-lg italic text-purple-primary">
              &ldquo;A small decision today can make a big difference tomorrow.&rdquo;
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 border-y border-cream py-6">
              <div className="text-center">
                <p className="font-serif text-lg font-semibold text-purple-deep">People First</p>
              </div>
              <div className="border-x border-cream text-center">
                <p className="font-serif text-lg font-semibold text-purple-deep">Our Community</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-lg font-semibold text-purple-deep">A Brighter Tomorrow</p>
              </div>
            </div>
            <div className="mt-8">
              <SecondaryButton href={intro.ctaHref || "/about"} className="!text-purple-deep !border-purple-primary/40 hover:!bg-purple-primary/5">
                {intro.ctaLabel || "Learn Why Families Plan Ahead"}
              </SecondaryButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-cream py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Our Services" heading="Ways We Help You Plan Ahead" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <ServiceCard key={s._id} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Lock in pricing CTA */}
      <section className="bg-gradient-to-br from-purple-primary to-purple-deep py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Lock className="mx-auto mb-4 h-9 w-9 text-gold-warm" aria-hidden="true" />
          <h2 className="font-serif text-2xl font-semibold text-ivory md:text-3xl">Lock In Today&apos;s Pricing</h2>
          <p className="mt-3 text-ivory/80">
            Discuss available plans and pricing options with us before costs may change in the future.
          </p>
          <p className="mt-2 text-xs text-ivory/60">
            Pricing and availability are not guaranteed and may vary by provider and plan selection.
          </p>
          <div className="mt-6">
            <PrimaryButton href="/booking">Discuss Available Plans</PrimaryButton>
          </div>
        </div>
      </section>

      {/* Casket inclusion */}
      <section className="bg-cream py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-2xl font-semibold text-purple-deep">Most Plans Include a Casket</h2>
          <p className="mt-3 text-ink/70">
            Many of our pre-need plans include a casket as part of the arrangement, helping simplify your planning
            process.
          </p>
          <p className="mt-2 text-xs text-ink/50">
            Plan inclusions vary by provider and selected arrangement.
          </p>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Why Plan Ahead" heading="The Benefits of Planning Today" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={ClipboardCheck} title="Make Your Wishes Known" description="Document exactly what you want, in your own words." />
            <BenefitCard icon={HeartHandshake} title="Reduce Family Stress" description="Give your family clarity during a difficult time." />
            <BenefitCard icon={Compass} title="Understand Your Options" description="Learn about burial, cremation and service choices." />
            <BenefitCard icon={HandCoins} title="Plan Around Your Budget" description="Review options that fit your financial circumstances." />
            <BenefitCard icon={ListChecks} title="Prepare at Your Own Pace" description="No pressure, no deadlines — just guidance when you're ready." />
            <BenefitCard icon={Users} title="Receive Personal Guidance" description="Work with someone who genuinely cares about your family." />
          </div>
        </div>
      </section>

      {/* Founder teaser */}
      <section className="bg-purple-deep py-20 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 md:grid-cols-[220px_1fr] md:gap-12">
          {founder.image && (
            <FadeIn className="mx-auto md:mx-0">
              <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-full border-4 border-gold-warm/60 shadow-gold md:h-[220px] md:w-[220px]">
                <SafeImage
                  src={founder.image}
                  alt={founder.name || "Ricardo Mercado"}
                  className="h-full w-full object-cover"
                />
              </div>
            </FadeIn>
          )}
          <FadeIn className="text-center md:text-left">
            <SectionHeading
              dark
              align={founder.image ? "left" : "center"}
              heading={founder.heading || "A Personal Commitment to Every Family"}
            />
            <p className="text-ivory/80 leading-relaxed">
              {founder.body ||
                "Serenity Planning was built on a simple belief: families deserve honest, pressure-free guidance when planning ahead."}
            </p>
            <p className="mt-6 font-serif text-xl italic text-gold-champagne">
              &ldquo;{founder.quote || "Helping families plan today for a more peaceful tomorrow."}&rdquo;
            </p>
            <p className="mt-2 text-sm font-semibold text-ivory/70">
              — {founder.name || "Ricardo Mercado"}, Founder
            </p>
            <div className="mt-8">
              <SecondaryButton href={founder.ctaHref || "/about"}>{founder.ctaLabel || "Our Story"}</SecondaryButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Our Process" heading="How It Works" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="text-center">
                <p className="font-serif text-3xl font-semibold text-gold-warm/60">{s.step}</p>
                <div className="mx-auto my-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-primary/5 text-purple-primary">
                  <s.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-purple-deep">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading eyebrow="Testimonials" heading="What Families Are Saying" />
          <TestimonialsSlider testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading eyebrow="Common Questions" heading="Frequently Asked Questions" />
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-purple-deep to-purple-royal py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-gold-warm" aria-hidden="true" />
          <h2 className="font-serif text-3xl font-semibold text-ivory md:text-4xl">
            {finalCta.heading || "Give Your Family the Gift of Peace of Mind"}
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PrimaryButton href="/booking">{finalCta.primaryCtaLabel || "Schedule Consultation"}</PrimaryButton>
            <a
              href="tel:2108549095"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gold-warm/70 px-7 py-3.5 text-base font-semibold text-ivory hover:bg-ivory/10"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call 210-854-9095
            </a>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gold-warm/90">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {finalCta.note || "No Pressure. No Obligation. Just Honest Guidance."}
          </p>
        </div>
      </section>
    </>
  );
}
