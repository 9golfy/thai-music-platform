/**
 * POST /api/draft/:token/request-otp
 * 
 * Generate and send an OTP (One-Time Password) for draft verification.
 * This endpoint is called when a user wants to access their draft from a different device.
 * After clicking the draft link and seeing the metadata, they request an OTP to verify
 * their identity. The OTP is sent to their email and must be verified within 10 minutes.
 * 
 * Requirements: US-3.3, US-6.1, US-6.2, US-6.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { isValidDraftToken } from '@/lib/utils/draftToken';
import { generateOTP, hashOTP, getOTPExpiryTime } from '@/lib/utils/otp';
import { checkOTPRequestRateLimit } from '@/lib/utils/rateLimit';

/**
 * Send OTP via email
 * 
 * Note: This is a placeholder. In production, this would use the actual
 * email service (nodemailer with Gmail SMTP).
 * 
 * @param email - Recipient email address
 * @param otp - The 6-digit OTP to send
 * @param expiresAt - When the OTP expires
 * @returns True if email sent successfully, false otherwise
 */
async function sendOTPEmail(
  email: string,
  otp: string,
  expiresAt: Date
): Promise<boolean> {
  try {
    console.log('📧 Sending OTP email to:', email);
    console.log('🔐 OTP:', otp);
    console.log('⏰ Expires at:', expiresAt.toISOString());
    
    // Import sendEmail dynamically to avoid circular dependencies
    const { sendEmail } = await import('@/lib/email/mailer');
    
    // Generate email content
    const subject = 'รหัส OTP สำหรับเข้าถึงแบบฟอร์มของคุณ';
    
    // Simple HTML email template for OTP
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>รหัส OTP</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">รหัส OTP ของคุณ</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937; font-family: monospace;">
                ${otp}
              </div>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              รหัสนี้จะหมดอายุใน <strong>10 นาที</strong> (${expiresAt.toLocaleString('th-TH')})
            </p>
            <p style="color: #ef4444; font-size: 12px; margin-top: 20px;">
              ⚠️ กรุณาอย่าแชร์รหัสนี้กับผู้อื่น
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Plain text version
    const textContent = `
รหัส OTP ของคุณ: ${otp}

รหัสนี้จะหมดอายุใน 10 นาที (${expiresAt.toLocaleString('th-TH')})

⚠️ กรุณาอย่าแชร์รหัสนี้กับผู้อื่น
    `;
    
    // Send email
    const sent = await sendEmail({
      to: email,
      subject,
      html: htmlContent,
      text: textContent,
    });
    
    console.log('📧 OTP email sent to:', email, 'Success:', sent);
    
    return sent;
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    return false;
  }
}

/**
 * POST handler for OTP request
 */
export async function POST(
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
          expired: true,
          message: 'This draft has expired. Drafts are only valid for 7 days.',
        },
        { status: 410 } // 410 Gone
      );
    }
    
    // Check if draft was already submitted
    if (draft.status === 'submitted') {
      return NextResponse.json(
        {
          success: false,
          message: 'This draft has already been submitted.',
        },
        { status: 410 }
      );
    }
    
    // Check OTP request rate limit (Property 15: OTP Rate Limiting)
    // Max 10 OTP requests per 30 minutes per email
    // Note: First OTP (from draft save) doesn't count towards limit
    const rateLimit = await checkOTPRequestRateLimit(draft.email);
    if (!rateLimit.allowed) {
      const minutesUntilReset = Math.ceil(
        (rateLimit.resetAt.getTime() - now.getTime()) / (60 * 1000)
      );
      
      return NextResponse.json(
        {
          success: false,
          message: `Too many OTP requests. Please try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}.`,
          remainingRequests: 0,
          resetAt: rateLimit.resetAt.toISOString(),
        },
        { status: 429 } // 429 Too Many Requests
      );
    }
    
    // Generate 6-digit OTP (Property 6: OTP Format Validation)
    const otp = generateOTP();
    
    // Hash OTP with bcrypt (Property 20: OTP Hashing Security)
    const hashedOTP = await hashOTP(otp);
    
    // Calculate OTP expiry time (10 minutes from now)
    // (Property 7: OTP Expiry Enforcement, Property 28: OTP Expiry Metadata)
    const otpExpiresAt = getOTPExpiryTime();
    
    // Store hashed OTP with expiry time and increment request count
    await draftsCollection.updateOne(
      { _id: draft._id },
      {
        $set: {
          otp: hashedOTP,
          otpExpiresAt,
          lastOtpRequestAt: now,
        },
        $inc: {
          otpRequestCount: 1,
        },
      }
    );
    
    // Send OTP via email (US-6.2: OTP sent immediately)
    const emailSent = await sendOTPEmail(draft.email, otp, otpExpiresAt);
    
    if (!emailSent) {
      // Log error but don't fail the request
      console.error('Failed to send OTP email to:', draft.email);
      
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send OTP email. Please try again or contact support.',
        },
        { status: 500 }
      );
    }
    
    // Return success with expiry time
    return NextResponse.json(
      {
        success: true,
        message: 'OTP has been sent to your email. Please check your inbox.',
        expiresAt: otpExpiresAt.toISOString(),
        remainingRequests: rateLimit.remaining - 1,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error requesting OTP:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while requesting OTP. Please try again.',
      },
      { status: 500 }
    );
  }
}
