import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date }
}, { timestamps: { createdAt: true, updatedAt: false } });
export const User = mongoose.model("User", userSchema);
