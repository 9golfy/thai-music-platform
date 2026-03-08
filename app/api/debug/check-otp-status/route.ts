/**
 * POST /api/debug/check-otp-status
 * 
 * Check OTP request status for debugging
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { checkOTPRequestRateLimit } from '@/lib/utils/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');
    
    // Get all drafts for this email
    const drafts = await draftsCollection.find({ email }).toArray();
    
    // Check rate limit status
    const rateLimit = await checkOTPRequestRateLimit(email);
    
    // Calculate time windows
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    
    // Get recent OTP requests
    const recentDrafts = await draftsCollection.find({
      email,
      lastOtpRequestAt: { $gte: thirtyMinutesAgo }
    }).toArray();
    
    const totalOTPRequests = recentDrafts.reduce(
      (sum, draft) => sum + (draft.otpRequestCount || 0),
      0
    );
    
    const draftSummary = drafts.map(draft => ({
      token: draft.draftToken || draft.token,
      submissionType: draft.submissionType,
      status: draft.status,
      createdAt: draft.createdAt,
      lastOtpRequestAt: draft.lastOtpRequestAt,
      otpRequestCount: draft.otpRequestCount || 0,
      saveCount: draft.saveCount || 0,
      withinThirtyMinutes: draft.lastOtpRequestAt ? new Date(draft.lastOtpRequestAt) >= thirtyMinutesAgo : false
    }));
    
    return NextResponse.json({
      success: true,
      email,
      totalDrafts: drafts.length,
      drafts: draftSummary,
      rateLimit: {
        allowed: rateLimit.allowed,
        remaining: rateLimit.remaining,
        resetAt: rateLimit.resetAt,
        totalOTPRequestsLast30Min: totalOTPRequests,
        limit: 10,
        windowMinutes: 30
      }
    });
    
  } catch (error) {
    console.error('Error checking OTP status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check OTP status' },
      { status: 500 }
    );
  }
}