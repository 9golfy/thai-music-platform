/**
 * POST /api/draft/save
 * 
 * Save a draft of the registration form to the database.
 * Validates input, generates a unique token, stores the draft,
 * and sends an email with the draft link.
 * 
 * Requirements: US-1.3, US-1.5, FR-2, FR-3, FR-9
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { generateDraftToken } from '@/lib/utils/draftToken';
import { checkDraftSaveRateLimit, incrementRateLimit } from '@/lib/utils/rateLimit';
import { generateOTP, hashOTP, getOTPExpiryTime } from '@/lib/utils/otp';
import {
  generateDraftSaveEmailHTML,
  generateDraftSaveEmailText,
  getDraftSaveEmailSubject,
} from '@/lib/email/templates/draftSave';

/**
 * Email validation regex
 * Matches standard email format: local@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex
 * Matches 10-digit Thai phone numbers
 */
const PHONE_REGEX = /^[0-9]{10}$/;

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Check length (max 254 characters per RFC 5321)
  if (email.length > 254) {
    return false;
  }
  
  return EMAIL_REGEX.test(email);
}

/**
 * Validate phone format
 */
function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  return PHONE_REGEX.test(phone);
}

/**
 * Validate submission type
 */
function isValidSubmissionType(type: string): boolean {
  return type === 'register100' || type === 'register-support';
}

/**
 * Send draft save email with OTP
 */
async function sendDraftSaveEmail(
  email: string,
  draftToken: string,
  otp: string,
  submissionType: 'register100' | 'register-support',
  currentStep: number,
  expiresAt: Date,
  otpExpiresAt: Date
): Promise<boolean> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Generate email content
    const subject = getDraftSaveEmailSubject(submissionType);
    const htmlContent = generateDraftSaveEmailHTML({
      email,
      draftToken,
      otp,
      submissionType,
      currentStep,
      expiresAt,
      otpExpiresAt,
      appUrl,
    });
    
    const textContent = generateDraftSaveEmailText({
      email,
      draftToken,
      otp,
      submissionType,
      currentStep,
      expiresAt,
      otpExpiresAt,
      appUrl,
    });
    
    // Import sendEmail dynamically to avoid circular dependencies
    const { sendEmail } = await import('@/lib/email/mailer');
    
    // Send email
    const sent = await sendEmail({
      to: email,
      subject,
      html: htmlContent,
      text: textContent,
    });
    
    console.log('Draft save email sent to:', email, 'Success:', sent);
    
    return sent;
  } catch (error) {
    console.error('Failed to send draft save email:', error);
    return false;
  }
}

/**
 * POST handler for draft save
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, phone, submissionType, formData, currentStep } = body;
    
    // Validate required fields
    if (!email || !phone || !submissionType || !formData || typeof currentStep !== 'number') {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields. Please provide email, phone, submissionType, formData, and currentStep.',
        },
        { status: 400 }
      );
    }
    
    // Validate email format (Property 23: Email Validation Enforcement)
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format. Please provide a valid email address.',
        },
        { status: 400 }
      );
    }
    
    // Validate phone format
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid phone format. Please provide a 10-digit phone number.',
        },
        { status: 400 }
      );
    }
    
    // Validate submission type
    if (!isValidSubmissionType(submissionType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid submission type. Must be register100 or register-support.',
        },
        { status: 400 }
      );
    }
    
    // Validate current step
    if (currentStep < 1 || currentStep > 8) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid current step. Must be between 1 and 8.',
        },
        { status: 400 }
      );
    }
    
    // Check rate limiting
    const rateLimit = await checkDraftSaveRateLimit(email);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many draft save attempts. Please try again after ${rateLimit.resetAt.toLocaleTimeString()}.`,
          resetAt: rateLimit.resetAt.toISOString(),
        },
        { status: 429 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const draftsCollection = db.collection('draft_submissions');
    
    // Generate unique draft token (Property 2: Manual Save Creates Database Record)
    const draftToken = generateDraftToken();
    
    // Generate 6-digit OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const otpExpiresAt = getOTPExpiryTime();
    
    // Calculate expiry date (7 days from now)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Check if draft already exists for this email and submission type
    // (Property 19: One Draft Per Email Per Type)
    const existingDraft = await draftsCollection.findOne({
      email,
      submissionType,
      status: 'active',
    });
    
    if (existingDraft) {
      // Update existing draft
      await draftsCollection.updateOne(
        { _id: existingDraft._id },
        {
          $set: {
            token: draftToken,      // Use 'token' field name consistently
            draftToken,             // Keep both for compatibility
            formData,
            currentStep,
            lastModified: now,
            expiresAt,
            saveCount: (existingDraft.saveCount || 0) + 1,
            lastSaveAt: now,
            otp: hashedOTP,
            otpExpiresAt,
            lastOtpRequestAt: now,
          },
          $inc: {
            otpRequestCount: 1,
          },
        }
      );
    } else {
      // Create new draft record
      await draftsCollection.insertOne({
        token: draftToken,  // Use 'token' field name consistently
        draftToken,         // Keep both for compatibility
        email,
        phone,
        submissionType,
        formData,
        currentStep,
        createdAt: now,
        lastModified: now,
        expiresAt,
        status: 'active',
        saveCount: 1,
        lastSaveAt: now,
        otp: hashedOTP,
        otpExpiresAt,
        lastOtpRequestAt: now,
        otpAttempts: 0,
        otpRequestCount: 1,
      });
    }
    
    // Increment rate limit counter
    await incrementRateLimit(email, 'draft');
    
    // Send draft save email (Property 3: Draft Save Triggers Email)
    const emailSent = await sendDraftSaveEmail(
      email,
      draftToken,
      otp,
      submissionType,
      currentStep,
      expiresAt,
      otpExpiresAt
    );
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        draftToken,
        message: emailSent
          ? 'บันทึกแบบฟอร์มเรียบร้อยแล้ว อีเมลยืนยันได้ถูกส่งไปยังที่อยู่ของคุณแล้ว'
          : 'บันทึกแบบฟอร์มเรียบร้อยแล้ว แต่ไม่สามารถส่งอีเมลได้ กรุณาบันทึกลิงก์นี้ไว้',
        expiresAt: expiresAt.toISOString(),
        emailSent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving draft:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการบันทึกแบบฟอร์ม กรุณาลองใหม่อีกครั้ง',
      },
      { status: 500 }
    );
  }
}
