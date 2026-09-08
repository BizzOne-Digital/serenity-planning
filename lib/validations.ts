import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a valid phone number."),
  planningFor: z.string().min(1, "Please select who you are planning for."),
  planType: z.enum(["burial", "cremation", "notSure"]),
  preferredDate: z.string().optional().default(""),
  preferredTime: z.string().optional().default(""),
  preferredContactMethod: z.string().min(1, "Please select a preferred contact method."),
  notes: z.string().optional().default(""),
  website: z.string().max(0, "Spam detected.").optional().default(""),
});

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional().default(""),
  planningFor: z.string().optional().default(""),
  interestedIn: z.string().min(1, "Please select what you're interested in."),
  preferredContactMethod: z.string().min(1, "Please select a preferred contact method."),
  message: z.string().min(5, "Please add a short message."),
  consent: z.boolean().refine((v) => v === true, "Please confirm consent to be contacted."),
  website: z.string().max(0, "Spam detected.").optional().default(""),
});

export const serviceSchema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and hyphens."),
  shortDescription: z.string().min(2),
  fullDescription: z.string().optional().default(""),
  image: z.string().optional().default(""),
  icon: z.string().optional().default("HeartHandshake"),
  benefits: z.array(z.string()).optional().default([]),
  displayOrder: z.number().optional().default(0),
  isPublished: z.boolean().optional().default(true),
});

export const serviceUpdateSchema = serviceSchema.partial();

export const settingsSchema = z.object({
  businessName: z.string().min(1).optional(),
  logo: z.string().optional(),
  secondaryLogo: z.string().optional(),
  favicon: z.string().optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional(),
  serviceArea: z.string().optional(),
  socialLinks: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      other: z.string().optional(),
    })
    .optional(),
  primaryCtaLabel: z.string().optional(),
  primaryCtaDestination: z.string().optional(),
  footerText: z.string().optional(),
  businessHours: z.string().optional(),
  copyrightText: z.string().optional(),
});

export const testimonialSchema = z.object({
  name: z.string().min(1),
  quote: z.string().min(1),
  isPublished: z.boolean().optional().default(true),
  displayOrder: z.number().optional().default(0),
});

export const testimonialUpdateSchema = testimonialSchema.partial();

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  displayOrder: z.number().optional().default(0),
  isPublished: z.boolean().optional().default(true),
});

export const faqUpdateSchema = faqSchema.partial();

export const appointmentUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "scheduled", "completed", "cancelled"]).optional(),
  adminNotes: z.string().optional(),
});

export const inquiryUpdateSchema = z.object({
  status: z.enum(["new", "reviewed", "contacted", "closed"]).optional(),
});

export const contentUpdateSchema = z.object({
  page: z.enum(["home", "about", "services", "contact"]),
  sections: z.record(z.any()).optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.string().optional(),
      ogTitle: z.string().optional(),
      ogDescription: z.string().optional(),
      ogImage: z.string().optional(),
      canonical: z.string().optional(),
    })
    .optional(),
});

export function zodErrorToFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}
