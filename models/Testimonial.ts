import mongoose, { Schema, models, model } from "mongoose";

export interface ITestimonial {
  _id: string;
  name: string;
  quote: string;
  isPublished: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    quote: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default (models.Testimonial as mongoose.Model<ITestimonial>) ||
  model<ITestimonial>("Testimonial", TestimonialSchema);
