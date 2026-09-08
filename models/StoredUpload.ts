import mongoose, { Schema, models, model } from "mongoose";

export interface IStoredUpload {
  _id: string;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const StoredUploadSchema = new Schema<IStoredUpload>(
  {
    folder: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export default (models.StoredUpload as mongoose.Model<IStoredUpload>) ||
  model<IStoredUpload>("StoredUpload", StoredUploadSchema);
