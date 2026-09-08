import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import Service from "@/models/Service";
import FAQ from "@/models/FAQ";
import PageContent from "@/models/PageContent";

let seeded = false;

const DEFAULT_SERVICES = [
  {
    title: "Pre-Need Funeral Planning Consultation",
    slug: "pre-need-funeral-planning-consultation",
    shortDescription:
      "A caring, no-pressure conversation to discuss your wishes, answer your questions, and explain available funeral and cremation options.",
    fullDescription:
      "We start with a relaxed, judgment-free conversation about your family, your wishes and your questions. There is never any pressure or obligation — just honest information to help you feel confident about the choices ahead.",
    icon: "MessageCircleHeart",
    benefits: ["No-pressure conversation", "Clear explanations", "Your questions answered honestly"],
    displayOrder: 1,
  },
  {
    title: "Burial Pre-Need Plans",
    slug: "burial-pre-need-plans",
    shortDescription:
      "Plan important burial arrangements ahead of time and choose services that reflect your wishes and financial circumstances.",
    fullDescription:
      "Burial planning covers many decisions. We help you understand each one and document your preferences clearly so your family isn't left guessing during a difficult time.",
    icon: "Landmark",
    benefits: ["Document your burial wishes", "Understand available options", "Reduce future family stress"],
    displayOrder: 2,
  },
  {
    title: "Cremation Pre-Need Plans",
    slug: "cremation-pre-need-plans",
    shortDescription:
      "Understand cremation options and document your wishes clearly so your family knows exactly what you want.",
    fullDescription:
      "From service preferences to final arrangements, we walk you through cremation planning step by step so your family has clear direction when it matters most.",
    icon: "Flame",
    benefits: ["Clear documentation", "Flexible planning", "Peace of mind for your family"],
    displayOrder: 3,
  },
  {
    title: "Funeral & Memorial Service Planning",
    slug: "funeral-memorial-service-planning",
    shortDescription:
      "Plan a traditional funeral, visitation, memorial service, or personalized celebration of life.",
    fullDescription:
      "Whether you envision a traditional service or a personalized celebration of life, we help you outline the details in advance so your loved ones can focus on honoring your memory.",
    icon: "Church",
    benefits: ["Traditional or personalized services", "Visitation and memorial planning", "Guidance every step"],
    displayOrder: 4,
  },
  {
    title: "Personalized Funeral Planning",
    slug: "personalized-funeral-planning",
    shortDescription: "Create a plan that reflects your personality, beliefs, traditions and personal wishes.",
    fullDescription:
      "Your life story is unique, and your plan can be too. We help you shape a service that reflects your personality, beliefs and traditions.",
    icon: "Sparkles",
    benefits: ["Reflects your personality", "Honors beliefs and traditions", "Meaningful for your family"],
    displayOrder: 5,
  },
  {
    title: "Affordable Pre-Need Planning",
    slug: "affordable-pre-need-planning",
    shortDescription:
      "Review available plans and payment arrangements to help select an option appropriate for your circumstances.",
    fullDescription:
      "We review available plans and payment arrangements with you so you can select an option that fits your circumstances, with full transparency and no pressure.",
    icon: "HandCoins",
    benefits: ["Transparent information", "Options for various budgets", "No-pressure guidance"],
    displayOrder: 6,
  },
  {
    title: "Family Protection Through Advance Planning",
    slug: "family-protection-through-advance-planning",
    shortDescription: "Give your loved ones clear direction and reduce difficult decisions during an emotional time.",
    fullDescription:
      "Advance planning is one of the most thoughtful gifts you can give your family. It removes guesswork and gives your loved ones clear direction when they need it most.",
    icon: "ShieldCheck",
    benefits: ["Clear direction for your family", "Fewer difficult decisions", "An act of love"],
    displayOrder: 7,
  },
  {
    title: "Guidance Every Step of the Way",
    slug: "guidance-every-step-of-the-way",
    shortDescription:
      "We explain terminology, answer questions and guide you through your options before you make decisions.",
    fullDescription:
      "Funeral planning can involve unfamiliar terms and decisions. We take the time to explain everything clearly so you feel informed and confident.",
    icon: "Compass",
    benefits: ["Plain-language explanations", "Patient, personal guidance", "Confidence in your decisions"],
    displayOrder: 8,
  },
];

const DEFAULT_FAQS = [
  {
    question: "What is pre-need funeral planning?",
    answer:
      "Pre-need funeral planning means documenting your funeral or cremation wishes in advance, so your family has clear direction and fewer decisions to make during a difficult time.",
    displayOrder: 1,
  },
  {
    question: "Why should I plan in advance?",
    answer:
      "Planning ahead lets you make thoughtful decisions on your own timeline, rather than leaving your family to guess your wishes during a period of grief.",
    displayOrder: 2,
  },
  {
    question: "Can I choose burial or cremation?",
    answer:
      "Yes. We discuss both burial and cremation options during your consultation so you can choose what feels right for you and your family.",
    displayOrder: 3,
  },
  {
    question: "Can I change my wishes later?",
    answer:
      "In many cases plans can be reviewed and updated as your circumstances or wishes change. We can walk you through what that process looks like.",
    displayOrder: 4,
  },
  {
    question: "Do you offer affordable options?",
    answer:
      "We review available plans and payment arrangements with you so you can choose an option appropriate for your budget and circumstances.",
    displayOrder: 5,
  },
  {
    question: "Are consultations pressure-free?",
    answer:
      "Yes. Every conversation with Serenity Planning is no-pressure and no-obligation. Our goal is to inform and support you, not to push a sale.",
    displayOrder: 6,
  },
  {
    question: "What information should I bring to a consultation?",
    answer:
      "You don't need to bring anything specific. Simply come ready to talk about your wishes and any questions you have — we'll guide the rest.",
    displayOrder: 7,
  },
  {
    question: "Do you serve areas outside San Antonio?",
    answer:
      "We proudly serve San Antonio and many surrounding communities. Contact us to confirm availability in your specific area.",
    displayOrder: 8,
  },
];

export async function ensureSeeded() {
  if (seeded) return;
  await connectDB();

  const [settingsCount, servicesCount, faqsCount, contentCount] = await Promise.all([
    SiteSettings.countDocuments(),
    Service.countDocuments(),
    FAQ.countDocuments(),
    PageContent.countDocuments(),
  ]);

  if (settingsCount === 0) {
    await SiteSettings.create({});
  }

  if (servicesCount === 0) {
    await Service.insertMany(DEFAULT_SERVICES);
  }

  if (faqsCount === 0) {
    await FAQ.insertMany(DEFAULT_FAQS);
  }

  if (contentCount === 0) {
    await PageContent.insertMany([
      {
        page: "home",
        sections: {
          hero: {
            heading: "Give Your Loved Ones",
            headingEmphasis: "Peace of Mind",
            subtext:
              "Affordable burial and cremation planning with compassionate, pressure-free guidance for families in San Antonio and surrounding communities.",
            tagline: "Plan Today. Peace Tomorrow.",
            primaryCtaLabel: "Book a Consultation",
            primaryCtaHref: "/booking",
            secondaryCtaLabel: "Explore Planning Options",
            secondaryCtaHref: "/services",
            trustLine: "No Pressure • No Obligation • Honest Guidance",
          },
          intro: {
            heading: "Planning Ahead Is an Act of Love",
            body:
              "When you plan in advance, you spare your loved ones difficult decisions during an emotional time. It's one of the most caring gifts you can give your family.",
            ctaLabel: "Learn Why Families Plan Ahead",
            ctaHref: "/about",
          },
          founder: {
            heading: "A Personal Commitment to Every Family",
            body:
              "Serenity Planning was built on a simple belief: families deserve honest, pressure-free guidance when planning ahead.",
            name: "Ricardo Mercado",
            quote: "Helping families plan today for a more peaceful tomorrow.",
            ctaLabel: "Our Story",
            ctaHref: "/about",
          },
          finalCta: {
            heading: "Give Your Family the Gift of Peace of Mind",
            primaryCtaLabel: "Schedule Consultation",
            note: "No Pressure. No Obligation. Just Honest Guidance.",
          },
        },
        seo: {
          title: "Serenity Planning | Pre-Need Burial & Cremation Planning in San Antonio, TX",
          description:
            "Affordable, pressure-free burial and cremation planning for San Antonio families. Schedule a no-obligation consultation with Serenity Planning today.",
        },
      },
      {
        page: "about",
        sections: {
          hero: { heading: "Our Story", subtext: "Guiding San Antonio families with honesty and heart." },
        },
        seo: {
          title: "About Serenity Planning | Pre-Need Funeral Planning San Antonio",
          description: "Learn about Serenity Planning's mission to help San Antonio families plan ahead with peace of mind.",
        },
      },
      {
        page: "services",
        sections: {
          hero: { heading: "Pre-Need Planning With Compassion and Clarity" },
        },
        seo: {
          title: "Planning Services | Serenity Planning San Antonio",
          description: "Explore pre-need burial, cremation and memorial planning services offered by Serenity Planning.",
        },
      },
      {
        page: "contact",
        sections: {
          hero: { heading: "We're Here to Help You Plan With Peace of Mind" },
        },
        seo: {
          title: "Contact Serenity Planning | San Antonio, TX",
          description: "Reach out to Serenity Planning to schedule a no-pressure consultation about your funeral and cremation planning options.",
        },
      },
    ]);
  }

  seeded = true;
}
