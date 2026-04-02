/**
 * POST /api/draft/:token/submit
 * 
 * Convert a draft to a final submission.
 * This endpoint:
 * 1. Validates the draft token exists and is not expired
 * 2. Validates all required form fields are complete
 * 3. Generates School ID using existing school ID generation logic
 * 4. Creates user account with role='teacher'
 * 5. Creates submission record in appropriate collection
 * 6. Deletes or marks draft as submitted
 * 7. Sends submission success email with login credentials
 * 8. Returns School ID and submission ID to client
 * 
 * Requirements: US-5.1, US-5.2, US-5.3, US-5.4, US-5.5, US-5.7
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { isValidDraftToken } from '@/lib/utils/draftToken';
import { generateSchoolId, getNextSchoolIdSequence } from '@/lib/utils/schoolId';
import { hashPassword, generateTeacherPassword } from '@/lib/auth/password';
import { sendEmail } from '@/lib/email/mailer';
import { notifyAdminNewRegistration } from '@/lib/email/adminNotifications';
import { sendEmailWithRateLimit } from '@/lib/email/rateLimiter';
import {
  generateSubmissionSuccessEmailHTML,
  generateSubmissionSuccessEmailText,
  getSubmissionSuccessEmailSubject,
} from '@/lib/email/templates/submissionSuccess';

/**
 * Validate that all required fields are present in form data
 * This ensures the submission is complete before creating School ID and user account
 */
function validateFormData(formData: any, submissionType: string): { valid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  // Common required fields for both submission types
  if (!formData.schoolName || formData.schoolName.trim() === '') {
    missingFields.push('schoolName');
  }
  if (!formData.province || formData.province.trim() === '') {
    missingFields.push('province');
  }
  if (!formData.email || formData.email.trim() === '') {
    missingFields.push('email');
  }
  if (!formData.phone || formData.phone.trim() === '') {
    missingFields.push('phone');
  }
  
  // Add more validation based on submission type if needed
  // For now, we'll keep it simple and validate the core fields
  
  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * POST handler for draft submission
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { formData } = body;

    // Validate token format (Property 21: Token Unguessability)
    if (!isValidDraftToken(token)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid draft token format.',
        },
        { status: 400 }
      );
    }

    // Validate form data is provided
    if (!formData || typeof formData !== 'object') {
      return NextResponse.json(
        {
          success: false,
          message: 'Form data is required.',
        },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');
    const usersCollection = db.collection('users');

    // Fetch draft from database
    const draft = await draftsCollection.findOne({
      draftToken: token.toLowerCase(),
    });

    // Check if draft exists
    if (!draft) {
      return NextResponse.json(
        {
          success: false,
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
          message: 'This draft has already been submitted.',
        },
        { status: 400 }
      );
    }

    // Validate form data completeness (Property 12: Submission Validation Consistency)
    const validation = validateFormData(formData, draft.submissionType);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Form data is incomplete. Please fill in all required fields.',
          missingFields: validation.missingFields,
        },
        { status: 400 }
      );
    }

    // Generate School ID (Property 10: School ID Deferred Creation)
    // This is the FIRST TIME we create a School ID - not during draft save
    const sequence = await getNextSchoolIdSequence(db);
    const schoolId = generateSchoolId(sequence);

    // Generate temporary password for teacher
    const temporaryPassword = generateTeacherPassword();
    const hashedPassword = await hashPassword(temporaryPassword);

    // Create user account (Property 11: User Account Deferred Creation)
    // This is the FIRST TIME we create a user account - not during draft save
    const userExists = await usersCollection.findOne({
      email: draft.email.toLowerCase(),
    });

    if (userExists) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this email already exists. Please use a different email or contact support.',
        },
        { status: 400 }
      );
    }

    const newUser = {
      email: draft.email.toLowerCase(),
      password: hashedPassword,
      role: 'teacher',
      firstName: formData.mgtName || '',
      lastName: '',
      phone: draft.phone,
      schoolId: schoolId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userResult = await usersCollection.insertOne(newUser);

    // Prepare submission data
    const submissionData = {
      ...formData,
      schoolId,
      email: draft.email,
      phone: draft.phone,
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      fromDraft: true, // Mark that this came from a draft
      draftToken: token, // Keep reference to original draft
    };

    // Create submission record in appropriate collection (Property 32: Submission Record Creation)
    const collectionName = draft.submissionType === 'register100' 
      ? 'register100_submissions' 
      : 'register_support_submissions';
    
    const submissionsCollection = db.collection(collectionName);
    const submissionResult = await submissionsCollection.insertOne(submissionData);
    const submissionId = submissionResult.insertedId.toString();

    // Mark draft as submitted (Property 13: Draft Cleanup on Submission)
    await draftsCollection.updateOne(
      { draftToken: token.toLowerCase() },
      {
        $set: {
          status: 'submitted',
          submittedAt: new Date(),
          submissionId: submissionId,
        },
      }
    );

    // Send submission success email with login credentials (Property 14: Submission Credentials Email)
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://dcpschool100.net'}/teacher-login`;
    
    const emailHTML = generateSubmissionSuccessEmailHTML({
      email: draft.email,
      schoolId,
      password: temporaryPassword,
      schoolName: formData.schoolName,
      submissionType: draft.submissionType,
      loginUrl,
      submissionId,
    });

    const emailText = generateSubmissionSuccessEmailText({
      email: draft.email,
      schoolId,
      password: temporaryPassword,
      schoolName: formData.schoolName,
      submissionType: draft.submissionType,
      loginUrl,
      submissionId,
    });

    const emailSubject = getSubmissionSuccessEmailSubject(formData.schoolName);

    // Send user email with rate limiting
    const userEmailResult = await sendEmailWithRateLimit(
      () => sendEmail({
        to: draft.email,
        subject: emailSubject,
        html: emailHTML,
        text: emailText,
      }),
      'high' // High priority for user confirmation emails
    );

    if (!userEmailResult.success) {
      console.error('⚠️ Failed to send submission success email to:', draft.email);
      if (userEmailResult.rateLimited) {
        console.error('📧 User email was rate limited:', userEmailResult.error);
      }
      // Don't fail the request - submission was successful even if email failed
    }

    // Send admin notification email with rate limiting
    const adminEmailResult = await sendEmailWithRateLimit(
      () => notifyAdminNewRegistration(
        formData.schoolName,
        schoolId,
        draft.email,
        draft.submissionType,
        submissionId
      ),
      'medium' // Medium priority for admin notifications
    );

    if (!adminEmailResult.success) {
      console.error('⚠️ Failed to send admin notification email');
      if (adminEmailResult.rateLimited) {
        console.error('📧 Admin notification was rate limited:', adminEmailResult.error);
      }
      // Don't fail the request - this is just a notification
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Draft submitted successfully! Your school account has been created.',
        schoolId,
        submissionId,
        emailSent: userEmailResult.success,
        adminNotified: adminEmailResult.success,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error submitting draft:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit draft. Please try again.',
      },
      { status: 500 }
    );
  }
}
