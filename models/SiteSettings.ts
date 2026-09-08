import mongoose, { Schema, models, model } from "mongoose";

export interface ISiteSettings {
  _id: string;
  businessName: string;
  logo?: string;
  secondaryLogo?: string;
  favicon?: string;
  phone: string;
  email: string;
  serviceArea: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    other?: string;
  };
  primaryCtaLabel: string;
  primaryCtaDestination: string;
  footerText: string;
  businessHours: string;
  copyrightText: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: "Serenity Planning" },
    logo: { type: String, default: "" },
    secondaryLogo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    phone: { type: String, default: "210-854-9095" },
    email: { type: String, default: "Serenityplanning210@gmail.com" },
    serviceArea: { type: String, default: "San Antonio, TX and surrounding communities" },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      other: { type: String, default: "" },
    },
    primaryCtaLabel: { type: String, default: "Book a Consultation" },
    primaryCtaDestination: { type: String, default: "/booking" },
    footerText: {
      type: String,
      default: "Compassionate, pressure-free pre-need funeral and cremation planning for San Antonio families.",
    },
    businessHours: { type: String, default: "By Appointment" },
    copyrightText: { type: String, default: `Serenity Planning. All rights reserved.` },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default (models.SiteSettings as mongoose.Model<ISiteSettings>) ||
  model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
