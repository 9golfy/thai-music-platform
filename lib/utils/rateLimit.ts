/**
 * Rate Limiting Utilities for Save Draft Feature
 * 
 * Provides rate limiting for:
 * - Draft saves: Max 5 per hour per email
 * - OTP requests: Max 3 per hour per email
 * 
 * Rate limiting is tracked in MongoDB using timestamps and counters.
 */

import { connectToDatabase } from '@/lib/mongodb';

/**
 * Result of a rate limit check
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Rate limit configuration
 */
const RATE_LIMITS = {
  draftSave: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  },
  otpRequest: {
    maxRequests: 10, // Increased from 3 to 10
    windowMs: 30 * 60 * 1000, // Changed from 1 hour to 30 minutes
  },
};

/**
 * Check if draft save rate limit is exceeded for an email
 * 
 * @param email - Email address to check
 * @returns Rate limit result with allowed status, remaining requests, and reset time
 * 
 * @example
 * const result = await checkDraftSaveRateLimit('teacher@school.ac.th');
 * if (!result.allowed) {
 *   console.log(`Rate limited. Try again at ${result.resetAt}`);
 * }
 */
export async function checkDraftSaveRateLimit(email: string): Promise<RateLimitResult> {
  const { db } = await connectToDatabase();
  const draftsCollection = db.collection('draft_submissions');

  const oneHourAgo = new Date(Date.now() - RATE_LIMITS.draftSave.windowMs);

  // Count draft saves in the last hour for this email
  const recentSaves = await draftsCollection.countDocuments({
    email,
    lastSaveAt: { $gte: oneHourAgo },
  });

  const allowed = recentSaves < RATE_LIMITS.draftSave.maxRequests;
  const remaining = Math.max(0, RATE_LIMITS.draftSave.maxRequests - recentSaves);

  // Find the oldest save in the window to calculate reset time
  let resetAt = new Date(Date.now() + RATE_LIMITS.draftSave.windowMs);
  
  if (recentSaves > 0) {
    const oldestSave = await draftsCollection
      .find({ email, lastSaveAt: { $gte: oneHourAgo } })
      .sort({ lastSaveAt: 1 })
      .limit(1)
      .toArray();

    if (oldestSave.length > 0 && oldestSave[0].lastSaveAt) {
      resetAt = new Date(oldestSave[0].lastSaveAt.getTime() + RATE_LIMITS.draftSave.windowMs);
    }
  }

  return {
    allowed,
    remaining,
    resetAt,
  };
}

/**
 * Check if OTP request rate limit is exceeded for an email
 * 
 * @param email - Email address to check
 * @returns Rate limit result with allowed status, remaining requests, and reset time
 * 
 * @example
 * const result = await checkOTPRequestRateLimit('teacher@school.ac.th');
 * if (!result.allowed) {
 *   console.log(`Too many OTP requests. Try again at ${result.resetAt}`);
 * }
 */
export async function checkOTPRequestRateLimit(email: string): Promise<RateLimitResult> {
  const { db } = await connectToDatabase();
  const draftsCollection = db.collection('draft_submissions');

  const oneHourAgo = new Date(Date.now() - RATE_LIMITS.otpRequest.windowMs);

  // Find all drafts for this email with OTP requests in the last hour
  const draftsWithRecentOTP = await draftsCollection
    .find({
      email,
      lastOtpRequestAt: { $gte: oneHourAgo },
    })
    .toArray();

  // Sum up OTP request counts from all drafts
  const totalOTPRequests = draftsWithRecentOTP.reduce(
    (sum, draft) => sum + (draft.otpRequestCount || 0),
    0
  );

  const allowed = totalOTPRequests < RATE_LIMITS.otpRequest.maxRequests;
  const remaining = Math.max(0, RATE_LIMITS.otpRequest.maxRequests - totalOTPRequests);

  // Find the oldest OTP request in the window to calculate reset time
  let resetAt = new Date(Date.now() + RATE_LIMITS.otpRequest.windowMs);

  if (draftsWithRecentOTP.length > 0) {
    const oldestOTPRequest = draftsWithRecentOTP
      .filter(draft => draft.lastOtpRequestAt)
      .sort((a, b) => a.lastOtpRequestAt.getTime() - b.lastOtpRequestAt.getTime())[0];

    if (oldestOTPRequest && oldestOTPRequest.lastOtpRequestAt) {
      resetAt = new Date(
        oldestOTPRequest.lastOtpRequestAt.getTime() + RATE_LIMITS.otpRequest.windowMs
      );
    }
  }

  return {
    allowed,
    remaining,
    resetAt,
  };
}

/**
 * Increment rate limit counter for a draft save or OTP request
 * 
 * This function is called after a successful operation to update the rate limit tracking.
 * For draft saves, it updates the lastSaveAt timestamp and increments saveCount.
 * For OTP requests, it updates lastOtpRequestAt and increments otpRequestCount.
 * 
 * @param email - Email address
 * @param type - Type of rate limit ('draft' or 'otp')
 * 
 * @example
 * // After successful draft save
 * await incrementRateLimit('teacher@school.ac.th', 'draft');
 * 
 * // After successful OTP request
 * await incrementRateLimit('teacher@school.ac.th', 'otp');
 */
export async function incrementRateLimit(
  email: string,
  type: 'draft' | 'otp'
): Promise<void> {
  const { db } = await connectToDatabase();
  const draftsCollection = db.collection('draft_submissions');

  if (type === 'draft') {
    // Update lastSaveAt for all active drafts with this email
    await draftsCollection.updateMany(
      { email, status: 'active' },
      {
        $set: { lastSaveAt: new Date() },
        $inc: { saveCount: 1 },
      }
    );
  } else if (type === 'otp') {
    // Update lastOtpRequestAt for the specific draft
    // Note: This should be called with the draft token, but for rate limiting
    // we track by email across all drafts
    await draftsCollection.updateMany(
      { email, status: 'active' },
      {
        $set: { lastOtpRequestAt: new Date() },
        $inc: { otpRequestCount: 1 },
      }
    );
  }
}
