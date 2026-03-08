/**
 * OTP (One-Time Password) Utilities
 * 
 * Provides secure OTP generation, hashing, and verification for email verification
 * in the draft access flow. OTPs are 6-digit numeric codes that expire after 10 minutes.
 * 
 * Requirements: US-3.3, US-6.1, FR-6, NFR-3
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 * 
 * Uses crypto.getRandomValues for cryptographic randomness to ensure
 * the OTP cannot be predicted or guessed.
 * 
 * @returns A 6-digit numeric string (e.g., "123456")
 * 
 * Requirements: US-3.3, US-6.1, NFR-3
 */
export function generateOTP(): string {
  // Use crypto.getRandomValues for cryptographically secure random numbers
  const array = new Uint32Array(1);
  
  if (typeof window !== 'undefined' && window.crypto) {
    // Browser environment
    window.crypto.getRandomValues(array);
  } else if (typeof global !== 'undefined' && global.crypto) {
    // Node.js environment (v15+)
    global.crypto.getRandomValues(array);
  } else {
    // Fallback for older Node.js versions
    const crypto = require('crypto');
    const buffer = crypto.randomBytes(4);
    array[0] = buffer.readUInt32BE(0);
  }
  
  // Generate a number between 0 and 999999
  const randomNumber = array[0] % 1000000;
  
  // Pad with leading zeros to ensure 6 digits
  return randomNumber.toString().padStart(OTP_LENGTH, '0');
}

/**
 * Hash an OTP using bcrypt for secure storage
 * 
 * OTPs should never be stored in plain text. This function creates
 * a bcrypt hash that can be safely stored in the database.
 * 
 * @param otp - The 6-digit OTP to hash
 * @returns A promise that resolves to the bcrypt hash
 * 
 * Requirements: NFR-3 (OTP must not be stored in plain text)
 */
export async function hashOTP(otp: string): Promise<string> {
  if (!otp || otp.length !== OTP_LENGTH || !/^\d{6}$/.test(otp)) {
    throw new Error('Invalid OTP format. Must be exactly 6 digits.');
  }
  
  return bcrypt.hash(otp, SALT_ROUNDS);
}

/**
 * Verify an OTP against its stored hash
 * 
 * Uses bcrypt.compare to securely verify the OTP without exposing
 * the original value.
 * 
 * @param otp - The 6-digit OTP to verify
 * @param hash - The bcrypt hash to compare against
 * @returns A promise that resolves to true if the OTP matches, false otherwise
 * 
 * Requirements: US-3.4, US-6.3
 */
export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  if (!otp || otp.length !== OTP_LENGTH || !/^\d{6}$/.test(otp)) {
    return false;
  }
  
  if (!hash) {
    return false;
  }
  
  try {
    return await bcrypt.compare(otp, hash);
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}

/**
 * Check if an OTP has expired
 * 
 * OTPs expire after 10 minutes from generation. This function checks
 * if the expiry timestamp has passed.
 * 
 * @param expiresAt - The expiry date/time of the OTP
 * @returns True if the OTP has expired, false otherwise
 * 
 * Requirements: US-3.9, FR-6
 */
export function isOTPExpired(expiresAt: Date): boolean {
  if (!expiresAt) {
    return true;
  }
  
  const now = new Date();
  return now > expiresAt;
}

/**
 * Calculate the OTP expiry timestamp
 * 
 * Helper function to calculate when an OTP should expire (10 minutes from now).
 * 
 * @returns A Date object representing the expiry time
 */
export function getOTPExpiryTime(): Date {
  const now = new Date();
  return new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
}
