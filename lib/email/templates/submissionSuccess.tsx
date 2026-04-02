/**
 * Submission Success Email Template
 * 
 * Sent when a teacher successfully submits their draft and creates their school account.
 * Includes School ID, login credentials, welcome message, and next steps.
 * 
 * Requirements: US-5.7
 */

interface SubmissionSuccessEmailProps {
  email: string;
  schoolId: string;
  password: string; // Temporary password
  schoolName: string;
  submissionType: 'register100' | 'register-support';
  loginUrl: string;
  submissionId: string;
}

/**
 * Get submission type display name in Thai
 */
function getSubmissionTypeDisplay(type: 'register100' | 'register-support'): string {
  return type === 'register100' 
    ? 'โครงการ 100 โรงเรียน' 
    : 'ขอรับการสนับสนุน';
}

/**
 * Get program benefits based on submission type
 */
function getProgramBenefits(type: 'register100' | 'register-support'): string[] {
  if (type === 'register100') {
    return [
      'เข้าร่วมโครงการ 100 โรงเรียนดนตรีไทย',
      'รับการสนับสนุนเครื่องดนตรีไทยและอุปกรณ์การเรียนการสอน',
      'รับการฝึกอบรมครูดนตรีไทยอย่างต่อเนื่อง',
      'เข้าถึงหลักสูตรและสื่อการเรียนการสอนคุณภาพสูง',
      'เป็นส่วนหนึ่งของเครือข่ายโรงเรียนดนตรีไทยทั่วประเทศ',
    ];
  } else {
    return [
      'รับการสนับสนุนด้านดนตรีไทยสำหรับโรงเรียนของคุณ',
      'เข้าถึงทรัพยากรและสื่อการเรียนการสอนดนตรีไทย',
      'รับคำปรึกษาจากผู้เชี่ยวชาญด้านดนตรีไทย',
      'เข้าร่วมกิจกรรมและเครือข่ายดนตรีไทย',
    ];
  }
}

/**
 * Generate HTML email for submission success
 */
export function generateSubmissionSuccessEmailHTML(props: SubmissionSuccessEmailProps): string {
  const { email, schoolId, password, schoolName, submissionType, loginUrl, submissionId } = props;
  const submissionTypeDisplay = getSubmissionTypeDisplay(submissionType);
  const benefits = getProgramBenefits(submissionType);

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
          padding: 40px 20px; 
          text-align: center; 
        }
        .header-icon {
          font-size: 64px;
          margin-bottom: 15px;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: bold;
        }
        .header p {
          margin: 0;
          font-size: 18px;
          opacity: 0.95;
        }
        .content { 
          padding: 30px 20px; 
        }
        .welcome-message {
          font-size: 18px;
          margin-bottom: 25px;
          color: #1f2937;
          text-align: center;
          line-height: 1.8;
        }
        .credentials-box {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 3px solid #16a34a;
          padding: 30px;
          border-radius: 12px;
          margin: 25px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .credentials-title {
          font-size: 20px;
          font-weight: bold;
          color: #15803d;
          margin-bottom: 20px;
          text-align: center;
        }
        .credential-item {
          background: white;
          padding: 15px;
          border-radius: 6px;
          margin: 12px 0;
          border-left: 4px solid #16a34a;
        }
        .credential-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        .credential-value {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          font-family: 'Courier New', monospace;
        }
        .school-id-highlight {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #f59e0b;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
        }
        .school-id-label {
          font-size: 14px;
          color: #92400e;
          margin-bottom: 8px;
        }
        .school-id-value {
          font-size: 32px;
          font-weight: bold;
          color: #d97706;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button { 
          display: inline-block;
          background: #3b82f6; 
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
          background: #2563eb;
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
          min-width: 140px;
          display: inline-block;
        }
        .info-value { 
          color: #1f2937;
          flex: 1;
        }
        .benefits-box {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
        }
        .benefits-box h3 {
          margin: 0 0 15px 0;
          color: #1e40af;
          font-size: 18px;
        }
        .benefits-box ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .benefits-box li {
          margin: 10px 0;
          color: #1e40af;
          line-height: 1.6;
        }
        .next-steps-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
        }
        .next-steps-box h3 {
          margin: 0 0 15px 0;
          color: #92400e;
          font-size: 18px;
        }
        .next-steps-box ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        .next-steps-box li {
          margin: 10px 0;
          color: #78350f;
          line-height: 1.6;
        }
        .security-notice {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .security-notice p {
          margin: 8px 0;
          color: #991b1b;
          font-size: 14px;
        }
        .security-notice strong {
          color: #7f1d1d;
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
            padding: 30px 15px !important;
          }
          .header h1 {
            font-size: 26px !important;
          }
          .school-id-value {
            font-size: 24px !important;
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
          <div class="header-icon">🎉</div>
          <h1>ยินดีต้อนรับสู่ Thai Music Platform!</h1>
          <p>ส่งแบบฟอร์มสมัครสำเร็จแล้ว</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <strong>ขอแสดงความยินดี!</strong><br>
            คุณได้ส่งแบบฟอร์มสมัคร<strong>${submissionTypeDisplay}</strong>เรียบร้อยแล้ว<br>
            บัญชีโรงเรียนของคุณถูกสร้างขึ้นแล้ว
          </div>

          <div class="school-id-highlight">
            <div class="school-id-label">🏫 School ID ของคุณ</div>
            <div class="school-id-value">${schoolId}</div>
          </div>

          <div class="credentials-box">
            <div class="credentials-title">🔑 ข้อมูลเข้าสู่ระบบของคุณ</div>
            
            <div class="credential-item">
              <div class="credential-label">อีเมล</div>
              <div class="credential-value">${email}</div>
            </div>
            
            <div class="credential-item">
              <div class="credential-label">รหัสผ่านชั่วคราว</div>
              <div class="credential-value">${password}</div>
            </div>
            
            <div class="credential-item">
              <div class="credential-label">School ID</div>
              <div class="credential-value">${schoolId}</div>
            </div>
          </div>

          <div class="security-notice">
            <p><strong>🔒 สำคัญ - ความปลอดภัย:</strong></p>
            <p>• กรุณาเปลี่ยนรหัสผ่านหลังจากเข้าสู่ระบบครั้งแรก</p>
            <p>• อย่าแชร์ข้อมูลเข้าสู่ระบบกับผู้อื่น</p>
            <p>• เก็บอีเมลนี้ไว้ในที่ปลอดภัย</p>
          </div>

          <div class="button-container">
            <a href="https://dcpschool100.net/teacher-login" class="button">
              🚀 เข้าสู่ระบบเลย
            </a>
          </div>

          <div class="info-box">
            <div class="info-item">
              <span class="info-label">🏫 ชื่อโรงเรียน:</span>
              <span class="info-value">${schoolName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📝 ประเภทการสมัคร:</span>
              <span class="info-value">${submissionTypeDisplay}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📧 อีเมล:</span>
              <span class="info-value">${email}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🆔 Submission ID:</span>
              <span class="info-value">${submissionId}</span>
            </div>
          </div>

          <div class="benefits-box">
            <h3>✨ สิทธิประโยชน์ที่คุณจะได้รับ</h3>
            <ul>
              ${benefits.map(benefit => `<li>${benefit}</li>`).join('\n              ')}
            </ul>
          </div>

          <div class="next-steps-box">
            <h3>📋 ขั้นตอนถัดไป</h3>
            <ol>
              <li><strong>เข้าสู่ระบบ</strong> - คลิกปุ่ม "เข้าสู่ระบบเลย" ด้านบนและใช้ข้อมูลที่ให้ไว้</li>
              <li><strong>เปลี่ยนรหัสผ่าน</strong> - เปลี่ยนรหัสผ่านชั่วคราวเป็นรหัสผ่านของคุณเอง</li>
              <li><strong>ตรวจสอบข้อมูล</strong> - ตรวจสอบข้อมูลโรงเรียนและแก้ไขหากจำเป็น</li>
              <li><strong>รอการติดต่อ</strong> - ทีมงานจะติดต่อคุณภายใน 3-5 วันทำการ</li>
              <li><strong>เตรียมเอกสาร</strong> - เตรียมเอกสารเพิ่มเติมตามที่ทีมงานแจ้ง (ถ้ามี)</li>
            </ol>
          </div>

          <p style="margin-top: 30px; color: #1f2937; font-size: 16px; text-align: center;">
            <strong>ขอบคุณที่เข้าร่วมโครงการ Thai Music Platform!</strong><br>
            เรายินดีที่จะสนับสนุนการศึกษาดนตรีไทยในโรงเรียนของคุณ
          </p>

          <p style="margin-top: 20px; color: #6b7280; font-size: 14px; text-align: center;">
            หากมีคำถามหรือต้องการความช่วยเหลือ<br>
            กรุณาติดต่อผู้ดูแลระบบหรือตอบกลับอีเมลนี้
          </p>
        </div>
        
        <div class="footer">
          <p><strong>Thai Music Platform</strong></p>
          <p>ส่งเสริมและสนับสนุนการศึกษาดนตรีไทยในโรงเรียนทั่วประเทศ</p>
          <p style="margin-top: 15px;">© 2026 Dcpschool100.net. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email for submission success
 */
export function generateSubmissionSuccessEmailText(props: SubmissionSuccessEmailProps): string {
  const { email, schoolId, password, schoolName, submissionType, loginUrl, submissionId } = props;
  const submissionTypeDisplay = getSubmissionTypeDisplay(submissionType);
  const benefits = getProgramBenefits(submissionType);

  return `
Thai Music Platform - ยินดีต้อนรับ! ส่งแบบฟอร์มสมัครสำเร็จแล้ว

ขอแสดงความยินดี!

คุณได้ส่งแบบฟอร์มสมัคร${submissionTypeDisplay}เรียบร้อยแล้ว
บัญชีโรงเรียนของคุณถูกสร้างขึ้นแล้ว

🏫 School ID ของคุณ: ${schoolId}

🔑 ข้อมูลเข้าสู่ระบบของคุณ:
- School ID: ${schoolId}
- อีเมล: ${email}
- รหัสผ่านชั่วคราว: ${password}

สำคัญ - ความปลอดภัย:
- กรุณาเปลี่ยนรหัสผ่านหลังจากเข้าสู่ระบบครั้งแรก
- อย่าแชร์ข้อมูลเข้าสู่ระบบกับผู้อื่น
- เก็บอีเมลนี้ไว้ในที่ปลอดภัย

เข้าสู่ระบบที่: ${loginUrl}

ข้อมูลการสมัคร:
- ชื่อโรงเรียน: ${schoolName}
- ประเภทการสมัคร: ${submissionTypeDisplay}
- อีเมล: ${email}
- Submission ID: ${submissionId}

สิทธิประโยชน์ที่คุณจะได้รับ:
${benefits.map((benefit, index) => `${index + 1}. ${benefit}`).join('\n')}

ขั้นตอนถัดไป:
1. เข้าสู่ระบบ - ใช้ข้อมูลที่ให้ไว้ด้านบน
2. เปลี่ยนรหัสผ่าน - เปลี่ยนรหัสผ่านชั่วคราวเป็นรหัสผ่านของคุณเอง
3. ตรวจสอบข้อมูล - ตรวจสอบข้อมูลโรงเรียนและแก้ไขหากจำเป็น
4. รอการติดต่อ - ทีมงานจะติดต่อคุณภายใน 3-5 วันทำการ
5. เตรียมเอกสาร - เตรียมเอกสารเพิ่มเติมตามที่ทีมงานแจ้ง (ถ้ามี)

ขอบคุณที่เข้าร่วมโครงการ Thai Music Platform!
เรายินดีที่จะสนับสนุนการศึกษาดนตรีไทยในโรงเรียนของคุณ

หากมีคำถามหรือต้องการความช่วยเหลือ
กรุณาติดต่อผู้ดูแลระบบหรือตอบกลับอีเมลนี้

Thai Music Platform
ส่งเสริมและสนับสนุนการศึกษาดนตรีไทยในโรงเรียนทั่วประเทศ

© 2026 Thai Music Platform. All rights reserved.
  `.trim();
}

/**
 * Get email subject for submission success
 */
export function getSubmissionSuccessEmailSubject(schoolName: string): string {
  return `🎉 ยินดีต้อนรับ ${schoolName} - ข้อมูลเข้าสู่ระบบของคุณ`;
}
