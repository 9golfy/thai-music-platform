/**
 * OTP Verification Email Template
 * 
 * Sent when a teacher requests OTP to access their draft from a different device.
 * Contains a 6-digit OTP code with 10-minute expiry warning and security notices.
 * 
 * Requirements: US-3.3, US-6.2
 */

interface OTPVerificationEmailProps {
  otp: string; // 6-digit code
  expiresAt: Date; // 10 minutes from generation
  email: string;
  submissionType: 'register100' | 'register-support';
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
 * Format time in Thai format
 */
function formatThaiTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleTimeString('th-TH', options);
}

/**
 * Generate HTML email for OTP verification
 */
export function generateOTPVerificationEmailHTML(props: OTPVerificationEmailProps): string {
  const { otp, expiresAt, email, submissionType } = props;
  const submissionTypeDisplay = getSubmissionTypeDisplay(submissionType);
  const expiryTime = formatThaiTime(expiresAt);

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
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); 
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
        .otp-box { 
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          padding: 40px 20px; 
          text-align: center; 
          border-radius: 12px; 
          margin: 30px 0;
          border: 3px solid #16a34a;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .otp-label {
          font-size: 16px;
          color: #15803d;
          font-weight: bold;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .otp-code { 
          font-size: 48px; 
          font-weight: bold; 
          color: #16a34a; 
          letter-spacing: 12px; 
          font-family: 'Courier New', monospace;
          margin: 20px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        .expiry-warning {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .expiry-warning p {
          margin: 8px 0;
          color: #92400e;
          font-size: 15px;
        }
        .expiry-warning strong {
          color: #78350f;
        }
        .security-box {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .security-box h3 {
          margin: 0 0 10px 0;
          color: #991b1b;
          font-size: 16px;
        }
        .security-box ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .security-box li {
          margin: 8px 0;
          color: #991b1b;
        }
        .info-box { 
          background: #f9fafb; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #16a34a;
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
          .otp-code {
            font-size: 36px !important;
            letter-spacing: 8px !important;
          }
          .otp-box {
            padding: 30px 15px !important;
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
          <h1>🔐 รหัส OTP</h1>
          <p>ยืนยันตัวตนเพื่อเข้าถึงแบบฟอร์มของคุณ</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            สวัสดีครับ/ค่ะ
          </div>
          
          <p>คุณได้ขอรหัส OTP เพื่อเข้าถึงแบบฟอร์มที่บันทึกไว้ กรุณากรอกรหัส 6 หลักด้านล่างในหน้าเว็บเพื่อยืนยันตัวตน:</p>
          
          <div class="otp-box">
            <div class="otp-label">รหัส OTP ของคุณ</div>
            <div class="otp-code">${otp}</div>
            <p style="margin-top: 20px; color: #15803d; font-size: 14px;">
              ⏰ รหัสนี้จะหมดอายุเวลา ${expiryTime} น. (10 นาทีจากตอนนี้)
            </p>
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
          </div>

          <div class="expiry-warning">
            <p><strong>⏰ สำคัญ - รหัสหมดอายุใน 10 นาที!</strong></p>
            <p>• รหัส OTP นี้จะหมดอายุเวลา <strong>${expiryTime} น.</strong></p>
            <p>• หากรหัสหมดอายุ คุณสามารถขอรหัสใหม่ได้ในหน้าเว็บ</p>
            <p>• รหัสนี้ใช้ได้เพียงครั้งเดียวเท่านั้น</p>
          </div>

          <div class="security-box">
            <h3>🔒 คำเตือนด้านความปลอดภัย</h3>
            <ul>
              <li><strong>อย่าแชร์รหัสนี้กับผู้อื่น</strong> - รหัส OTP เป็นข้อมูลส่วนตัวของคุณ</li>
              <li><strong>ระวังการหลอกลวง</strong> - เจ้าหน้าที่จะไม่ขอรหัส OTP จากคุณ</li>
              <li><strong>ตรวจสอบอีเมล</strong> - ตรวจสอบว่าอีเมลนี้ส่งมาจากระบบจริง</li>
              <li><strong>หากไม่ได้ขอรหัส</strong> - ถ้าคุณไม่ได้ขอรหัสนี้ กรุณาเพิกเฉยอีเมลนี้</li>
            </ul>
          </div>

          <div class="instructions">
            <h3>📋 วิธีใช้รหัส OTP:</h3>
            <ol>
              <li>กลับไปที่หน้าเว็บที่คุณเปิดไว้</li>
              <li>กรอกรหัส OTP 6 หลักในช่องที่กำหนด</li>
              <li>คลิกปุ่ม "ยืนยัน" เพื่อเข้าถึงแบบฟอร์ม</li>
              <li>ระบบจะนำคุณไปยังแบบฟอร์มที่บันทึกไว้โดยอัตโนมัติ</li>
            </ol>
          </div>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            <strong>หมายเหตุ:</strong> หากคุณพยายามกรอกรหัสผิด 5 ครั้ง แบบฟอร์มของคุณจะถูกล็อคเพื่อความปลอดภัย
          </p>
        </div>
        
        <div class="footer">
          <p>หากคุณไม่ได้ขอรหัส OTP นี้ กรุณาเพิกเฉยอีเมลนี้</p>
          <p>หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อผู้ดูแลระบบ</p>
          <p style="margin-top: 15px;">© 2026 Thai Music Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email for OTP verification
 */
export function generateOTPVerificationEmailText(props: OTPVerificationEmailProps): string {
  const { otp, expiresAt, email, submissionType } = props;
  const submissionTypeDisplay = getSubmissionTypeDisplay(submissionType);
  const expiryTime = formatThaiTime(expiresAt);

  return `
Thai Music Platform - รหัส OTP สำหรับเข้าถึงแบบฟอร์มของคุณ

สวัสดีครับ/ค่ะ

คุณได้ขอรหัส OTP เพื่อเข้าถึงแบบฟอร์มที่บันทึกไว้ กรุณากรอกรหัส 6 หลักด้านล่างในหน้าเว็บเพื่อยืนยันตัวตน:

รหัส OTP ของคุณ: ${otp}

ข้อมูลการเข้าถึง:
- อีเมล: ${email}
- ประเภทการสมัคร: ${submissionTypeDisplay}

สำคัญ - รหัสหมดอายุใน 10 นาที!
- รหัส OTP นี้จะหมดอายุเวลา ${expiryTime} น.
- หากรหัสหมดอายุ คุณสามารถขอรหัสใหม่ได้ในหน้าเว็บ
- รหัสนี้ใช้ได้เพียงครั้งเดียวเท่านั้น

คำเตือนด้านความปลอดภัย:
- อย่าแชร์รหัสนี้กับผู้อื่น - รหัส OTP เป็นข้อมูลส่วนตัวของคุณ
- ระวังการหลอกลวง - เจ้าหน้าที่จะไม่ขอรหัส OTP จากคุณ
- ตรวจสอบอีเมล - ตรวจสอบว่าอีเมลนี้ส่งมาจากระบบจริง
- หากไม่ได้ขอรหัส - ถ้าคุณไม่ได้ขอรหัสนี้ กรุณาเพิกเฉยอีเมลนี้

วิธีใช้รหัส OTP:
1. กลับไปที่หน้าเว็บที่คุณเปิดไว้
2. กรอกรหัส OTP 6 หลักในช่องที่กำหนด
3. คลิกปุ่ม "ยืนยัน" เพื่อเข้าถึงแบบฟอร์ม
4. ระบบจะนำคุณไปยังแบบฟอร์มที่บันทึกไว้โดยอัตโนมัติ

หมายเหตุ: หากคุณพยายามกรอกรหัสผิด 5 ครั้ง แบบฟอร์มของคุณจะถูกล็อคเพื่อความปลอดภัย

หากคุณไม่ได้ขอรหัส OTP นี้ กรุณาเพิกเฉยอีเมลนี้
หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อผู้ดูแลระบบ

© 2026 Thai Music Platform. All rights reserved.
  `.trim();
}

/**
 * Get email subject for OTP verification
 */
export function getOTPVerificationEmailSubject(): string {
  return 'รหัส OTP สำหรับเข้าถึงแบบฟอร์มของคุณ - Thai Music Platform';
}
