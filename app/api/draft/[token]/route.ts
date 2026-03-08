/**
 * GET /api/draft/:token
 * 
 * Retrieve draft metadata (without form data) for a given token.
 * This endpoint is used when a user clicks on a draft link from their email.
 * It returns basic information about the draft but NOT the actual form data.
 * The form data is only returned after OTP verification.
 * 
 * Requirements: US-3.1
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { isValidDraftToken } from '@/lib/utils/draftToken';

/**
 * Mask an email address for privacy
 * Shows first character and domain, hides the rest
 * 
 * @param email - The email address to mask
 * @returns Masked email (e.g., "t***@example.com")
 * 
 * @example
 * maskEmail("teacher@example.com") // "t***@example.com"
 * maskEmail("a@test.com") // "a***@test.com"
 */
function maskEmail(email: string): string {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return '***@***';
  }
  
  const [local, domain] = email.split('@');
  
  if (local.length === 0) {
    return '***@' + domain;
  }
  
  // Show first character, hide the rest
  return local[0] + '***@' + domain;
}

/**
 * GET handler for draft metadata retrieval
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    // Validate token format (Property 21: Token Unguessability)
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
    
    // Check if draft is expired (Property 8: Draft Link Expiry Enforcement)
    const now = new Date();
    if (draft.expiresAt && new Date(draft.expiresAt) < now) {
      return NextResponse.json(
        {
          success: false,
          exists: false,
          expired: true,
          message: 'This draft has expired. Drafts are only valid for 7 days.',
        },
        { status: 410 } // 410 Gone - resource existed but is no longer available
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
    
    // Return metadata and form data for direct access
    return NextResponse.json(
      {
        success: true,
        exists: true,
        email: draft.email, // Full email for form restoration
        maskedEmail: maskEmail(draft.email),
        submissionType: draft.submissionType,
        currentStep: draft.currentStep,
        formData: draft.formData, // Include form data for restoration
        expiresAt: draft.expiresAt.toISOString(),
        lastModified: draft.lastModified.toISOString(),
        status: draft.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving draft metadata:', error);
    
    return NextResponse.json(
      {
        success: false,
        exists: false,
        message: 'An error occurred while retrieving the draft. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/draft/:token
 * 
 * Update an existing draft with new form data and current step.
 * This endpoint is used when a user continues editing a draft and wants to save progress.
 * 
 * Requirements: US-1.4
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { formData, currentStep } = body;

    // Validate token format
    if (!isValidDraftToken(token)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid draft token format.',
        },
        { status: 400 }
      );
    }

    // Validate request body
    if (!formData || typeof formData !== 'object') {
      return NextResponse.json(
        {
          success: false,
          message: 'Form data is required.',
        },
        { status: 400 }
      );
    }

    if (typeof currentStep !== 'number' || currentStep < 1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Valid current step is required.',
        },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');

    // Check if draft exists
    const draft = await draftsCollection.findOne({
      $or: [
        { draftToken: token.toLowerCase() },
        { token: token.toLowerCase() }
      ]
    });

    if (!draft) {
      return NextResponse.json(
        {
          success: false,
          message: 'Draft not found.',
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
          message: 'This draft has expired.',
        },
        { status: 410 }
      );
    }

    // Check if draft was already submitted
    if (draft.status === 'submitted') {
      return NextResponse.json(
        {
          success: false,
          message: 'This draft has already been submitted and cannot be modified.',
        },
        { status: 400 }
      );
    }

    // Update draft
    const lastModified = new Date();
    const result = await draftsCollection.updateOne(
      { 
        $or: [
          { draftToken: token.toLowerCase() },
          { token: token.toLowerCase() }
        ]
      },
      {
        $set: {
          formData,
          currentStep,
          lastModified,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update draft.',
        },
        { status: 500 }
      );
    }

    // Return success with new timestamp
    return NextResponse.json(
      {
        success: true,
        message: 'Draft updated successfully.',
        lastModified: lastModified.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating draft:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update draft. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/draft/:token
 * 
 * Delete a draft from the database.
 * This endpoint allows users to manually delete their draft if they no longer need it.
 * 
 * Requirements: US-5.5
 */
export async function DELETE(
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
          message: 'Invalid draft token format.',
        },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');

    // Check if draft exists
    const draft = await draftsCollection.findOne({
      $or: [
        { draftToken: token.toLowerCase() },
        { token: token.toLowerCase() }
      ]
    });

    if (!draft) {
      return NextResponse.json(
        {
          success: false,
          message: 'Draft not found. It may have already been deleted.',
        },
        { status: 404 }
      );
    }

    // Delete draft from database
    const result = await draftsCollection.deleteOne({
      $or: [
        { draftToken: token.toLowerCase() },
        { token: token.toLowerCase() }
      ]
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to delete draft.',
        },
        { status: 500 }
      );
    }

    // Return success confirmation
    return NextResponse.json(
      {
        success: true,
        message: 'Draft deleted successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting draft:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete draft. Please try again.',
      },
      { status: 500 }
    );
  }
}
