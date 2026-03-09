// Test email sending functionality
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmailSending() {
  console.log('🧪 Testing Email Configuration...\n');

  // Check environment variables
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  console.log('📧 Configuration:');
  console.log('GMAIL_USER:', gmailUser || 'NOT SET');
  console.log('GMAIL_APP_PASSWORD:', gmailPassword ? 'SET (hidden)' : 'NOT SET');
  console.log('');

  if (!gmailUser || !gmailPassword) {
    console.log('❌ Email configuration incomplete');
    console.log('Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env file');
    return;
  }

  if (gmailUser === 'your-email@gmail.com' || gmailPassword === 'your-gmail-app-password') {
    console.log('❌ Using placeholder values');
    console.log('Please update .env with actual Gmail credentials');
    return;
  }

  // Test email connection
  try {
    console.log('🔗 Testing Gmail connection...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail connection successful');

    // Send test email
    console.log('📤 Sending test email...');
    
    const testEmail = {
      from: `"Thai Music Platform Test" <${gmailUser}>`,
      to: gmailUser, // Send to self for testing
      subject: 'Test Email - Thai Music Platform',
      html: `
        <h2>🎵 Test Email</h2>
        <p>This is a test email from Thai Music Platform.</p>
        <p>Time: ${new Date().toLocaleString('th-TH')}</p>
        <p>If you receive this, email configuration is working correctly!</p>
      `,
      text: `Test Email - Thai Music Platform\n\nThis is a test email.\nTime: ${new Date().toLocaleString('th-TH')}`
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Check your inbox:', gmailUser);

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('1. Gmail address is correct');
      console.log('2. App Password is correct (not regular password)');
      console.log('3. 2-Factor Authentication is enabled');
      console.log('4. Generate App Password at: https://myaccount.google.com/apppasswords');
    }
  }
}

testEmailSending();