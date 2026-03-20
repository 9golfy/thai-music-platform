#!/usr/bin/env node

/**
 * AWS Deploy with Restart
 * 
 * This script provides commands to deploy and restart on AWS
 */

console.log('🚀 AWS Deployment Commands\n');

console.log('📋 คำสั่งที่ต้องรันบน AWS Server:');
console.log('');

console.log('1️⃣ เข้าไปใน AWS server และไปที่ project directory:');
console.log('   cd /path/to/thai-music-platform');
console.log('');

console.log('2️⃣ Pull code ใหม่จาก Git:');
console.log('   git pull origin master');
console.log('');

console.log('3️⃣ Stop containers ที่รันอยู่:');
console.log('   docker-compose -f docker-compose.prod.yml down');
console.log('');

console.log('4️⃣ Build และ start containers ใหม่:');
console.log('   docker-compose -f docker-compose.prod.yml up -d --build');
console.log('');

console.log('5️⃣ ตรวจสอบ status:');
console.log('   docker-compose -f docker-compose.prod.yml ps');
console.log('');

console.log('6️⃣ ดู logs:');
console.log('   docker-compose -f docker-compose.prod.yml logs -f web');
console.log('');

console.log('🔧 Alternative - หากต้องการ restart เฉพาะ web container:');
console.log('   docker restart thai-music-web-prod');
console.log('');

console.log('✅ หลังจาก restart แล้ว ให้ทดสอบ:');
console.log('   - เปิด: http://18.138.63.84:3000/teacher/dashboard/register100/69b02bfe9436e8186f6e41a8');
console.log('   - กด Ctrl+F5 เพื่อ clear cache');
console.log('   - ตรวจสอบว่ารูปภาพแสดงได้');
console.log('');

console.log('🚨 หากยังมีปัญหา:');
console.log('   - ตรวจสอบ logs: docker logs thai-music-web-prod');
console.log('   - ตรวจสอบ files: docker exec thai-music-web-prod ls -la public/uploads/');
console.log('   - ทดสอบ API: curl http://localhost:3000/api/uploads/mgt_1773153278547_manager.jpg');