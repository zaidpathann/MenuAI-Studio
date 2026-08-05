import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@menuai.com";
  const password = process.env.ADMIN_PASSWORD || "Zaid@6222";

  const normalizedEmail = email.toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);

  const existingAdmin = await User.findOne({
    $or: [{ email: normalizedEmail }, { role: "admin" }]
  });

  if (existingAdmin) {
    existingAdmin.email = normalizedEmail;
    existingAdmin.passwordHash = passwordHash;
    existingAdmin.role = "admin";
    existingAdmin.isActive = true;
    await existingAdmin.save();
  } else {
    await User.create({
      email: normalizedEmail,
      passwordHash,
      role: "admin",
      isActive: true
    });
  }
}
