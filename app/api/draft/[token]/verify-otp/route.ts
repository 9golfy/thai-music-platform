/**
 * POST /api/draft/:token/verify-otp
 * 
 * Verifies OTP and returns draft data for cross-device access.
 * 
 * Requirements: US-3.4, US-3.5, US-6.3, US-6.6
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyOTP, isOTPExpired } from '@/lib/utils/otp';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { otp } = body;

    // Validate OTP format (6 digits)
    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: 'OTP must be exactly 6 digits.',
        },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');

    // Fetch draft
    const draft = await draftsCollection.findOne({
      $or: [
        { draftToken: token },
        { token: token }
      ]
    });

    if (!draft) {
      return NextResponse.json(
        {
          success: false,
          message: 'Draft not found or expired.',
        },
        { status: 404 }
      );
    }

    // Check if draft is locked
    if (draft.status === 'locked') {
      return NextResponse.json(
        {
          success: false,
          message: 'Draft locked due to too many failed attempts. Please contact support.',
        },
        { status: 403 }
      );
    }

    // Check if OTP exists
    if (!draft.otp || !draft.otpExpiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: 'No OTP found. Please request a new OTP.',
        },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (isOTPExpired(draft.otpExpiresAt)) {
      return NextResponse.json(
        {
          success: false,
          message: 'OTP has expired. Please request a new one.',
          expired: true,
        },
        { status: 401 }
      );
    }

    // Verify OTP
    const isValid = await verifyOTP(otp, draft.otp);

    if (!isValid) {
      // Increment failed attempt counter
      const newAttempts = (draft.otpAttempts || 0) + 1;
      
      // Lock draft after 5 failed attempts
      if (newAttempts >= 5) {
        await draftsCollection.updateOne(
          {
            $or: [
              { draftToken: token },
              { token: token }
            ]
          },
          {
            $set: { status: 'locked' },
            $inc: { otpAttempts: 1 },
          }
        );

        return NextResponse.json(
          {
            success: false,
            message: 'Too many failed attempts. Draft locked for security.',
          },
          { status: 403 }
        );
      }

      // Increment attempts
      await draftsCollection.updateOne(
        {
          $or: [
            { draftToken: token },
            { token: token }
          ]
        },
        { $inc: { otpAttempts: 1 } }
      );

      return NextResponse.json(
        {
          success: false,
          message: `Invalid OTP. ${5 - newAttempts} attempts remaining.`,
          remainingAttempts: 5 - newAttempts,
        },
        { status: 401 }
      );
    }

    // OTP is valid - clear OTP and return draft data
    await draftsCollection.updateOne(
      {
        $or: [
          { draftToken: token },
          { token: token }
        ]
      },
      {
        $unset: { otp: '', otpExpiresAt: '' },
        $set: { otpAttempts: 0 },
      }
    );

    // Return form data on success
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully.',
      formData: draft.formData,
      currentStep: draft.currentStep,
      submissionType: draft.submissionType,
      email: draft.email,
      phone: draft.phone,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to verify OTP. Please try again.',
      },
      { status: 500 }
    );
  }
}
