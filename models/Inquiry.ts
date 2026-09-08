import mongoose, { Schema, models, model } from "mongoose";

export interface IInquiry {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  planningFor: string;
  interestedIn: string;
  preferredContactMethod: string;
  message: string;
  consent: boolean;
  status: "new" | "reviewed" | "contacted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    planningFor: { type: String, default: "" },
    interestedIn: { type: String, default: "" },
    preferredContactMethod: { type: String, default: "Email" },
    message: { type: String, default: "" },
    consent: { type: Boolean, default: false },
    status: { type: String, enum: ["new", "reviewed", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default (models.Inquiry as mongoose.Model<IInquiry>) || model<IInquiry>("Inquiry", InquirySchema);
