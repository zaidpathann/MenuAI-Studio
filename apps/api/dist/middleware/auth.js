import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
export async function requireAuth(req, res, next) {
    try {
        const header = req.header("Authorization");
        const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
        if (!token) {
            return res.status(401).json({
                error: { code: "UNAUTHORIZED", message: "Missing bearer token", details: {} }
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is required");
        }
        const payload = jwt.verify(token, secret);
        const user = await User.findById(payload.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({
                error: { code: "UNAUTHORIZED", message: "Invalid user session", details: {} }
            });
        }
        req.user = { id: user._id.toString(), email: user.email, role: user.role };
        return next();
    }
    catch {
        return res.status(401).json({
            error: { code: "UNAUTHORIZED", message: "Invalid or expired token", details: {} }
        });
    }
}
