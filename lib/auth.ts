import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Default admin credentials (should be changed after first login)
export const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123", // Change this!
};

export interface User {
  username: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(user: User): string {
  return jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    return decoded;
  } catch {
    return null;
  }
}

