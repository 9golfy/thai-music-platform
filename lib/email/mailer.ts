// Email service using NodeMailer
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Create email transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"Thai Music Platform" <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send teacher login information email
 */
export async function sendTeacherLoginInfoEmail(
  teacherEmail: string,
  teacherPhone: string,
  schoolName: string,
  schoolId: string,
  password: string,
  submissionType: 'register100' | 'register_support',
  submissionId: string
): Promise<boolean> {
  const loginUrl = `http://localhost:3000/teacher-login`;
  
  const { 
    generateTeacherLoginInfoEmailHTML, 
    generateTeacherLoginInfoEmailText, 
    getTeacherLoginInfoEmailSubject 
  } = await import('./templates/teacherLoginInfo');

  const emailData = {
    teacherEmail,
    teacherPhone,
    schoolName,
    schoolId,
    password,
    loginUrl,
    submissionType,
    submissionId,
  };

  const html = generateTeacherLoginInfoEmailHTML(emailData);
  const text = generateTeacherLoginInfoEmailText(emailData);
  const subject = getTeacherLoginInfoEmailSubject(schoolName);

  return sendEmail({
    to: teacherEmail,
    subject,
    html,
    text,
  });
}
export async function sendTeacherPasswordEmail(
  email: string,
  password: string,
  schoolId: string,
  schoolName: string,
  teacherName?: string,
  phone?: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
        .credentials { background: white; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .credential-item { margin: 15px 0; }
        .credential-label { font-weight: bold; color: #1f2937; }
        .credential-value { font-size: 18px; color: #2563eb; font-family: monospace; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎵 Thai Music Platform</h1>
          <p>ข้อมูลการเข้าสู่ระบบ</p>
        </div>
        
        <div class="content">
          <h2>สวัสดีครับ/ค่ะ ${teacherName || ''}</h2>
          <p>คุณได้ขอรหัสผ่านสำหรับเข้าสู่ระบบ Thai Music Platform</p>
          
          <div class="credentials">
            <div class="credential-item">
              <div class="credential-label">🏫 โรงเรียน:</div>
              <div class="credential-value">${schoolName}</div>
            </div>
            
            <div class="credential-item">
              <div class="credential-label">🆔 School ID:</div>
              <div class="credential-value">${schoolId}</div>
            </div>
            
            <div class="credential-item">
              <div class="credential-label">📧 Email:</div>
              <div class="credential-value">${email}</div>
            </div>
            
            ${phone ? `
            <div class="credential-item">
              <div class="credential-label">📱 เบอร์โทรศัพท์:</div>
              <div class="credential-value">${phone}</div>
            </div>
            ` : ''}
            
            <div class="credential-item">
              <div class="credential-label">🔑 รหัสผ่าน (6 หลัก):</div>
              <div class="credential-value" style="font-size: 24px; font-weight: bold; color: #dc2626;">${password}</div>
            </div>
          </div>
          
          <p><strong>⚠️ กรุณาเก็บรักษาข้อมูลนี้ไว้เป็นความลับ</strong></p>
          <p>คุณสามารถเข้าสู่ระบบได้ที่: <a href="http://localhost:3000/teacher-login">http://localhost:3000/teacher-login</a></p>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>📝 หมายเหตุ:</strong></p>
            <ul style="margin: 10px 0; color: #92400e;">
              <li>รหัสผ่านนี้เป็นตัวเลข 6 หลัก</li>
              <li>ใช้ Email และรหัสผ่านนี้ในการเข้าสู่ระบบ</li>
              <li>School ID จะใช้สำหรับอ้างอิงข้อมูลโรงเรียน</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>หากคุณไม่ได้ขอรหัสผ่านนี้ กรุณาติดต่อผู้ดูแลระบบ</p>
          <p>© 2569 Thai Music Platform. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Thai Music Platform - ข้อมูลการเข้าสู่ระบบ

สวัสดีครับ/ค่ะ ${teacherName || ''}

คุณได้ขอรหัสผ่านสำหรับเข้าสู่ระบบ Thai Music Platform

ข้อมูลการเข้าสู่ระบบ:
- โรงเรียน: ${schoolName}
- School ID: ${schoolId}
- Email: ${email}
${phone ? `- เบอร์โทรศัพท์: ${phone}` : ''}
- รหัสผ่าน (6 หลัก): ${password}

เข้าสู่ระบบที่: http://localhost:3000/teacher-login

หมายเหตุ:
- รหัสผ่านนี้เป็นตัวเลข 6 หลัก
- ใช้ Email และรหัสผ่านนี้ในการเข้าสู่ระบบ
- School ID จะใช้สำหรับอ้างอิงข้อมูลโรงเรียน

⚠️ กรุณาเก็บรักษาข้อมูลนี้ไว้เป็นความลับ

หากคุณไม่ได้ขอรหัสผ่านนี้ กรุณาติดต่อผู้ดูแลระบบ
  `;

  return sendEmail({
    to: email,
    subject: 'ข้อมูลการเข้าสู่ระบบ - Thai Music Platform',
    html,
    text,
  });
}
