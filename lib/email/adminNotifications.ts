// Admin notification email service
import { sendEmail } from './mailer';

const ADMIN_EMAIL = 'thaimusicplatform@gmail.com';

/**
 * Send notification to admin when new user registers
 */
export async function notifyAdminNewRegistration(
  schoolName: string,
  schoolId: string,
  email: string,
  submissionType: string,
  submissionId: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
        .info-box { background: white; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .info-item { margin: 10px 0; }
        .label { font-weight: bold; color: #1f2937; }
        .value { color: #2563eb; font-family: monospace; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 การลงทะเบียนใหม่</h1>
          <p>กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ - Admin Notification</p>
        </div>
        
        <div class="content">
          <h2>มีโรงเรียนลงทะเบียนใหม่</h2>
          
          <div class="info-box">
            <div class="info-item">
              <span class="label">🏫 ชื่อโรงเรียน:</span>
              <span class="value">${schoolName}</span>
            </div>
            
            <div class="info-item">
              <span class="label">🆔 School ID:</span>
              <span class="value">${schoolId}</span>
            </div>
            
            <div class="info-item">
              <span class="label">📧 Email:</span>
              <span class="value">${email}</span>
            </div>
            
            <div class="info-item">
              <span class="label">📝 ประเภทการสมัคร:</span>
              <span class="value">${submissionType === 'register100' ? 'โรงเรียนดนตรีไทย 100 เปอร์เซ็นต์' : 'โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย'}</span>
            </div>
            
            <div class="info-item">
              <span class="label">🔗 Submission ID:</span>
              <span class="value">${submissionId}</span>
            </div>
            
            <div class="info-item">
              <span class="label">⏰ วันที่ลงทะเบียน:</span>
              <span class="value">${new Date().toLocaleString('th-TH')}</span>
            </div>
          </div>
          
          <div style="background: #dbeafe; border: 1px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;"><strong>📋 การดำเนินการต่อไป:</strong></p>
            <ul style="margin: 10px 0; color: #1e40af;">
              <li>ตรวจสอบข้อมูลการสมัครในระบบ Admin</li>
              <li>พิจารณาอนุมัติหรือปฏิเสธการสมัคร</li>
              <li>ติดต่อโรงเรียนหากต้องการข้อมูลเพิ่มเติม</li>
            </ul>
          </div>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dcp-admin/dashboard" 
               style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              เข้าสู่ระบบ Admin
            </a>
          </p>
        </div>
        
        <div class="footer">
          <p>© 2569 กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ - การลงทะเบียนใหม่

มีโรงเรียนลงทะเบียนใหม่:

ชื่อโรงเรียน: ${schoolName}
School ID: ${schoolId}
Email: ${email}
ประเภทการสมัคร: ${submissionType === 'register100' ? 'โรงเรียนดนตรีไทย 100 เปอร์เซ็นต์' : 'โรงเรียนสนับสนุนและส่งเสริมดนตรีไทย'}
Submission ID: ${submissionId}
วันที่ลงทะเบียน: ${new Date().toLocaleString('th-TH')}

การดำเนินการต่อไป:
- ตรวจสอบข้อมูลการสมัครในระบบ Admin
- พิจารณาอนุมัติหรือปฏิเสธการสมัคร
- ติดต่อโรงเรียนหากต้องการข้อมูลเพิ่มเติม

เข้าสู่ระบบ Admin: ${process.env.NEXT_PUBLIC_APP_URL}/dcp-admin/dashboard
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🚨 การลงทะเบียนใหม่: ${schoolName} (${schoolId})`,
    html,
    text,
  });
}

/**
 * Send notification to admin when password reset is requested
 */
export async function notifyAdminPasswordReset(
  teacherName: string,
  email: string,
  schoolId: string,
  schoolName: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
        .info-box { background: white; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .info-item { margin: 10px 0; }
        .label { font-weight: bold; color: #1f2937; }
        .value { color: #2563eb; font-family: monospace; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔑 การขอรหัสผ่านใหม่</h1>
          <p>กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ - Admin Notification</p>
        </div>
        
        <div class="content">
          <h2>มีการขอรหัสผ่านใหม่</h2>
          
          <div class="info-box">
            <div class="info-item">
              <span class="label">👨‍🏫 ชื่อครู:</span>
              <span class="value">${teacherName}</span>
            </div>
            
            <div class="info-item">
              <span class="label">📧 Email:</span>
              <span class="value">${email}</span>
            </div>
            
            <div class="info-item">
              <span class="label">🏫 โรงเรียน:</span>
              <span class="value">${schoolName}</span>
            </div>
            
            <div class="info-item">
              <span class="label">🆔 School ID:</span>
              <span class="value">${schoolId}</span>
            </div>
            
            <div class="info-item">
              <span class="label">⏰ วันที่ขอรหัสผ่าน:</span>
              <span class="value">${new Date().toLocaleString('th-TH')}</span>
            </div>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>ℹ️ หมายเหตุ:</strong></p>
            <p style="margin: 10px 0; color: #92400e;">
              ระบบได้ส่งรหัสผ่านใหม่ไปยังอีเมลของครูแล้ว
              การแจ้งเตือนนี้เพื่อให้ทราบถึงกิจกรรมในระบบ
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2569 กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ - การขอรหัสผ่านใหม่

มีการขอรหัสผ่านใหม่:

ชื่อครู: ${teacherName}
Email: ${email}
โรงเรียน: ${schoolName}
School ID: ${schoolId}
วันที่ขอรหัสผ่าน: ${new Date().toLocaleString('th-TH')}

หมายเหตุ:
ระบบได้ส่งรหัสผ่านใหม่ไปยังอีเมลของครูแล้ว
การแจ้งเตือนนี้เพื่อให้ทราบถึงกิจกรรมในระบบ
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔑 การขอรหัสผ่านใหม่: ${teacherName} (${schoolId})`,
    html,
    text,
  });
}

/**
 * Send daily summary to admin
 */
export async function sendDailySummaryToAdmin(
  newRegistrations: number,
  passwordResets: number,
  totalActiveSchools: number
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #e5e7eb; }
        .stat-number { font-size: 2em; font-weight: bold; color: #059669; }
        .stat-label { color: #6b7280; font-size: 0.9em; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 สรุปรายวัน</h1>
          <p>กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ - ${new Date().toLocaleDateString('th-TH')}</p>
        </div>
        
        <div class="content">
          <h2>สถิติกิจกรรมวันนี้</h2>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${newRegistrations}</div>
              <div class="stat-label">การลงทะเบียนใหม่</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-number">${passwordResets}</div>
              <div class="stat-label">การขอรหัสผ่านใหม่</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-number">${totalActiveSchools}</div>
              <div class="stat-label">โรงเรียนที่ใช้งานทั้งหมด</div>
            </div>
          </div>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dcp-admin/dashboard" 
               style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              ดูรายละเอียดในระบบ Admin
            </a>
          </p>
        </div>
        
        <div class="footer">
          <p>© 2569 กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ - สรุปรายวัน
${new Date().toLocaleDateString('th-TH')}

สถิติกิจกรรมวันนี้:
- การลงทะเบียนใหม่: ${newRegistrations}
- การขอรหัสผ่านใหม่: ${passwordResets}
- โรงเรียนที่ใช้งานทั้งหมด: ${totalActiveSchools}

ดูรายละเอียดในระบบ Admin: ${process.env.NEXT_PUBLIC_APP_URL}/dcp-admin/dashboard
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `📊 สรุปรายวัน กิจกรรมโรงเรียนดนตรีไทย 100 เปอร์เซ็นต์ - ${new Date().toLocaleDateString('th-TH')}`,
    html,
    text,
  });
}
