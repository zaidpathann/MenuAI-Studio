import mongoose, { Schema } from "mongoose";
const clientAccessSchema = new Schema({
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    accessKey: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastAccessedAt: { type: Date }
}, { timestamps: { createdAt: true, updatedAt: false } });
export const ClientAccess = mongoose.model("ClientAccess", clientAccessSchema);
