/**
 * Draft Token Utilities
 * 
 * Provides secure draft token generation and validation for the save draft feature.
 * Tokens are UUID v4 format (128-bit cryptographically secure random values) that
 * are unguessable and used to access saved drafts without authentication.
 * 
 * Requirements: FR-2, FR-3, NFR-3
 */

import { randomUUID } from 'crypto';

/**
 * UUID v4 format regex for validation
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * where x is any hexadecimal digit and y is one of 8, 9, A, or B
 */
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Generate a cryptographically secure UUID v4 draft token
 * 
 * Uses Node.js crypto.randomUUID() which generates a random RFC 4122 version 4 UUID.
 * The UUID is 128 bits of randomness, making it cryptographically unguessable
 * (2^122 possible values after accounting for version and variant bits).
 * 
 * @returns A UUID v4 string (e.g., "550e8400-e29b-41d4-a716-446655440000")
 * 
 * Requirements: FR-2, FR-3, NFR-3
 * 
 * @example
 * const token = generateDraftToken();
 * console.log(token); // "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateDraftToken(): string {
  // randomUUID() is available in Node.js 14.17.0+ and uses crypto.getRandomValues
  // internally for cryptographically secure random number generation
  return randomUUID();
}

/**
 * Validate that a string is a valid UUID v4 format
 * 
 * Checks if the provided token matches the UUID v4 format specification.
 * This is used to validate tokens before database lookups to prevent
 * invalid queries and potential injection attacks.
 * 
 * @param token - The token string to validate
 * @returns True if the token is a valid UUID v4, false otherwise
 * 
 * Requirements: FR-3, NFR-3
 * 
 * @example
 * isValidDraftToken("550e8400-e29b-41d4-a716-446655440000"); // true
 * isValidDraftToken("invalid-token"); // false
 * isValidDraftToken("550e8400-e29b-31d4-a716-446655440000"); // false (version 3, not 4)
 */
export function isValidDraftToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  return UUID_V4_REGEX.test(token);
}

/**
 * Validate and sanitize a draft token
 * 
 * Validates the token format and returns it in lowercase for consistent
 * database lookups. Throws an error if the token is invalid.
 * 
 * @param token - The token string to validate and sanitize
 * @returns The sanitized token in lowercase
 * @throws Error if the token is invalid
 * 
 * Requirements: FR-3, NFR-3
 * 
 * @example
 * const sanitized = validateAndSanitizeDraftToken("550E8400-E29B-41D4-A716-446655440000");
 * console.log(sanitized); // "550e8400-e29b-41d4-a716-446655440000"
 */
export function validateAndSanitizeDraftToken(token: string): string {
  if (!isValidDraftToken(token)) {
    throw new Error('Invalid draft token format. Must be a valid UUID v4.');
  }
  
  // Return lowercase for consistent database lookups
  return token.toLowerCase();
}
