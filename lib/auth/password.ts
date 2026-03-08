// Password utilities
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare plain text password with hashed password
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate random 6-digit password for teachers
 */
export function generateTeacherPassword(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate unique School ID
 * Format: SCH-YYYYMMDD-XXXX (e.g., SCH-20260228-0001)
 */
export function generateSchoolId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `SCH-${year}${month}${day}-${random}`;
}
