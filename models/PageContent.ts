import mongoose, { Schema, models, model } from "mongoose";

export interface ISeo {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export interface IPageContent {
  _id: string;
  page: "home" | "about" | "services" | "contact";
  sections: Record<string, unknown>;
  seo: ISeo;
  updatedAt: Date;
}

const SeoSchema = new Schema<ISeo>(
  {
    title: String,
    description: String,
    keywords: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    canonical: String,
  },
  { _id: false }
);

const PageContentSchema = new Schema<IPageContent>(
  {
    page: { type: String, enum: ["home", "about", "services", "contact"], required: true, unique: true },
    sections: { type: Schema.Types.Mixed, default: {} },
    seo: { type: SeoSchema, default: {} },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default (models.PageContent as mongoose.Model<IPageContent>) ||
  model<IPageContent>("PageContent", PageContentSchema);
