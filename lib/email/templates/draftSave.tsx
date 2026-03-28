/**
 * Draft Save Email Template
 * 
 * Sent when a teacher manually saves a draft of their registration form.
 * Includes a link to resume the draft with token-based access and OTP verification.
 * 
 * Requirements: US-1.3, US-4.1, US-4.3, US-4.4
 */

interface DraftSaveEmailProps {
  email: string;
  draftToken: string;
  otp: string;
  submissionType: 'register100' | 'register-support';
  currentStep: number;
  expiresAt: Date;
  otpExpiresAt: Date;
  appUrl: string;
}

/**
 * Get submission type display name in Thai
 */
function getSubmissionTypeDisplay(type: 'register100' | 'register-support'): string {
  return type === 'register100' 
    ? 'สมัครประเภทโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์' 
    : 'สมัครประเภทโรงเรียนสนับสนุนและส่งเสริมดนตรีไทย';
}

/**
 * Format date in Thai format
 */
function formatThaiDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('th-TH', options);
}

/**
 * Generate HTML email for draft save notification
 */
export function generateDraftSaveEmailHTML(props: DraftSaveEmailProps): string {
  const { email, draftToken, otp, submissionType, currentStep, expiresAt, otpExpiresAt, appUrl } = props;
  const draftLink = `${appUrl}/draft/${draftToken}`;
  const submissionTypeDisplay = getSubmissionTypeDisplay(submissionType);
  const expiryDateDisplay = formatThaiDate(expiresAt);
  const otpExpiryDisplay = formatThaiDate(otpExpiresAt);

  return `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Sarabun', 'Tahoma', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #ffffff;
        }
        .header { 
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header p {
          margin: 0;
          font-size: 16px;
          opacity: 0.95;
        }
        .content { 
          padding: 30px 20px; 
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #1f2937;
        }
        .info-box { 
          background: #f9fafb; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #2563eb;
        }
        .info-item { 
          margin: 12px 0;
          display: flex;
          align-items: baseline;
        }
        .info-label { 
          font-weight: bold; 
          color: #374151;
          min-width: 120px;
          display: inline-block;
        }
        .info-value { 
          color: #1f2937;
          flex: 1;
        }
        .otp-box {
          background: #eff6ff;
          border: 2px dashed #2563eb;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
          text-align: center;
        }
        .otp-label {
          font-size: 14px;
          color: #1e40af;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: #2563eb;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
        }
        .otp-expiry {
          font-size: 12px;
          color: #64748b;
          margin-top: 10px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button { 
          display: inline-block;
          background: #2563eb; 
          color: white !important; 
          padding: 14px 32px; 
          text-decoration: none; 
          border-radius: 6px;
          font-size: 16px;
          font-weight: bold;
          transition: background 0.3s;
        }
        .button:hover {
          background: #1d4ed8;
        }
        .warning-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .warning-box p {
          margin: 8px 0;
          color: #92400e;
        }
        .instructions {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .instructions h3 {
          margin: 0 0 10px 0;
          color: #1e40af;
          font-size: 16px;
        }
        .instructions ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        .instructions li {
          margin: 8px 0;
          color: #1e40af;
        }
        .footer { 
          text-align: center; 
          color: #6b7280; 
          font-size: 14px; 
          padding: 20px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          margin: 8px 0;
        }
        .token-display {
          background: white;
          padding: 12px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 14px;
          color: #2563eb;
          word-break: break-all;
          margin-top: 10px;
          border: 1px solid #e5e7eb;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
          }
          .content {
            padding: 20px 15px !important;
          }
          .header {
            padding: 20px 15px !important;
          }
          .header h1 {
            font-size: 24px !important;
          }
          .button {
            padding: 12px 24px !important;
            font-size: 14px !important;
          }
          .info-item {
            flex-direction: column;
          }
          .info-label {
            min-width: auto;
            margin-bottom: 4px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎵 Thai Music Platform</h1>
          <p>บันทึกแบบฟอร์มสมัครของคุณสำเร็จแล้ว</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            สวัสดีครับ/ค่ะ
          </div>
          
          <p>คุณได้บันทึกแบบฟอร์มสมัครไว้เรียบร้อยแล้ว คุณสามารถกลับมาทำต่อได้ทุกเมื่อภายใน 7 วัน</p>
          
          <div class="info-box">
            <div class="info-item">
              <span class="info-label">📧 อีเมล:</span>
              <span class="info-value">${email}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📝 ประเภทการสมัคร:</span>
              <span class="info-value">${submissionTypeDisplay}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📍 ขั้นตอนปัจจุบัน:</span>
              <span class="info-value">ขั้นตอนที่ ${currentStep}</span>
            </div>
            <div class="info-item">
              <span class="info-label">⏰ หมดอายุวันที่:</span>
              <span class="info-value">${expiryDateDisplay}</span>
            </div>
          </div>

          <div class="otp-box">
            <div class="otp-label">🔐 รหัส OTP ของคุณ</div>
            <div class="otp-code">${otp}</div>
            <div class="otp-expiry">รหัสนี้จะหมดอายุใน 10 นาที (${otpExpiryDisplay})</div>
          </div>

          <div class="button-container">
            <a href="${draftLink}" class="button">
              📝 กลับมาทำแบบฟอร์มต่อ
            </a>
          </div>

          <div class="instructions">
            <h3>📋 วิธีกลับมาทำแบบฟอร์มต่อ:</h3>
            <ol>
              <li>คลิกปุ่ม "กลับมาทำแบบฟอร์มต่อ" ด้านบน</li>
              <li>กรอกรหัส OTP 6 หลักที่แสดงด้านบนเพื่อยืนยันตัวตน</li>
              <li>ระบบจะนำคุณกลับไปยังแบบฟอร์มที่คุณบันทึกไว้</li>
            </ol>
          </div>

          <div class="warning-box">
            <p><strong>⚠️ สำคัญ:</strong></p>
            <p>• รหัส OTP จะหมดอายุใน 10 นาที</p>
            <p>• ลิงก์จะหมดอายุใน 7 วัน (${expiryDateDisplay})</p>
            <p>• กรุณาเก็บอีเมลนี้ไว้เพื่อกลับมาทำแบบฟอร์มต่อ</p>
            <p>• หากรหัส OTP หมดอายุ คุณสามารถขอรหัสใหม่ได้ที่หน้ายืนยันตัวตน</p>
          </div>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            <strong>หมายเหตุ:</strong> หากคุณไม่สามารถคลิกปุ่มได้ กรุณาคัดลอกลิงก์ด้านล่างนี้ไปวางในเบราว์เซอร์:
          </p>
          <div class="token-display">
            ${draftLink}
          </div>
        </div>
        
        <div class="footer">
          <p>หากคุณไม่ได้บันทึกแบบฟอร์มนี้ กรุณาเพิกเฉยอีเมลนี้</p>
          <p>หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อผู้ดูแลระบบ</p>
          <p style="margin-top: 15px;">© 2026 Thai Music Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email for draft save notification
 */
export function generateDraftSaveEmailText(props: DraftSaveEmailProps): string {
  const { email, draftToken, otp, submissionType, currentStep, expiresAt, otpExpiresAt, appUrl } = props;
  const draftLink = `${appUrl}/draft/${draftToken}`;
  const submissionTypeDisplay = getSubmissionTypeDisplay(submissionType);
  const expiryDateDisplay = formatThaiDate(expiresAt);
  const otpExpiryDisplay = formatThaiDate(otpExpiresAt);

  return `
Thai Music Platform - บันทึกแบบฟอร์มสมัครของคุณสำเร็จแล้ว

สวัสดีครับ/ค่ะ

คุณได้บันทึกแบบฟอร์มสมัครไว้เรียบร้อยแล้ว คุณสามารถกลับมาทำต่อได้ทุกเมื่อภายใน 7 วัน

ข้อมูลการบันทึก:
- อีเมล: ${email}
- ประเภทการสมัคร: ${submissionTypeDisplay}
- ขั้นตอนปัจจุบัน: ขั้นตอนที่ ${currentStep}
- หมดอายุวันที่: ${expiryDateDisplay}

รหัส OTP ของคุณ: ${otp}
(รหัสนี้จะหมดอายุใน 10 นาที - ${otpExpiryDisplay})

กลับมาทำแบบฟอร์มต่อที่: ${draftLink}

วิธีกลับมาทำแบบฟอร์มต่อ:
1. คลิกลิงก์ด้านบน
2. กรอกรหัส OTP 6 หลักเพื่อยืนยันตัวตน
3. ระบบจะนำคุณกลับไปยังแบบฟอร์มที่คุณบันทึกไว้

สำคัญ:
- รหัส OTP จะหมดอายุใน 10 นาที
- ลิงก์จะหมดอายุใน 7 วัน (${expiryDateDisplay})
- กรุณาเก็บอีเมลนี้ไว้เพื่อกลับมาทำแบบฟอร์มต่อ
- หากรหัส OTP หมดอายุ คุณสามารถขอรหัสใหม่ได้ที่หน้ายืนยันตัวตน

หากคุณไม่ได้บันทึกแบบฟอร์มนี้ กรุณาเพิกเฉยอีเมลนี้
หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อผู้ดูแลระบบ

© 2026 Thai Music Platform. All rights reserved.
  `.trim();
}

/**
 * Get email subject for draft save notification
 */
export function getDraftSaveEmailSubject(submissionType: 'register100' | 'register-support'): string {
  const typeDisplay = getSubmissionTypeDisplay(submissionType);
  return `บันทึกแบบฟอร์มสมัครของคุณ - ${typeDisplay}`;
}
