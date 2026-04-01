#!/usr/bin/env node

/**
 * Test Email Configuration
 * Usage: node test-email.js [recipient@email.com]
 */

require('dotenv').config({ path: '.env.production' });
const nodemailer = require('nodemailer');

// Get recipient from command line or use default
const recipient = process.argv[2] || process.env.SMTP_USER;

console.log('📧 Testing Email Configuration...');
console.log('================================\n');

// Check required environment variables
const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];
const missing = requiredVars.filter(v => !process.env[v]);

if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
}

// Display configuration (masked)
console.log('Configuration:');
console.log(`  Host: ${process.env.SMTP_HOST}`);
console.log(`  Port: ${process.env.SMTP_PORT}`);
console.log(`  User: ${process.env.SMTP_USER}`);
console.log(`  Password: ***${process.env.SMTP_PASSWORD.slice(-4)}`);
console.log(`  From: ${process.env.SMTP_FROM}`);
console.log(`  To: ${recipient}\n`);

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Test connection
console.log('🔌 Testing SMTP connection...');
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP Connection Failed:');
        console.error(error.message);
        process.exit(1);
    } else {
        console.log('✅ SMTP Connection Successful!\n');
        
        // Send test email
        console.log('📨 Sending test email...');
        
        const mailOptions = {
            from: `"${process.env.SMTP_FROM_NAME || 'Thai Music Platform'}" <${process.env.SMTP_FROM}>`,
            to: recipient,
            subject: '✅ Test Email - Thai Music Platform',
            text: 'This is a test email from Thai Music Platform.\n\nIf you receive this, your email configuration is working correctly!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background: #f9f9f9;
                            border-radius: 10px;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 10px 10px 0 0;
                        }
                        .content {
                            background: white;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .success {
                            background: #10b981;
                            color: white;
                            padding: 15px;
                            border-radius: 5px;
                            text-align: center;
                            margin: 20px 0;
                        }
                        .info {
                            background: #f3f4f6;
                            padding: 15px;
                            border-left: 4px solid #667eea;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            color: #6b7280;
                            margin-top: 20px;
                            font-size: 0.9em;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Test Email</h1>
                            <p>Thai Music Platform</p>
                        </div>
                        <div class="content">
                            <div class="success">
                                <h2>✅ Email Configuration Working!</h2>
                            </div>
                            
                            <p>This is a test email from <strong>Thai Music Platform</strong>.</p>
                            
                            <p>If you receive this email, it means your SMTP configuration is working correctly.</p>
                            
                            <div class="info">
                                <strong>📋 Test Details:</strong><br>
                                Server: 164.115.41.34<br>
                                Domain: dcpschool100.net<br>
                                Date: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}<br>
                                SMTP Host: ${process.env.SMTP_HOST}<br>
                                SMTP Port: ${process.env.SMTP_PORT}
                            </div>
                            
                            <p>You can now use this email configuration for:</p>
                            <ul>
                                <li>User registration confirmations</li>
                                <li>Password reset emails</li>
                                <li>Notifications</li>
                                <li>System alerts</li>
                            </ul>
                            
                            <div class="footer">
                                <p>This is an automated test email from Thai Music Platform<br>
                                Please do not reply to this email.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ Failed to send email:');
                console.error(error.message);
                process.exit(1);
            } else {
                console.log('✅ Email sent successfully!');
                console.log(`   Message ID: ${info.messageId}`);
                console.log(`   Response: ${info.response}\n`);
                console.log(`📬 Check your inbox at: ${recipient}`);
                process.exit(0);
            }
        });
    }
});
