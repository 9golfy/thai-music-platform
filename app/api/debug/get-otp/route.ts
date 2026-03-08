/**
 * POST /api/debug/get-otp
 * 
 * Get current OTP for a draft token (for testing purposes only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');
    
    // Find draft by token
    const draft = await draftsCollection.findOne({
      $or: [
        { draftToken: token.toLowerCase() },
        { token: token.toLowerCase() }
      ]
    });
    
    if (!draft) {
      return NextResponse.json(
        { success: false, message: 'Draft not found' },
        { status: 404 }
      );
    }
    
    // For testing purposes, we'll generate a test OTP
    // In real scenario, the actual OTP would be sent via email
    const testOtp = '123456';
    
    // Hash the test OTP and update the draft
    const hashedOTP = await bcrypt.hash(testOtp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await draftsCollection.updateOne(
      { _id: draft._id },
      {
        $set: {
          otp: hashedOTP,
          otpExpiresAt,
        }
      }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Test OTP generated',
      otp: testOtp, // Only for testing - never return real OTP
      expiresAt: otpExpiresAt.toISOString()
    });
    
  } catch (error) {
    console.error('Error getting OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get OTP' },
      { status: 500 }
    );
  }
}