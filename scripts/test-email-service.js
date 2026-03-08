#!/usr/bin/env node

/**
 * Test email service directly
 */

const nodemailer = require('nodemailer');

async function testEmailService() {
  console.log('📧 Testing email service directly...');
  
  try {
    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'thaimusicplatform@gmail.com',
        pass: 'nrdjwhopknvqiqua'
      }
    });
    
    console.log('✅ Transporter created');
    
    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    // Send test email
    console.log('📤 Sending test email...');
    const testOTP = '123456';
    
    const mailOptions = {
      from: 'thaimusicplatform@gmail.com',
      to: '9golfy@gmail.com',
      subject: 'รหัส OTP สำหรับเข้าถึงแบบฟอร์มของคุณ (ทดสอบ)',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>รหัส OTP</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
              <h2 style="color: #2563eb; margin-bottom: 20px;">รหัส OTP ของคุณ (ทดสอบ)</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937; font-family: monospace;">
                  ${testOTP}
                </div>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                นี่คือการทดสอบการส่งอีเมล OTP
              </p>
              <p style="color: #ef4444; font-size: 12px; margin-top: 20px;">
                ⚠️ นี่เป็นอีเมลทดสอบ
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `รหัส OTP ของคุณ (ทดสอบ): ${testOTP}\n\nนี่คือการทดสอบการส่งอีเมล OTP`
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Check email: 9golfy@gmail.com');
    console.log('🔍 Check spam folder if not in inbox');
    
    return true;
    
  } catch (error) {
    console.error('❌ Email service test failed:', error);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed - check Gmail credentials');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🌐 Network error - check internet connection');
    }
    
    return false;
  }
}

testEmailService();