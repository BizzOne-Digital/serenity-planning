import mongoose, { Schema, models, model } from "mongoose";

export interface IService {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
  icon?: string;
  benefits: string[];
  displayOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, default: "" },
    image: { type: String, default: "" },
    icon: { type: String, default: "HeartHandshake" },
    benefits: { type: [String], default: [] },
    displayOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (models.Service as mongoose.Model<IService>) || model<IService>("Service", ServiceSchema);
