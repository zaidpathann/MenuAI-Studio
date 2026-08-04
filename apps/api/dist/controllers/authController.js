import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";
export async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError(400, "VALIDATION_ERROR", "Email and password are required");
    }
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true });
    if (!user) {
        throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
        throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is required");
    }
    user.lastLoginAt = new Date();
    await user.save();
    const expiresIn = (process.env.JWT_EXPIRES_IN || "7d");
    const token = jwt.sign({ userId: user._id.toString(), role: user.role }, secret, { expiresIn });
    res.json({
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role
        }
    });
}
export async function me(req, res) {
    res.json({ user: req.user });
}
