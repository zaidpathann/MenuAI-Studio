import mongoose, { Schema, type InferSchemaType } from "mongoose";

const uploadedFileSchema = new Schema(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    restaurantName: { type: String, required: true, trim: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    extractedData: { type: Schema.Types.Mixed },
    inputSource: { type: String, enum: ["pdf", "image", "manual"] },
    uploadedFiles: { type: [uploadedFileSchema], default: [] },
    publishedAt: { type: Date },
    pdfContentBase64: { type: String, select: false }
  },
  { timestamps: true }
);

export type ProjectDocument = InferSchemaType<typeof projectSchema> & { _id: mongoose.Types.ObjectId };

export const Project = mongoose.model("Project", projectSchema);
