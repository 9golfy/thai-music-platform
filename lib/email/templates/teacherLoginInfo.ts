// Email templates for teacher login information

export interface TeacherLoginInfoData {
  teacherEmail: string;
  teacherPhone: string;
  schoolName: string;
  schoolId: string;
  password: string;
  loginUrl: string;
  submissionType: 'register100' | 'register_support';
  submissionId: string;
}

export function generateTeacherLoginInfoEmailHTML(data: TeacherLoginInfoData): string {
  const submissionTypeName = data.submissionType === 'register100' 
    ? 'โรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์' 
    : 'โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย';

  // Get current date and time
  const now = new Date();
  const registrationDate = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const registrationTime = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ข้อมูลการเข้าสู่ระบบ - Thai Music Platform</title>
      <style>
        body { 
          font-family: 'Sarabun', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #00B050 0%, #009040 100%); 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content { 
          padding: 30px 20px; 
        }
        .welcome-section {
          text-align: center;
          margin-bottom: 30px;
        }
        .welcome-section h2 {
          color: #00B050;
          font-size: 20px;
          margin: 0 0 10px 0;
        }
        .school-info {
          background: #f8f9fa;
          border-left: 4px solid #00B050;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .school-info h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 18px;
        }
        .info-item {
          display: flex;
          align-items: center;
          margin: 12px 0;
          padding: 8px 0;
        }
        .info-label {
          font-weight: bold;
          color: #555;
          min-width: 140px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .info-value {
          color: #00B050;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          background: #e8f5e8;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .password-highlight {
          background: #fff3cd;
          border: 2px solid #ffc107;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
          text-align: center;
        }
        .password-highlight .password {
          font-size: 28px;
          font-weight: bold;
          color: #dc3545;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          margin: 10px 0;
        }
        .password-box {
          background: #fff3e0;
          border: 2px solid #ff9800;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          text-align: center;
        }
        .password-box .password-value {
          font-size: 24px;
          font-weight: bold;
          color: #e65100;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          margin: 5px 0;
        }
        .password-warning {
          font-size: 14px;
          color: #f57c00;
          margin: 8px 0 0 0;
          font-weight: bold;
        }
        .login-button {
          display: inline-block;
          background: linear-gradient(135deg, #00B050 0%, #009040 100%);
          color: white !important;
          padding: 20px 40px;
          text-decoration: none;
          border-radius: 12px;
          font-weight: bold;
          font-size: 18px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 6px 12px rgba(0, 176, 80, 0.4);
          transition: transform 0.2s;
          width: 80%;
          max-width: 400px;
        }
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 176, 80, 0.5);
          color: white !important;
        }
        .instructions {
          background: #e3f2fd;
          border: 1px solid #2196f3;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
        }
        .instructions h4 {
          color: #1976d2;
          margin: 0 0 15px 0;
          font-size: 16px;
        }
        .instructions ol {
          margin: 0;
          padding-left: 20px;
        }
        .instructions li {
          margin: 8px 0;
          color: #1565c0;
        }
        .warning {
          background: #fff3e0;
          border: 1px solid #ff9800;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .warning p {
          margin: 0;
          color: #f57c00;
          font-weight: bold;
        }
        .footer { 
          background: #f8f9fa;
          text-align: center; 
          color: #6c757d; 
          font-size: 14px; 
          padding: 20px;
          border-top: 1px solid #dee2e6;
        }
        .footer p {
          margin: 5px 0;
        }
        .divider {
          border-top: 2px solid #dee2e6;
          margin: 25px 0;
        }
        @media (max-width: 600px) {
          .container {
            margin: 0;
            box-shadow: none;
          }
          .content {
            padding: 20px 15px;
          }
          .info-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
          .info-label {
            min-width: auto;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎵 Thai Music Platform</h1>
          <p>ข้อมูลการเข้าสู่ระบบสำหรับคุณครู</p>
        </div>
        
        <div class="content">
          <div class="welcome-section">
            <h2>ยินดีต้อนรับสู่ระบบ Thai Music Platform</h2>
            <p>การลงทะเบียนของโรงเรียนเสร็จสมบูรณ์แล้ว</p>
          </div>

          <div class="school-info">
            <div class="info-item">
              <div class="info-label">
                📝 ประเภทการสมัคร:
              </div>
              <div class="info-value">${submissionTypeName}</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                🏫 ชื่อโรงเรียน:
              </div>
              <div class="info-value">${data.schoolName || 'ไม่ระบุ'}</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                ลงทะเบียนสำเร็จ:
              </div>
              <div class="info-value">${registrationDate} เวลา ${registrationTime}</div>
            </div>

            <div class="divider"></div>
            
            <h3>👨‍🏫 ข้อมูลการเข้าสู่ระบบ</h3>
            
            <div class="info-item">
              <div class="info-label">
                📧 Email:
              </div>
              <div class="info-value">${data.teacherEmail}</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                🆔 School ID:
              </div>
              <div class="info-value">${data.schoolId}</div>
            </div>
            
            <div class="password-box">
              <div>🔑 รหัสผ่าน (6 หลัก):</div>
              <div class="password-value">${data.password}</div>
              <div class="password-warning">⚠️ กรุณาเก็บรหัสผ่านนี้ไว้เป็นความลับ</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">
                📱 เบอร์โทรศัพท์:
              </div>
              <div class="info-value">${data.teacherPhone}</div>
            </div>
          </div>


          <div style="text-align: center;">
            <a href="${data.loginUrl}" class="login-button">
              🚀 เข้าสู่ระบบ Teacher Dashboard
            </a>
          </div>

          <div class="instructions">
            <h4>📖 วิธีการเข้าสู่ระบบ</h4>
            <ol>
              <li>คลิกปุ่ม "เข้าสู่ระบบ Teacher Dashboard" ด้านบน</li>
              <li>กรอก Email: <strong>${data.teacherEmail}</strong></li>
              <li>กรอกรหัสผ่าน: <strong>${data.password}</strong></li>
              <li>กรอก School ID: <strong>${data.schoolId}</strong></li>
              <li>คลิก "เข้าสู่ระบบ"</li>
              <li>คุณจะสามารถดูข้อมูลโรงเรียนและสถานะการสมัครได้</li>
            </ol>
          </div>

          <div class="warning">
            <p>🔒 ข้อมูลสำคัญ: กรุณาเก็บรักษาข้อมูลการเข้าสู่ระบบนี้ไว้เป็นความลับ และอย่าแชร์ให้ผู้อื่น</p>
          </div>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #2e7d32; text-align: center;">
              <strong>✅ หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อทีมงาน</strong>
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thai Music Platform</strong></p>
          <p>โครงการคัดเลือกสถานศึกษา ตามกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์</p>
          <p>© ๒๕๖๙ กระทรวงวัฒนธรรม. สงวนลิขสิทธิ์.</p>
          <p style="font-size: 12px; color: #999;">
            หากคุณไม่ได้ลงทะเบียนในระบบนี้ กรุณาติดต่อผู้ดูแลระบบ
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateTeacherLoginInfoEmailText(data: TeacherLoginInfoData): string {
  const submissionTypeName = data.submissionType === 'register100' 
    ? 'โรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์' 
    : 'โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย';

  // Get current date and time
  const now = new Date();
  const registrationDate = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const registrationTime = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
Thai Music Platform - ข้อมูลการเข้าสู่ระบบสำหรับคุณครู

ยินดีต้อนรับสู่ระบบ Thai Music Platform
การลงทะเบียนของโรงเรียนเสร็จสมบูรณ์แล้ว

📝 ประเภทการสมัคร: ${submissionTypeName}

👨‍🏫 ข้อมูลการเข้าสู่ระบบ
🏫 ชื่อโรงเรียน: ${data.schoolName || 'ไม่ระบุ'}
ลงทะเบียนสำเร็จ: ${registrationDate} เวลา ${registrationTime}

-----------------

👨‍🏫 ข้อมูลการเข้าสู่ระบบ
📧 Email: ${data.teacherEmail}
🆔 School ID: ${data.schoolId}
📱 เบอร์โทรศัพท์: ${data.teacherPhone}

🔑 รหัสผ่านของคุณ (6 หลัก): ${data.password}
⚠️ กรุณาเก็บรหัสผ่านนี้ไว้เป็นความลับ

วิธีการเข้าสู่ระบบ:
1. เข้าไปที่: ${data.loginUrl}
2. กรอก Email: ${data.teacherEmail}
3. กรอกรหัสผ่าน: ${data.password}
4. คลิก "เข้าสู่ระบบ"
5. คุณจะสามารถดูข้อมูลโรงเรียนและสถานะการสมัครได้

🔒 ข้อมูลสำคัญ: กรุณาเก็บรักษาข้อมูลการเข้าสู่ระบบนี้ไว้เป็นความลับ และอย่าแชร์ให้ผู้อื่น

✅ หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อทีมงาน

---
Thai Music Platform
โครงการคัดเลือกสถานศึกษา ตามกิจกรรมโรงเรียนดนตรีไทย ๑๐๐ เปอร์เซ็นต์
© ๒๕๖๙ กระทรวงวัฒนธรรม. สงวนลิขสิทธิ์.

หากคุณไม่ได้ลงทะเบียนในระบบนี้ กรุณาติดต่อผู้ดูแลระบบ
  `;
}

export function getTeacherLoginInfoEmailSubject(schoolName: string): string {
  return `🎵 ข้อมูลการเข้าสู่ระบบ - ${schoolName} | Thai Music Platform`;
}