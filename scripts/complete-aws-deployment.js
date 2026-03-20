#!/usr/bin/env node

/**
 * Complete AWS Deployment
 * 
 * This script provides the complete deployment commands for AWS
 */

console.log('🚀 Complete AWS Deployment Commands\n');

console.log('คุณได้ restart container แล้ว แต่ยังต้อง pull code ใหม่และ rebuild\n');

console.log('📋 รันคำสั่งเหล่านี้บน AWS:');
console.log('');

const commands = [
  {
    step: '1️⃣',
    desc: 'Pull code ใหม่จาก Git',
    cmd: 'git pull origin master'
  },
  {
    step: '2️⃣', 
    desc: 'Stop containers ทั้งหมด',
    cmd: 'docker-compose -f docker-compose.prod.yml down'
  },
  {
    step: '3️⃣',
    desc: 'Build และ start ใหม่',
    cmd: 'docker-compose -f docker-compose.prod.yml up -d --build'
  },
  {
    step: '4️⃣',
    desc: 'ตรวจสอบ status',
    cmd: 'docker-compose -f docker-compose.prod.yml ps'
  },
  {
    step: '5️⃣',
    desc: 'ดู logs',
    cmd: 'docker-compose -f docker-compose.prod.yml logs -f web'
  }
];

commands.forEach(({ step, desc, cmd }) => {
  console.log(`${step} ${desc}:`);
  console.log(`   ${cmd}`);
  console.log('');
});

console.log('🔧 คำสั่งเดียวสำหรับ SSH:');
console.log('');
console.log('ssh -i "D:\\Fatcat\\ThaiMusic\\aws-credential\\thai-music-key.pem" ubuntu@18.138.63.84 "cd ~/registerForm-platform && git pull origin master && docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d --build"');
console.log('');

console.log('✅ หลังจากเสร็จแล้ว ให้ทดสอบ:');
console.log('   1. เปิด: http://18.138.63.84:3000/teacher/dashboard/register100/69b02bfe9436e8186f6e41a8');
console.log('   2. กด Ctrl+F5 เพื่อ clear cache');
console.log('   3. ตรวจสอบว่ารูปภาพแสดงได้');
console.log('');

console.log('🧪 ทดสอบ API โดยตรง:');
console.log('   http://18.138.63.84:3000/api/uploads/mgt_1773153278547_manager.jpg');