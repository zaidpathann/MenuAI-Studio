import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };

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

  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
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

export async function me(req: Request, res: Response) {
  res.json({ user: req.user });
}
