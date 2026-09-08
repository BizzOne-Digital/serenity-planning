import mongoose, { Schema, models, model } from "mongoose";

export interface IFAQ {
  _id: string;
  question: string;
  answer: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (models.FAQ as mongoose.Model<IFAQ>) || model<IFAQ>("FAQ", FAQSchema);
