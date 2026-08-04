import mongoose, { Schema, type InferSchemaType } from "mongoose";

const designSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    templateId: { type: String, required: true },
    batchNumber: { type: Number, default: 1 },
    designIndex: { type: Number, required: true },
    category: { type: String,
    required: true,
    default: "modern",
    trim: true,
    lowercase: true
    },
    canvasState: { type: Schema.Types.Mixed, required: true },
    thumbnailUrl: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" }
  },
  { timestamps: true }
);

export type DesignDocument = InferSchemaType<typeof designSchema> & { _id: mongoose.Types.ObjectId };

export const Design = mongoose.model("Design", designSchema);
