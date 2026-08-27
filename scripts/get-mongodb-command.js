/**
 * Generate MongoDB command to set OTP = 123456
 * รันแล้วจะได้คำสั่ง MongoDB ที่พร้อมใช้
 */

const bcrypt = require('bcryptjs');

async function main() {
  const otp = '123456';
  const token = '4cc2b38f-d2bf-4cda-acb1-2caa464dc826';
  
  console.log('🔐 Generating bcrypt hash for OTP:', otp);
  
  const hashedOTP = await bcrypt.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  const now = new Date();
  
  console.log('✅ Hash generated!\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Copy and paste this command in MongoDB Shell (mongosh):');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('use thai_music_school\n');
  console.log(`db.draft_submissions.updateOne(`);
  console.log(`  { token: "${token}" },`);
  console.log(`  {`);
  console.log(`    $set: {`);
  console.log(`      otp: "${hashedOTP}",`);
  console.log(`      otpPlainText: "${otp}",`);
  console.log(`      otpExpiresAt: ISODate("${otpExpiresAt.toISOString()}"),`);
  console.log(`      lastOtpRequestAt: ISODate("${now.toISOString()}")`);
  console.log(`    },`);
  console.log(`    $inc: { otpRequestCount: 1 }`);
  console.log(`  }`);
  console.log(`)\n`);
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔐 OTP CODE: ' + otp);
  console.log('⏰ Expires at:', otpExpiresAt.toLocaleString('th-TH'));
  console.log('🔗 Draft URL: https://dcpschool100.net/draft/' + token);
  console.log('═══════════════════════════════════════════════════════════');
}

main();
