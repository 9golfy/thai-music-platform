#!/usr/bin/env node

const { execSync } = require('child_process');

const schoolId = process.argv[2] || 'SCH-20260310-0004';

console.log(`🔍 Checking production data for School ID: ${schoolId}\n`);

const command = `ssh -i "D:\\Fatcat\\ThaiMusic\\aws-credential\\thai-music-key.pem" ubuntu@18.138.63.84 "docker exec thai-music-mongo mongosh thai_music_school --quiet --eval 'printjson(db.register100_submissions.findOne({schoolId: \\"${schoolId}\\"}, {schoolId: 1, reg100_schoolName: 1, teacherEmail: 1, total_score: 1, createdAt: 1, _id: 1}))'"`;

try {
  const output = execSync(command, { encoding: 'utf8' });
  console.log(output);
  
  if (output.includes('null')) {
    console.log('❌ ไม่พบข้อมูลใน production database');
  } else {
    console.log('✅ พบข้อมูลใน production database แล้ว');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
