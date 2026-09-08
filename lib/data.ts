import { connectDB } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import Service from "@/models/Service";
import FAQ from "@/models/FAQ";
import Testimonial from "@/models/Testimonial";
import PageContent, { IPageContent } from "@/models/PageContent";
import SiteSettings from "@/models/SiteSettings";

export interface PlainService {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
  icon?: string;
  benefits: string[];
  displayOrder: number;
}

export interface PlainFAQ {
  _id: string;
  question: string;
  answer: string;
}

export interface PlainTestimonial {
  _id: string;
  name: string;
  quote: string;
}

function safe<T>(input: unknown): T {
  return JSON.parse(JSON.stringify(input)) as T;
}

export async function getPublishedServices(): Promise<PlainService[]> {
  await ensureSeeded();
  const services = await Service.find({ isPublished: true }).sort({ displayOrder: 1 }).lean();
  return safe(services);
}

export async function getPublishedFaqs(): Promise<PlainFAQ[]> {
  await ensureSeeded();
  const faqs = await FAQ.find({ isPublished: true }).sort({ displayOrder: 1 }).lean();
  return safe(faqs);
}

export async function getPublishedTestimonials(): Promise<PlainTestimonial[]> {
  await connectDB();
  const testimonials = await Testimonial.find({ isPublished: true }).sort({ displayOrder: 1 }).lean();
  return safe(testimonials);
}

export async function getPageContent(
  page: "home" | "about" | "services" | "contact"
): Promise<IPageContent | null> {
  await ensureSeeded();
  const content = await PageContent.findOne({ page }).lean<IPageContent | null>();
  return safe<IPageContent | null>(content);
}

export async function getSiteSettings() {
  await ensureSeeded();
  const settings = await SiteSettings.findOne().lean();
  return safe(settings);
}
