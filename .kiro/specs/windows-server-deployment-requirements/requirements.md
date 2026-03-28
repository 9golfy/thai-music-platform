# เอกสารความต้องการ: การติดตั้ง Software บน Windows Server สำหรับ Thai Music Platform

## บทนำ

เอกสารนี้ระบุความต้องการในการติดตั้ง software และ dependencies ที่จำเป็นบน Windows Server เพื่อ deploy โปรเจค Thai Music Platform ซึ่งเดิมทำงานบน AWS Linux server ผ่าน Docker โดยจะต้องเปลี่ยนมาใช้ Windows Server ของลูกค้าแทน

เอกสารนี้จัดทำขึ้นเพื่อให้ System Administrator สามารถนำไปใช้ในการเตรียมความพร้อมของ server และติดตั้ง software ที่จำเป็นทั้งหมดก่อนการ deploy จริง

## คำศัพท์และคำจำกัดความ

- **Windows_Server**: เครื่อง Windows Server ของลูกค้าที่จะใช้ deploy โปรเจค
- **Node_Runtime**: Node.js runtime environment สำหรับรัน Next.js application
- **MongoDB_Server**: MongoDB database server version 7
- **Application**: โปรเจค Thai Music Platform (Next.js 16.1.6)
- **Admin**: System Administrator ผู้ดูแลระบบ
- **Deployment_Package**: ไฟล์และโฟลเดอร์ที่จำเป็นสำหรับการ deploy
- **Environment_Variables**: ตัวแปรสภาพแวดล้อมที่จำเป็นสำหรับการทำงานของ Application
- **Build_Process**: กระบวนการ build Next.js application
- **Production_Server**: Next.js production server ที่รันด้วย npm start
- **Mongo_Express**: Web-based MongoDB admin interface (optional)
- **Upload_Directory**: โฟลเดอร์สำหรับเก็บไฟล์ที่ผู้ใช้อัปโหลด
- **Port**: หมายเลข network port ที่ใช้สำหรับการสื่อสาร
- **Firewall**: Windows Firewall หรือ firewall อื่นๆ ที่ใช้ในระบบ
- **Service**: Windows Service สำหรับรัน application แบบ background
- **SSL_Certificate**: ใบรับรอง SSL/TLS สำหรับ HTTPS (ถ้าใช้)

## ความต้องการ

### Requirement 1: ติดตั้ง Node.js Runtime

**User Story:** ในฐานะ Admin ฉันต้องการติดตั้ง Node.js runtime เพื่อให้สามารถรัน Next.js application ได้

#### Acceptance Criteria

1. THE Windows_Server SHALL มี Node.js version 22.x หรือสูงกว่าติดตั้งอยู่
2. WHEN Admin รันคำสั่ง `node --version` THEN THE Windows_Server SHALL แสดง version number ที่ติดตั้ง
3. WHEN Admin รันคำสั่ง `npm --version` THEN THE Windows_Server SHALL แสดง npm version number
4. THE Node_Runtime SHALL สามารถรันคำสั่ง npm ci และ npm run build ได้สำเร็จ
5. THE Windows_Server SHALL มี PATH environment variable ที่รวม Node.js และ npm

### Requirement 2: ติดตั้ง MongoDB Database Server

**User Story:** ในฐานะ Admin ฉันต้องการติดตั้ง MongoDB server เพื่อเก็บข้อมูลของ application

#### Acceptance Criteria

1. THE Windows_Server SHALL มี MongoDB version 7.x ติดตั้งอยู่
2. THE MongoDB_Server SHALL รันเป็น Windows Service และเริ่มทำงานอัตโนมัติเมื่อ server boot
3. THE MongoDB_Server SHALL listen บน port 27017
4. THE MongoDB_Server SHALL มี authentication เปิดใช้งาน (authSource=admin)
5. THE MongoDB_Server SHALL มี root user account ที่มี username และ password ที่ปลอดภัย
6. THE MongoDB_Server SHALL มี data directory สำหรับเก็บข้อมูลแบบ persistent
7. WHEN Admin รันคำสั่ง `mongosh --version` THEN THE Windows_Server SHALL แสดง MongoDB Shell version

### Requirement 3: กำหนดค่า System Requirements

**User Story:** ในฐานะ Admin ฉันต้องการให้ server มี resources เพียงพอสำหรับรัน application

#### Acceptance Criteria

1. THE Windows_Server SHALL มี RAM อย่างน้อย 4 GB (แนะนำ 8 GB หรือมากกว่า)
2. THE Windows_Server SHALL มี CPU อย่างน้อย 2 cores (แนะนำ 4 cores หรือมากกว่า)
3. THE Windows_Server SHALL มี disk space ว่างอย่างน้อย 20 GB สำหรับ application และ database
4. THE Windows_Server SHALL มี disk space เพิ่มเติมอย่างน้อย 10 GB สำหรับ user uploads
5. THE Windows_Server SHALL รัน Windows Server 2019 หรือสูงกว่า
6. THE Windows_Server SHALL มี internet connection สำหรับ download dependencies และส่ง email

### Requirement 4: กำหนดค่า Network และ Firewall

**User Story:** ในฐานะ Admin ฉันต้องการเปิด ports ที่จำเป็นเพื่อให้ผู้ใช้เข้าถึง application ได้

#### Acceptance Criteria

1. THE Firewall SHALL อนุญาตการเชื่อมต่อ inbound บน port 3000 สำหรับ Next.js application
2. THE Firewall SHALL อนุญาตการเชื่อมต่อ inbound บน port 80 สำหรับ HTTP (ถ้าใช้ reverse proxy)
3. THE Firewall SHALL อนุญาตการเชื่อมต่อ inbound บน port 443 สำหรับ HTTPS (ถ้าใช้ reverse proxy)
4. WHERE Mongo_Express ถูกติดตั้ง, THE Firewall SHALL อนุญาตการเชื่อมต่อ inbound บน port 8081 (เฉพาะ internal network)
5. THE Firewall SHALL อนุญาตการเชื่อมต่อ outbound บน port 587 หรือ 465 สำหรับส่ง email ผ่าน Gmail SMTP
6. THE MongoDB_Server SHALL listen บน localhost (127.0.0.1) หรือ internal network เท่านั้น ไม่เปิดให้ internet เข้าถึงโดยตรง

### Requirement 5: ติดตั้ง Build Tools และ Dependencies

**User Story:** ในฐานะ Admin ฉันต้องการติดตั้ง build tools ที่จำเป็นเพื่อ build application

#### Acceptance Criteria

1. THE Windows_Server SHALL มี npm package manager ติดตั้งอยู่ (มากับ Node.js)
2. THE Windows_Server SHALL สามารถรันคำสั่ง `npm ci` เพื่อติดตั้ง dependencies จาก package-lock.json ได้
3. THE Windows_Server SHALL สามารถรันคำสั่ง `npm run build` เพื่อ build Next.js application ได้
4. WHERE native modules ต้องการ compilation, THE Windows_Server SHALL มี Windows Build Tools ติดตั้งอยู่
5. THE Build_Process SHALL สร้างโฟลเดอร์ .next ที่มี optimized production build

### Requirement 6: กำหนดค่า Environment Variables

**User Story:** ในฐานะ Admin ฉันต้องการตั้งค่า environment variables ที่จำเป็นเพื่อให้ application ทำงานได้ถูกต้อง

#### Acceptance Criteria

1. THE Windows_Server SHALL มี environment variable MONGODB_URI ที่ชี้ไปยัง MongoDB_Server
2. THE Windows_Server SHALL มี environment variable JWT_SECRET ที่มีความยาวอย่างน้อย 32 characters
3. THE Windows_Server SHALL มี environment variable GMAIL_USER และ GMAIL_APP_PASSWORD สำหรับส่ง email
4. THE Windows_Server SHALL มี environment variable NEXT_PUBLIC_APP_URL ที่ระบุ URL ของ application
5. THE Windows_Server SHALL มี environment variable NODE_ENV ที่ตั้งค่าเป็น "production"
6. THE Windows_Server SHALL มี environment variable PORT ที่ตั้งค่าเป็น 3000 (หรือ port ที่ต้องการ)
7. THE Environment_Variables SHALL ถูกตั้งค่าเป็น System Environment Variables ไม่ใช่ User Environment Variables
8. IF environment variable ใดมีข้อมูลที่เป็นความลับ, THEN THE Admin SHALL จำกัดสิทธิ์การเข้าถึงเฉพาะ service account ที่รัน application

### Requirement 7: เตรียม File System และ Directories

**User Story:** ในฐานะ Admin ฉันต้องการสร้างโครงสร้างโฟลเดอร์ที่จำเป็นเพื่อเก็บ application files และ user uploads

#### Acceptance Criteria

1. THE Windows_Server SHALL มีโฟลเดอร์สำหรับ deploy application (เช่น C:\inetpub\thai-music-platform)
2. THE Windows_Server SHALL มีโฟลเดอร์ public\uploads สำหรับเก็บไฟล์ที่ผู้ใช้อัปโหลด
3. THE Upload_Directory SHALL มี write permissions สำหรับ service account ที่รัน application
4. THE MongoDB_Server SHALL มี data directory ที่แยกจาก application directory
5. THE Windows_Server SHALL มีโฟลเดอร์สำหรับเก็บ log files
6. THE Windows_Server SHALL มีโฟลเดอร์สำหรับเก็บ backup files
7. WHEN application เขียนไฟล์ลงใน Upload_Directory, THEN THE Windows_Server SHALL บันทึกไฟล์ได้สำเร็จ

### Requirement 8: ติดตั้งและกำหนดค่า Windows Service

**User Story:** ในฐานะ Admin ฉันต้องการให้ application รันเป็น Windows Service เพื่อให้ทำงานอัตโนมัติและ restart ได้เมื่อ server reboot

#### Acceptance Criteria

1. THE Application SHALL รันเป็น Windows Service โดยใช้เครื่องมืออย่าง NSSM (Non-Sucking Service Manager) หรือ node-windows
2. THE Service SHALL มีชื่อที่ชัดเจน เช่น "ThaiMusicPlatform"
3. THE Service SHALL ตั้งค่าให้เริ่มทำงานอัตโนมัติ (Automatic startup type)
4. THE Service SHALL รันคำสั่ง `npm start` หรือ `node .next/standalone/server.js`
5. WHEN Windows_Server reboot, THEN THE Service SHALL เริ่มทำงานอัตโนมัติ
6. IF Service หยุดทำงานโดยไม่คาดคิด, THEN THE Service SHALL พยายาม restart อัตโนมัติ
7. THE Service SHALL รันภายใต้ service account ที่มีสิทธิ์เพียงพอแต่ไม่ใช่ Administrator
8. THE Service SHALL log การทำงานและ errors ไปยัง log file

### Requirement 9: กำหนดค่า Security และ Permissions

**User Story:** ในฐานะ Admin ฉันต้องการกำหนดค่า security ให้เหมาะสมเพื่อป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต

#### Acceptance Criteria

1. THE MongoDB_Server SHALL มี authentication เปิดใช้งานและไม่อนุญาตให้เข้าถึงแบบ anonymous
2. THE MongoDB_Server SHALL มี strong password ที่มีความยาวอย่างน้อย 16 characters
3. THE JWT_SECRET SHALL สร้างด้วยคำสั่ง `openssl rand -base64 32` หรือเทียบเท่า
4. THE GMAIL_APP_PASSWORD SHALL เป็น App Password ที่สร้างจาก Google Account ไม่ใช่ password ปกติ
5. THE Application SHALL ไม่เปิดเผย environment variables หรือ secrets ใน error messages
6. THE Upload_Directory SHALL จำกัดสิทธิ์การเข้าถึงเฉพาะ service account และ administrators
7. THE Windows_Server SHALL มี Windows Defender หรือ antivirus software ที่ทำงานอยู่
8. WHERE SSL/TLS ถูกใช้งาน, THE Windows_Server SHALL มี valid SSL certificate

### Requirement 10: ติดตั้ง Mongo Express (Optional)

**User Story:** ในฐานะ Admin ฉันต้องการติดตั้ง Mongo Express เพื่อจัดการ database ผ่าน web interface

#### Acceptance Criteria

1. WHERE Mongo_Express ถูกติดตั้ง, THE Windows_Server SHALL รัน Mongo Express บน port 8081
2. WHERE Mongo_Express ถูกติดตั้ง, THE Mongo_Express SHALL เชื่อมต่อกับ MongoDB_Server ได้สำเร็จ
3. WHERE Mongo_Express ถูกติดตั้ง, THE Mongo_Express SHALL มี basic authentication เปิดใช้งาน
4. WHERE Mongo_Express ถูกติดตั้ง, THE Firewall SHALL อนุญาตการเข้าถึง port 8081 เฉพาะจาก internal network เท่านั้น
5. WHERE Mongo_Express ถูกติดตั้ง, THE Mongo_Express SHALL รันเป็น Windows Service แยกจาก Application

### Requirement 11: เตรียม Deployment Package

**User Story:** ในฐานะ Admin ฉันต้องการได้รับ deployment package ที่พร้อม deploy เพื่อลดขั้นตอนการติดตั้ง

#### Acceptance Criteria

1. THE Deployment_Package SHALL ประกอบด้วยโฟลเดอร์ .next ที่ build แล้ว
2. THE Deployment_Package SHALL ประกอบด้วยโฟลเดอร์ node_modules ที่ติดตั้ง dependencies แล้ว
3. THE Deployment_Package SHALL ประกอบด้วยโฟลเดอร์ public สำหรับ static files
4. THE Deployment_Package SHALL ประกอบด้วยไฟล์ package.json และ next.config.ts
5. THE Deployment_Package SHALL ประกอบด้วยไฟล์ .env.example เป็นตัวอย่างการตั้งค่า environment variables
6. THE Deployment_Package SHALL ประกอบด้วยเอกสารคู่มือการติดตั้งเป็นภาษาไทย
7. THE Deployment_Package SHALL มีขนาดไฟล์ที่เหมาะสมสำหรับการถ่ายโอน (ไม่รวม .git, .next/cache, node_modules/.cache)

### Requirement 12: ทดสอบการติดตั้งและ Deployment

**User Story:** ในฐานะ Admin ฉันต้องการทดสอบว่า application ทำงานได้ถูกต้องหลังจากติดตั้ง

#### Acceptance Criteria

1. WHEN Admin เข้าถึง application URL, THEN THE Application SHALL แสดงหน้า home page ได้ถูกต้อง
2. WHEN Admin ทดสอบ login, THEN THE Application SHALL สามารถ authenticate ผู้ใช้ได้
3. WHEN Admin ทดสอบการอัปโหลดไฟล์, THEN THE Application SHALL บันทึกไฟล์ลงใน Upload_Directory ได้
4. WHEN Admin ทดสอบการส่ง email, THEN THE Application SHALL ส่ง email ผ่าน Gmail SMTP ได้สำเร็จ
5. WHEN Admin ตรวจสอบ MongoDB, THEN THE MongoDB_Server SHALL มี database และ collections ที่จำเป็น
6. WHEN Admin restart Windows_Server, THEN THE Application และ MongoDB_Server SHALL เริ่มทำงานอัตโนมัติ
7. WHEN Admin ตรวจสอบ log files, THEN THE Application SHALL บันทึก logs ได้ถูกต้องและไม่มี critical errors

### Requirement 13: จัดทำเอกสารและ Checklist

**User Story:** ในฐานะ Admin ฉันต้องการเอกสารและ checklist ที่ชัดเจนเพื่อใช้ในการติดตั้ง

#### Acceptance Criteria

1. THE Admin SHALL ได้รับเอกสารคู่มือการติดตั้งเป็นภาษาไทยที่มีขั้นตอนละเอียด
2. THE Admin SHALL ได้รับ checklist สำหรับตรวจสอบความพร้อมของ server ก่อนติดตั้ง
3. THE Admin SHALL ได้รับ checklist สำหรับตรวจสอบหลังการติดตั้ง
4. THE Admin SHALL ได้รับรายการ download links สำหรับ software ทั้งหมดที่ต้องติดตั้ง
5. THE Admin SHALL ได้รับตัวอย่างคำสั่งและ configuration files ที่จำเป็น
6. THE Admin SHALL ได้รับข้อมูล troubleshooting สำหรับปัญหาที่พบบ่อย
7. THE Admin SHALL ได้รับข้อมูลการติดต่อสำหรับขอความช่วยเหลือเมื่อเกิดปัญหา

### Requirement 14: วางแผน Backup และ Recovery

**User Story:** ในฐานะ Admin ฉันต้องการมีแผน backup และ recovery เพื่อป้องกันการสูญหายของข้อมูล

#### Acceptance Criteria

1. THE Admin SHALL มีแผนการ backup MongoDB database อย่างน้อยวันละ 1 ครั้ง
2. THE Admin SHALL มีแผนการ backup Upload_Directory อย่างน้อยวันละ 1 ครั้ง
3. THE Admin SHALL มีแผนการ backup environment variables และ configuration files
4. THE Admin SHALL ทดสอบการ restore จาก backup อย่างน้อยเดือนละ 1 ครั้ง
5. THE Admin SHALL เก็บ backup files ไว้ในตำแหน่งที่แยกจาก production server
6. THE Admin SHALL มีเอกสารขั้นตอนการ restore ที่ชัดเจน
7. WHEN เกิดปัญหากับ production server, THEN THE Admin SHALL สามารถ restore จาก backup ได้ภายใน 4 ชั่วโมง

### Requirement 15: กำหนดค่า Monitoring และ Logging

**User Story:** ในฐานะ Admin ฉันต้องการ monitor สถานะของ application และ database เพื่อตรวจจับปัญหาได้ทันท่วงที

#### Acceptance Criteria

1. THE Application SHALL บันทึก logs ไปยัง log file ที่กำหนด
2. THE Application SHALL บันทึก error logs แยกจาก access logs
3. THE Admin SHALL สามารถดู logs ผ่าน Windows Event Viewer หรือ log management tool
4. THE Admin SHALL ตั้งค่า log rotation เพื่อไม่ให้ log files ใหญ่เกินไป
5. THE Admin SHALL monitor disk space usage สำหรับ application, database, และ uploads
6. THE Admin SHALL monitor CPU และ memory usage ของ Application และ MongoDB_Server
7. WHERE monitoring tool ถูกใช้งาน, THE Admin SHALL ตั้งค่า alerts สำหรับ critical events เช่น service down, disk full, high CPU usage

### Requirement 16: วางแผน Update และ Maintenance

**User Story:** ในฐานะ Admin ฉันต้องการมีแผนการ update และ maintenance ที่ชัดเจนเพื่อให้ระบบทำงานได้อย่างต่อเนื่อง

#### Acceptance Criteria

1. THE Admin SHALL มีแผนการ update Node.js และ npm เมื่อมี security patches
2. THE Admin SHALL มีแผนการ update MongoDB เมื่อมี security patches
3. THE Admin SHALL มีแผนการ update Application เมื่อมี version ใหม่
4. THE Admin SHALL มีแผนการ maintenance window สำหรับการ update ที่ต้อง downtime
5. THE Admin SHALL แจ้งผู้ใช้ล่วงหน้าอย่างน้อย 24 ชั่วโมงก่อนการ maintenance
6. THE Admin SHALL ทดสอบการ update บน test environment ก่อนนำไปใช้บน production
7. WHEN มีการ update, THEN THE Admin SHALL สร้าง backup ก่อนการ update ทุกครั้ง
