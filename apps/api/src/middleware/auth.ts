import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

type JwtPayload = {
  userId: string;
  role: "admin";
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "admin";
      };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!token) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Missing bearer token", details: {} }
      });
    }

    const secret = process.env.JWT_SECRET || "241c23f0abf6c28d4a2fb8912f44500573618628cd269e79e1f8cc2520ab3aea6885558961fe2a596b94078bd5468429c40e27be823e998df3bc9154ba404ca3";

    const payload = jwt.verify(token, secret) as JwtPayload;
    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Invalid user session", details: {} }
      });
    }

    req.user = { id: user._id.toString(), email: user.email, role: user.role };
    return next();
  } catch {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token", details: {} }
    });
  }
}
