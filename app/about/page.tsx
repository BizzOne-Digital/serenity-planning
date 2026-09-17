import type { Metadata } from "next";
import { HeartHandshake, Users, Sunrise, BookOpen, ShieldCheck, Handshake } from "lucide-react";
import { getPageContent } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import BenefitCard from "@/components/sections/BenefitCard";
import FadeIn from "@/components/ui/FadeIn";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import SafeImage from "@/components/ui/SafeImage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("about");
  return {
    title: content?.seo?.title || "About Serenity Planning | Pre-Need Funeral Planning San Antonio",
    description:
      content?.seo?.description ||
      "Learn about Serenity Planning's mission to help San Antonio families plan ahead with peace of mind.",
  };
}

interface FounderSection {
  image?: string;
  name?: string;
  quote?: string;
  intro?: string;
  storyHeading?: string;
  story?: string[];
  closing?: string;
}

const DEFAULT_STORY: string[] = [
  "My passion for helping families plan ahead for their final arrangements comes from a very personal place — my mother.",
  "Back in 1986, my mother made a decision that would have a lasting impact on our family. She purchased a pre-need funeral plan and made the commitment to pay for it ahead of time. In just eight years, her plan was completely paid for.",
  "At the time, we may not have fully understood how important that decision would become.",
  "My mother passed away eight years ago. When that difficult day came, our family was already dealing with the pain of losing someone we loved. But there was one major burden we didn't have to carry: we didn't have to worry about how we were going to pay for her funeral arrangements.",
  "My mother had already taken care of it. She had planned ahead. She had made the decisions. She had paid for her plan years before she ever needed it.",
  "That experience stayed with me. I saw firsthand how planning ahead can give a family something incredibly valuable during one of life's most difficult moments — peace of mind.",
  "That's what motivated me to begin helping other families with pre-need funeral plans.",
  "I want families to have the same opportunity my mother gave us. I want people to understand that pre-planning isn't about thinking negatively or expecting something bad to happen. It's about taking care of the people you love.",
  "When you plan ahead, you can make your wishes known, help protect your family from unexpected financial stress, and give them the comfort of knowing that you took care of these important decisions in advance.",
  "My mother planned for our future, and her preparation became a gift to our family. Now, my mission is to help other families do the same.",
];

export default async function AboutPage() {
  const content = await getPageContent("about");
  const sections = (content?.sections || {}) as Record<string, any>;
  const hero = sections.hero as { heading?: string; subtext?: string } | undefined;
  const founder: FounderSection = sections.founder || {};
  const story = founder.story?.length ? founder.story : DEFAULT_STORY;

  return (
    <>
      <PageHero
        heading={hero?.heading || "Our Story"}
        subtext={hero?.subtext || "Guiding San Antonio families with honesty and heart."}
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <div className="overflow-hidden rounded-2xl border border-gold-warm/30 shadow-xl">
              <video
                src="/serenity-intro.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="mt-6 text-ink/75 leading-relaxed">
              Your final arrangements are one of the most important decisions you can make for your family.
              Planning ahead can help relieve emotional and financial stress when your loved ones need you
              most.
            </p>
            <p className="mt-3 font-semibold text-purple-deep">
              <a href="tel:2108549095" className="hover:text-gold-warm">
                Call 210-854-9095
              </a>{" "}
              to learn more about your pre-need options.
            </p>
          </FadeIn>
        </div>
      </section>

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
            <SectionHeading align="left" eyebrow="Our Mission" heading="Planning Today for Peace Tomorrow" />
            <div className="space-y-4 text-ink/75 leading-relaxed">
              <p>
                At Serenity Planning, our mission is simple: to help families plan today so they can have peace of
                mind tomorrow. We understand how difficult funeral decisions can become when arrangements have not
                been made in advance.
              </p>
              <p>
                During a time of grief, families should be able to focus on remembering and honoring their loved
                one rather than worrying about difficult decisions and unexpected arrangements. That is why we
                believe pre-planning is an act of love.
              </p>
              <p>
                Our goal is not simply to provide funeral plans. Our goal is to serve families through education,
                honest guidance and personal attention.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionHeading eyebrow="Why Pre-Planning Matters" heading="An Act of Love for Your Family" />
          <p className="text-ink/70 leading-relaxed">
            Planning ahead removes guesswork and gives your loved ones clear direction during an emotional time. It
            allows you to make thoughtful decisions on your own terms, free from time pressure or financial strain
            on your family.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-warm">Founder</p>
            <div className="mx-auto mt-6 h-40 w-40 overflow-hidden rounded-full border-4 border-gold-warm/60 shadow-gold">
              <SafeImage
                src={founder.image || "/founder-ricardo.png"}
                alt={founder.name || "Ricardo Mercado"}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="mt-6 font-serif text-3xl font-semibold text-purple-deep">
              {founder.name || "Ricardo Mercado"}
            </h2>
            <p className="mt-4 font-serif text-xl italic text-purple-primary">
              &ldquo;{founder.quote || "Plan Today. Protect Tomorrow. Give Your Family Peace of Mind."}&rdquo;
            </p>
            <p className="mx-auto mt-6 max-w-xl text-ink/70 leading-relaxed">
              I want to thank God for allowing me the opportunity to help families and serve our community.
              Every family I&apos;ve had the privilege to guide is a blessing I don&apos;t take for granted.
            </p>
          </FadeIn>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <BenefitCard icon={Users} title="People First" description="Every conversation starts with listening." />
            <BenefitCard icon={Sunrise} title="Our Community" description="Proudly serving San Antonio families." />
            <BenefitCard icon={ShieldCheck} title="A Brighter Tomorrow" description="Helping families feel prepared and at ease." />
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <FadeIn>
            <SectionHeading
              align="left"
              eyebrow="My Why"
              heading={founder.storyHeading || "A Promise My Mother Made to Our Family"}
            />
            <div className="space-y-4 text-ink/75 leading-relaxed">
              {story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-8 font-serif text-xl italic text-purple-primary">
              {founder.closing ||
                "I don't share this message simply because it's my profession. I share it because I've lived it."}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Our Approach" heading="How We Support Every Family" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitCard icon={BookOpen} title="Education First" description="We explain every option clearly, in plain language." />
            <BenefitCard icon={HeartHandshake} title="Pressure-Free Planning" description="No sales pressure — ever. Just honest guidance." />
            <BenefitCard icon={Handshake} title="Personal Attention" description="Every family's situation is treated individually." />
            <BenefitCard icon={Users} title="Community Commitment" description="We're proud to serve San Antonio and beyond." />
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <PrimaryButton href="/booking">Schedule a Consultation</PrimaryButton>
      </section>
    </>
  );
}
