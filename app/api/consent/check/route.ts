/**
 * POST /api/consent/check
 * 
 * Check if user has previously consented to terms and conditions.
 * This prevents showing consent modal repeatedly across devices.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, submissionType } = body;

    if (!email || !submissionType) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and submission type are required.',
        },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const consentsCollection = db.collection('user_consents');

    // Check if user has consented before
    const existingConsent = await consentsCollection.findOne({
      email: email.toLowerCase(),
      submissionType,
      consented: true,
    });

    return NextResponse.json({
      success: true,
      hasConsented: !!existingConsent,
      consentDate: existingConsent?.consentDate || null,
    });
  } catch (error) {
    console.error('Error checking consent status:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check consent status.',
        hasConsented: false, // Default to false on error
      },
      { status: 500 }
    );
  }
}