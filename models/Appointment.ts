import mongoose, { Schema, models, model } from "mongoose";

export interface IAppointment {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  planningFor: string;
  planType: "burial" | "cremation" | "notSure";
  preferredDate: string;
  preferredTime: string;
  preferredContactMethod: string;
  notes?: string;
  status: "new" | "contacted" | "scheduled" | "completed" | "cancelled";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    planningFor: { type: String, default: "" },
    planType: { type: String, enum: ["burial", "cremation", "notSure"], default: "notSure" },
    preferredDate: { type: String, default: "" },
    preferredTime: { type: String, default: "" },
    preferredContactMethod: { type: String, default: "Phone" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "scheduled", "completed", "cancelled"],
      default: "new",
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default (models.Appointment as mongoose.Model<IAppointment>) ||
  model<IAppointment>("Appointment", AppointmentSchema);
