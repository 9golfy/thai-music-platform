/**
 * POST /api/debug/reset-rate-limit
 * 
 * Reset rate limiting for a specific email (for debugging purposes only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

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
    
    // Reset rate limiting fields for the email
    const result = await draftsCollection.updateMany(
      { email },
      {
        $unset: {
          lastOtpRequestAt: '',
          otpRequestCount: '',
          lastSaveAt: '',
          saveCount: ''
        }
      }
    );
    
    console.log(`🔄 Reset rate limit for ${email}, updated ${result.modifiedCount} documents`);
    
    return NextResponse.json({
      success: true,
      message: `Rate limit reset for ${email}`,
      modifiedCount: result.modifiedCount
    });
    
  } catch (error) {
    console.error('Error resetting rate limit:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset rate limit' },
      { status: 500 }
    );
  }
}