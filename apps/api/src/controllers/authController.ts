import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

export async function login(req: Request, res: Response) {
  const { email, password } = (req.body || {}) as { email?: string; password?: string };

  if (!email || !password) {
    throw new AppError(400, "VALIDATION_ERROR", "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase(), isActive: true });

  if (!user || !user.passwordHash) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const secret = process.env.JWT_SECRET || "241c23f0abf6c28d4a2fb8912f44500573618628cd269e79e1f8cc2520ab3aea6885558961fe2a596b94078bd5468429c40e27be823e998df3bc9154ba404ca3";

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
