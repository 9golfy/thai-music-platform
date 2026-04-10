/**
 * Expiry Reminder Email Template
 * 
 * Sent 1 day before a draft expires (6 days after creation).
 * Shows remaining time, includes draft link, and adds urgency messaging.
 * 
 * Requirements: US-8.1, US-8.2, US-8.3
 */

interface ExpiryReminderEmailProps {
  email: string;
  draftToken: string;
  submissionType: 'register100' | 'register-support';
  currentStep: number;
  expiresAt: Date;
  appUrl: string;
  createdAt: Date;
}

/**
 * Get submission type display name in Thai
 */
function getSubmissionTypeDisplay(type: 'register100' | 'register-support'): string {
  return type === 'register100' 
    ? 'สมัครโครงการ 100 โรงเรียน' 
    : 'สมัครขอรับการสนับสนุน';
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
 * Calculate remaining hours until expiry
 */
function getRemainingHours(expiresAt: Date): number {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
}

/**
 * Generate HTML email for expiry reminder
 */
export function generateExpiryReminderEmailHTML(props: ExpiryReminderEmailProps): string {
  const { email, draftToken, submissionType, currentStep, expiresAt, appUrl, createdAt } = props;
  const draftLink = `${appUrl}/draft/${draftToken}`;
  const submissionTypeDisplay = getSubmissionTypeDisplay(submissionType);
  const expiryDateDisplay = formatThaiDate(expiresAt);
  const remainingHours = getRemainingHours(expiresAt);
  const createdDateDisplay = formatThaiDate(createdAt);

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
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
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
        .urgency-box {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 3px solid #f59e0b;
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .urgency-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .urgency-title {
          font-size: 24px;
          font-weight: bold;
          color: #92400e;
          margin: 10px 0;
        }
        .urgency-time {
          font-size: 36px;
          font-weight: bold;
          color: #d97706;
          margin: 15px 0;
        }
        .urgency-message {
          font-size: 16px;
          color: #78350f;
          margin: 10px 0;
        }
        .info-box { 
          background: #f9fafb; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #f59e0b;
        }
        .info-item { 
          margin: 12px 0;
          display: flex;
          align-items: baseline;
        }
        .info-label { 
          font-weight: bold; 
          color: #374151;
          min-width: 140px;
          display: inline-block;
        }
        .info-value { 
          color: #1f2937;
          flex: 1;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button { 
          display: inline-block;
          background: #f59e0b; 
          color: white !important; 
          padding: 16px 40px; 
          text-decoration: none; 
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          transition: background 0.3s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .button:hover {
          background: #d97706;
        }
        .warning-box {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .warning-box p {
          margin: 8px 0;
          color: #991b1b;
        }
        .warning-box strong {
          color: #7f1d1d;
        }
        .benefits-box {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .benefits-box h3 {
          margin: 0 0 10px 0;
          color: #1e40af;
          font-size: 16px;
        }
        .benefits-box ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .benefits-box li {
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
          color: #f59e0b;
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
          .urgency-time {
            font-size: 28px !important;
          }
          .button {
            padding: 14px 32px !important;
            font-size: 16px !important;
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
          <h1>⏰ แบบฟอร์มของคุณกำลังจะหมดอายุ!</h1>
          <p>กรุณาทำแบบฟอร์มให้เสร็จภายใน 24 ชั่วโมง</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            สวัสดีครับ/ค่ะ
          </div>
          
          <p>แบบฟอร์มสมัครที่คุณบันทึกไว้เมื่อวันที่ <strong>${createdDateDisplay}</strong> กำลังจะหมดอายุในอีก <strong>24 ชั่วโมง</strong></p>
          
          <div class="urgency-box">
            <div class="urgency-icon">⏰</div>
            <div class="urgency-title">เหลือเวลาอีก</div>
            <div class="urgency-time">${remainingHours} ชั่วโมง</div>
            <div class="urgency-message">แบบฟอร์มจะหมดอายุวันที่ ${expiryDateDisplay}</div>
          </div>

          <p style="font-size: 16px; color: #1f2937; text-align: center; margin: 20px 0;">
            <strong>อย่าปล่อยให้ความพยายามของคุณสูญเปล่า!</strong><br>
            กรุณากลับมาทำแบบฟอร์มให้เสร็จก่อนที่จะหมดอายุ
          </p>

          <div class="button-container">
            <a href="${draftLink}" class="button">
              📝 ทำแบบฟอร์มให้เสร็จเลย
            </a>
          </div>

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
              <span class="info-value">ขั้นตอนที่ ${currentStep} จาก 8</span>
            </div>
            <div class="info-item">
              <span class="info-label">📅 บันทึกเมื่อ:</span>
              <span class="info-value">${createdDateDisplay}</span>
            </div>
            <div class="info-item">
              <span class="info-label">⏰ หมดอายุวันที่:</span>
              <span class="info-value">${expiryDateDisplay}</span>
            </div>
          </div>

          <div class="benefits-box">
            <h3>✨ ทำไมต้องทำให้เสร็จตอนนี้?</h3>
            <ul>
              <li>คุณทำไปแล้ว ${currentStep} ขั้นตอนจาก 8 ขั้นตอน - เหลืออีกนิดเดียว!</li>
              <li>ข้อมูลที่คุณกรอกไว้จะไม่สูญหาย</li>
              <li>ใช้เวลาเพียงไม่กี่นาทีในการทำให้เสร็จ</li>
              <li>เมื่อส่งแบบฟอร์มแล้ว คุณจะได้รับ School ID และข้อมูลเข้าสู่ระบบทันที</li>
            </ul>
          </div>

          <div class="warning-box">
            <p><strong>⚠️ สำคัญมาก:</strong></p>
            <p>• แบบฟอร์มจะหมดอายุใน <strong>${remainingHours} ชั่วโมง</strong> (${expiryDateDisplay})</p>
            <p>• หลังจากหมดอายุ ข้อมูลทั้งหมดจะถูกลบออกจากระบบโดยอัตโนมัติ</p>
            <p>• คุณจะต้องเริ่มกรอกแบบฟอร์มใหม่ตั้งแต่ต้น</p>
            <p>• นี่เป็นการแจ้งเตือนครั้งเดียว - เราจะไม่ส่งอีเมลเตือนอีก</p>
          </div>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            <strong>วิธีกลับมาทำแบบฟอร์มต่อ:</strong>
          </p>
          <ol style="color: #6b7280; font-size: 14px;">
            <li>คลิกปุ่ม "ทำแบบฟอร์มให้เสร็จเลย" ด้านบน</li>
            <li>ระบบจะส่งรหัส OTP (6 หลัก) ไปยังอีเมลของคุณ</li>
            <li>กรอกรหัส OTP เพื่อยืนยันตัวตน</li>
            <li>ทำแบบฟอร์มต่อจากขั้นตอนที่ ${currentStep}</li>
            <li>กดส่งแบบฟอร์มเมื่อเสร็จสมบูรณ์</li>
          </ol>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            <strong>หมายเหตุ:</strong> หากคุณไม่สามารถคลิกปุ่มได้ กรุณาคัดลอกลิงก์ด้านล่างนี้ไปวางในเบราว์เซอร์:
          </p>
          <div class="token-display">
            ${draftLink}
          </div>
        </div>
        
        <div class="footer">
          <p>หากคุณไม่ต้องการทำแบบฟอร์มนี้ต่อ กรุณาเพิกเฉยอีเมลนี้</p>
          <p>แบบฟอร์มจะถูกลบออกจากระบบโดยอัตโนมัติเมื่อหมดอายุ</p>
          <p>หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อผู้ดูแลระบบ</p>
          <p style="margin-top: 15px;">© 2026 กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email for expiry reminder
 */
export function generateExpiryReminderEmailText(props: ExpiryReminderEmailProps): string {
  const { email, draftToken, submissionType, currentStep, expiresAt, appUrl, createdAt } = props;
  const draftLink = `${appUrl}/draft/${draftToken}`;
  const submissionTypeDisplay = getSubmissionTypeDisplay(submissionType);
  const expiryDateDisplay = formatThaiDate(expiresAt);
  const remainingHours = getRemainingHours(expiresAt);
  const createdDateDisplay = formatThaiDate(createdAt);

  return `
Thai Music Platform - แบบฟอร์มของคุณกำลังจะหมดอายุ!

สวัสดีครับ/ค่ะ

แบบฟอร์มสมัครที่คุณบันทึกไว้เมื่อวันที่ ${createdDateDisplay} กำลังจะหมดอายุในอีก 24 ชั่วโมง

⏰ เหลือเวลาอีก ${remainingHours} ชั่วโมง
แบบฟอร์มจะหมดอายุวันที่ ${expiryDateDisplay}

อย่าปล่อยให้ความพยายามของคุณสูญเปล่า!
กรุณากลับมาทำแบบฟอร์มให้เสร็จก่อนที่จะหมดอายุ

ทำแบบฟอร์มให้เสร็จที่: ${draftLink}

ข้อมูลแบบฟอร์ม:
- อีเมล: ${email}
- ประเภทการสมัคร: ${submissionTypeDisplay}
- ขั้นตอนปัจจุบัน: ขั้นตอนที่ ${currentStep} จาก 8
- บันทึกเมื่อ: ${createdDateDisplay}
- หมดอายุวันที่: ${expiryDateDisplay}

ทำไมต้องทำให้เสร็จตอนนี้?
- คุณทำไปแล้ว ${currentStep} ขั้นตอนจาก 8 ขั้นตอน - เหลืออีกนิดเดียว!
- ข้อมูลที่คุณกรอกไว้จะไม่สูญหาย
- ใช้เวลาเพียงไม่กี่นาทีในการทำให้เสร็จ
- เมื่อส่งแบบฟอร์มแล้ว คุณจะได้รับ School ID และข้อมูลเข้าสู่ระบบทันที

สำคัญมาก:
- แบบฟอร์มจะหมดอายุใน ${remainingHours} ชั่วโมง (${expiryDateDisplay})
- หลังจากหมดอายุ ข้อมูลทั้งหมดจะถูกลบออกจากระบบโดยอัตโนมัติ
- คุณจะต้องเริ่มกรอกแบบฟอร์มใหม่ตั้งแต่ต้น
- นี่เป็นการแจ้งเตือนครั้งเดียว - เราจะไม่ส่งอีเมลเตือนอีก

วิธีกลับมาทำแบบฟอร์มต่อ:
1. คลิกลิงก์ด้านบน
2. ระบบจะส่งรหัส OTP (6 หลัก) ไปยังอีเมลของคุณ
3. กรอกรหัส OTP เพื่อยืนยันตัวตน
4. ทำแบบฟอร์มต่อจากขั้นตอนที่ ${currentStep}
5. กดส่งแบบฟอร์มเมื่อเสร็จสมบูรณ์

หากคุณไม่ต้องการทำแบบฟอร์มนี้ต่อ กรุณาเพิกเฉยอีเมลนี้
แบบฟอร์มจะถูกลบออกจากระบบโดยอัตโนมัติเมื่อหมดอายุ

หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อผู้ดูแลระบบ

© 2026 Thai Music Platform. All rights reserved.
  `.trim();
}

/**
 * Get email subject for expiry reminder
 */
export function getExpiryReminderEmailSubject(): string {
  return '⏰ เตือน: แบบฟอร์มของคุณจะหมดอายุในอีก 24 ชั่วโมง - Thai Music Platform';
}
