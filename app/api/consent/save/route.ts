/**
 * POST /api/consent/save
 * 
 * Save user consent to terms and conditions.
 * This allows cross-device consent tracking.
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

    // Save or update consent record
    const consentRecord = {
      email: email.toLowerCase(),
      submissionType,
      consented: true,
      consentDate: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    await consentsCollection.updateOne(
      { 
        email: email.toLowerCase(), 
        submissionType 
      },
      { 
        $set: consentRecord 
      },
      { 
        upsert: true 
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Consent saved successfully.',
      consentDate: consentRecord.consentDate,
    });
  } catch (error) {
    console.error('Error saving consent:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save consent.',
      },
      { status: 500 }
    );
  }
}