/**
 * GET /api/draft/:token/data
 * 
 * Retrieve draft form data for a given token.
 * This endpoint returns the actual form data for draft restoration.
 * Used when loading a draft via URL token parameter.
 * 
 * Requirements: US-3.1, US-2.1
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { isValidDraftToken } from '@/lib/utils/draftToken';

/**
 * GET handler for draft form data retrieval
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    // Validate token format
    if (!isValidDraftToken(token)) {
      return NextResponse.json(
        {
          success: false,
          exists: false,
          message: 'Invalid draft token format. The link may be corrupted.',
        },
        { status: 400 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');
    
    // Fetch draft from database
    const draft = await draftsCollection.findOne({
      $or: [
        { draftToken: token.toLowerCase() },
        { token: token.toLowerCase() }
      ]
    });
    
    // Check if draft exists
    if (!draft) {
      return NextResponse.json(
        {
          success: false,
          exists: false,
          message: 'Draft not found. It may have been deleted or already submitted.',
        },
        { status: 404 }
      );
    }
    
    // Check if draft is expired
    const now = new Date();
    if (draft.expiresAt && new Date(draft.expiresAt) < now) {
      return NextResponse.json(
        {
          success: false,
          exists: false,
          expired: true,
          message: 'This draft has expired. Drafts are only valid for 7 days.',
        },
        { status: 410 }
      );
    }
    
    // Check if draft was already submitted
    if (draft.status === 'submitted') {
      return NextResponse.json(
        {
          success: false,
          exists: false,
          message: 'This draft has already been submitted.',
        },
        { status: 410 }
      );
    }
    
    // Return complete draft data for form restoration
    return NextResponse.json(
      {
        success: true,
        exists: true,
        email: draft.email,
        phone: draft.phone || '',
        submissionType: draft.submissionType,
        currentStep: draft.currentStep,
        formData: draft.formData || {},
        draftToken: draft.draftToken || draft.token,
        expiresAt: draft.expiresAt.toISOString(),
        lastModified: draft.lastModified.toISOString(),
        status: draft.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving draft data:', error);
    
    return NextResponse.json(
      {
        success: false,
        exists: false,
        message: 'An error occurred while retrieving the draft data. Please try again.',
      },
      { status: 500 }
    );
  }
}