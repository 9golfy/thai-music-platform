# แผนการติดตั้ง: Thai Music Platform บน Windows Server

## ภาพรวม

เอกสารนี้เป็นแผนการติดตั้ง Thai Music Platform บน Windows Server โดยแปลงจากระบบเดิมที่ใช้ Docker บน AWS Linux มาเป็นการติดตั้งแบบ native บน Windows Server ครอบคลุมการติดตั้ง Node.js, MongoDB, การตั้งค่า Windows Services, และการกำหนดค่าระบบต่างๆ

## Tasks

- [ ] 1. เตรียมความพร้อม Windows Server และตรวจสอบ System Requirements
  - ตรวจสอบ Windows Server version (2019 หรือสูงกว่า)
  - ตรวจสอบ RAM อย่างน้อย 4 GB (แนะนำ 8 GB)
  - ตรวจสอบ CPU อย่างน้อย 2 cores (แนะนำ 4 cores)
  - ตรวจสอบ disk space ว่างอย่างน้อย 30 GB
  - ตรวจสอบ internet connection
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 2. ติดตั้ง Node.js Runtime
  - [ ] 2.1 ดาวน์โหลดและติดตั้ง Node.js 22.x LTS
    - ดาวน์โหลด installer จาก https://nodejs.org
    - รัน installer และเลือก default options
    - ตรวจสอบว่า Node.js และ npm ถูกเพิ่มเข้า System PATH
    - _Requirements: 1.1, 1.5_
  
  - [ ] 2.2 ตรวจสอบการติดตั้ง Node.js
    - รันคำสั่ง `node --version` และตรวจสอบ version
    - รันคำสั่ง `npm --version` และตรวจสอบ version
    - _Requirements: 1.2, 1.3_


- [ ] 3. ติดตั้งและกำหนดค่า MongoDB 7.x
  - [ ] 3.1 ดาวน์โหลดและติดตั้ง MongoDB Community Server
    - ดาวน์โหลด MongoDB 7.x MSI installer จาก https://www.mongodb.com/try/download/community
    - รัน installer และเลือก Complete installation
    - เลือกติดตั้งเป็น Windows Service
    - เลือกติดตั้ง MongoDB Compass (optional)
    - _Requirements: 2.1_
  
  - [ ] 3.2 สร้าง data directories สำหรับ MongoDB
    - สร้างโฟลเดอร์ `C:\data\mongodb\data`
    - สร้างโฟลเดอร์ `C:\data\mongodb\logs`
    - _Requirements: 2.6_
  
  - [ ] 3.3 กำหนดค่า MongoDB configuration file
    - แก้ไขไฟล์ `C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg`
    - ตั้งค่า data path, log path, port 27017, bind IP เป็น 127.0.0.1
    - เปิดใช้งาน authentication
    - _Requirements: 2.3, 2.4, 2.6_
  
  - [ ] 3.4 สร้าง MongoDB root user
    - เชื่อมต่อ MongoDB ด้วย `mongosh`
    - สร้าง root user ด้วย strong password (16+ characters)
    - ทดสอบการ login ด้วย credentials ที่สร้าง
    - _Requirements: 2.4, 2.5, 9.1, 9.2_
  
  - [ ] 3.5 ตรวจสอบ MongoDB Service
    - ตรวจสอบว่า MongoDB Service รันอยู่ใน services.msc
    - ตั้งค่า Startup Type เป็น Automatic
    - ทดสอบ restart service
    - _Requirements: 2.2, 2.7_

- [ ] 4. สร้างโครงสร้างโฟลเดอร์สำหรับ Application
  - [ ] 4.1 สร้าง application directory
    - สร้างโฟลเดอร์ `C:\inetpub\thai-music-platform`
    - _Requirements: 7.1_
  
  - [ ] 4.2 สร้าง uploads directory
    - สร้างโฟลเดอร์ `C:\inetpub\thai-music-platform\public\uploads`
    - สร้างโฟลเดอร์ย่อย: certificates, documents, images
    - _Requirements: 7.2_
  
  - [ ] 4.3 สร้าง logs และ backups directories
    - สร้างโฟลเดอร์ `C:\logs\thai-music-platform`
    - สร้างโฟลเดอร์ `C:\backups\thai-music-platform\mongodb`
    - สร้างโฟลเดอร์ `C:\backups\thai-music-platform\uploads`
    - _Requirements: 7.5, 7.6_
  
  - [ ] 4.4 ตั้งค่า permissions สำหรับโฟลเดอร์
    - กำหนดสิทธิ์ Read/Write สำหรับ uploads directory
    - กำหนดสิทธิ์ Read/Write สำหรับ logs directory
    - _Requirements: 7.3, 9.6_


- [ ] 5. ตั้งค่า Environment Variables
  - [ ] 5.1 สร้าง JWT Secret
    - สร้าง JWT secret ด้วย PowerShell: `$bytes = New-Object byte[] 32; [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)`
    - บันทึก secret ไว้ในที่ปลอดภัย
    - _Requirements: 6.2, 9.3_
  
  - [ ] 5.2 เตรียม Gmail App Password
    - สร้าง App Password จาก Google Account settings
    - บันทึก App Password ไว้
    - _Requirements: 6.3, 9.4_
  
  - [ ] 5.3 ตั้งค่า System Environment Variables
    - เปิด PowerShell as Administrator
    - ตั้งค่า MONGODB_URI: `mongodb://root:<password>@localhost:27017/thai_music_school?authSource=admin`
    - ตั้งค่า JWT_SECRET ที่สร้างไว้
    - ตั้งค่า GMAIL_USER และ GMAIL_APP_PASSWORD
    - ตั้งค่า NODE_ENV=production
    - ตั้งค่า PORT=3000
    - ตั้งค่า NEXT_PUBLIC_APP_URL=http://<server-ip>:3000
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [ ] 5.4 ตรวจสอบ Environment Variables
    - รันคำสั่ง `[System.Environment]::GetEnvironmentVariable('MONGODB_URI', 'Machine')` เพื่อตรวจสอบ
    - ตรวจสอบว่าทุกตัวแปรถูกตั้งค่าถูกต้อง
    - _Requirements: 6.7_

- [ ] 6. Deploy Application Files
  - [ ] 6.1 คัดลอก source files ไปยัง application directory
    - คัดลอกไฟล์ทั้งหมดจาก deployment package ไปยัง `C:\inetpub\thai-music-platform`
    - ตรวจสอบว่ามีไฟล์ package.json, next.config.ts, และโฟลเดอร์ app, components, lib, public
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [ ] 6.2 ติดตั้ง dependencies
    - เปิด Command Prompt ใน application directory
    - รันคำสั่ง `npm ci` เพื่อติดตั้ง dependencies
    - รอจนกว่าการติดตั้งเสร็จสมบูรณ์
    - _Requirements: 1.4, 5.2_
  
  - [ ] 6.3 Build Next.js application
    - รันคำสั่ง `npm run build` เพื่อ build application
    - ตรวจสอบว่าโฟลเดอร์ .next ถูกสร้างขึ้น
    - ตรวจสอบว่าไม่มี build errors
    - _Requirements: 1.4, 5.3, 5.5_
  
  - [ ] 6.4 ทดสอบรัน application แบบ manual
    - รันคำสั่ง `npm start` เพื่อทดสอบ
    - เปิด browser และเข้า http://localhost:3000
    - ตรวจสอบว่า application แสดงหน้า home page ได้
    - กด Ctrl+C เพื่อหยุด application
    - _Requirements: 12.1_


- [ ] 7. ติดตั้ง NSSM และสร้าง Windows Service
  - [ ] 7.1 ดาวน์โหลดและติดตั้ง NSSM
    - ดาวน์โหลด NSSM จาก https://nssm.cc/download
    - แตกไฟล์และคัดลอก nssm.exe ไปยัง `C:\Windows\System32`
    - _Requirements: 8.1_
  
  - [ ] 7.2 สร้าง Windows Service สำหรับ Application
    - เปิด Command Prompt as Administrator
    - รันคำสั่ง: `nssm install ThaiMusicPlatform "C:\Program Files\nodejs\npm.cmd" start`
    - ตั้งค่า AppDirectory: `nssm set ThaiMusicPlatform AppDirectory "C:\inetpub\thai-music-platform"`
    - ตั้งค่า Environment: `nssm set ThaiMusicPlatform AppEnvironmentExtra NODE_ENV=production`
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [ ] 7.3 กำหนดค่า Service logging
    - ตั้งค่า stdout log: `nssm set ThaiMusicPlatform AppStdout "C:\logs\thai-music-platform\service-output.log"`
    - ตั้งค่า stderr log: `nssm set ThaiMusicPlatform AppStderr "C:\logs\thai-music-platform\service-error.log"`
    - _Requirements: 8.8, 15.1_
  
  - [ ] 7.4 กำหนดค่า auto-restart
    - ตั้งค่า restart on failure: `nssm set ThaiMusicPlatform AppExit Default Restart`
    - ตั้งค่า restart delay: `nssm set ThaiMusicPlatform AppRestartDelay 5000`
    - _Requirements: 8.6_
  
  - [ ] 7.5 ตั้งค่า Startup Type เป็น Automatic
    - รันคำสั่ง: `nssm set ThaiMusicPlatform Start SERVICE_AUTO_START`
    - _Requirements: 8.3, 8.5_
  
  - [ ] 7.6 Start Service และตรวจสอบ
    - รันคำสั่ง: `nssm start ThaiMusicPlatform`
    - ตรวจสอบ service status: `nssm status ThaiMusicPlatform`
    - เปิด services.msc และตรวจสอบว่า service รันอยู่
    - _Requirements: 8.5_

- [ ] 8. กำหนดค่า Windows Firewall
  - [ ] 8.1 เปิด port 3000 สำหรับ HTTP
    - เปิด Windows Defender Firewall with Advanced Security
    - สร้าง Inbound Rule สำหรับ port 3000 (TCP)
    - ตั้งชื่อ rule: "Thai Music Platform HTTP"
    - _Requirements: 4.1_
  
  - [ ] 8.2 กำหนดค่า outbound rules สำหรับ email
    - ตรวจสอบว่า outbound connections บน port 587 และ 465 ไม่ถูก block
    - _Requirements: 4.5_
  
  - [ ] 8.3 ตรวจสอบว่า MongoDB port ไม่เปิดให้ external access
    - ตรวจสอบว่าไม่มี inbound rule สำหรับ port 27017
    - ตรวจสอบว่า MongoDB bind เฉพาะ 127.0.0.1
    - _Requirements: 4.6_


- [ ] 9. ตั้งค่า Backup Scripts
  - [ ] 9.1 สร้าง MongoDB backup script
    - สร้างไฟล์ `C:\scripts\backup-mongodb.bat`
    - เขียน script สำหรับรัน mongodump และบันทึกไปยัง backup directory
    - ทดสอบรัน script manually
    - _Requirements: 14.1_
  
  - [ ] 9.2 สร้าง Uploads backup script
    - สร้างไฟล์ `C:\scripts\backup-uploads.bat`
    - เขียน script สำหรับ copy uploads directory ไปยัง backup directory
    - ทดสอบรัน script manually
    - _Requirements: 14.2_
  
  - [ ] 9.3 ตั้งค่า Windows Task Scheduler สำหรับ daily backups
    - เปิด Task Scheduler
    - สร้าง task สำหรับรัน backup-mongodb.bat ทุกวันเวลา 02:00
    - สร้าง task สำหรับรัน backup-uploads.bat ทุกวันเวลา 03:00
    - ทดสอบรัน tasks manually
    - _Requirements: 14.1, 14.2_
  
  - [ ] 9.4 ทดสอบการ restore จาก backup
    - ทดสอบ restore MongoDB จาก backup ด้วย mongorestore
    - ทดสอบ restore uploads directory จาก backup
    - บันทึกขั้นตอนการ restore ไว้ในเอกสาร
    - _Requirements: 14.4, 14.6_

- [ ] 10. ทดสอบระบบทั้งหมด
  - [ ] 10.1 ทดสอบการเข้าถึง application
    - เปิด browser และเข้า http://<server-ip>:3000
    - ตรวจสอบว่าหน้า home page แสดงถูกต้อง
    - _Requirements: 12.1_
  
  - [ ] 10.2 ทดสอบการ login
    - ทดสอบ login ด้วย admin account
    - ตรวจสอบว่า authentication ทำงานถูกต้อง
    - _Requirements: 12.2_
  
  - [ ] 10.3 ทดสอบการอัปโหลดไฟล์
    - ทดสอบอัปโหลดรูปภาพ
    - ตรวจสอบว่าไฟล์ถูกบันทึกใน uploads directory
    - ตรวจสอบว่าสามารถเข้าถึงไฟล์ผ่าน URL ได้
    - _Requirements: 12.3, 7.7_
  
  - [ ] 10.4 ทดสอบการส่ง email
    - ทดสอบส่ง email notification
    - ตรวจสอบว่า email ถูกส่งผ่าน Gmail SMTP สำเร็จ
    - _Requirements: 12.4_
  
  - [ ] 10.5 ทดสอบการ restart server
    - Restart Windows Server
    - ตรวจสอบว่า MongoDB Service เริ่มทำงานอัตโนมัติ
    - ตรวจสอบว่า Application Service เริ่มทำงานอัตโนมัติ
    - ตรวจสอบว่า application เข้าถึงได้หลัง restart
    - _Requirements: 12.6_
  
  - [ ] 10.6 ตรวจสอบ logs
    - ตรวจสอบ service-output.log และ service-error.log
    - ตรวจสอบว่าไม่มี critical errors
    - _Requirements: 12.7_


- [ ] 11. สร้างเอกสารคู่มือการติดตั้งเป็นภาษาไทย
  - [ ] 11.1 สร้างเอกสาร Pre-Installation Checklist
    - รายการ system requirements
    - รายการ software ที่ต้องดาวน์โหลด พร้อม download links
    - รายการข้อมูลที่ต้องเตรียม (passwords, email credentials)
    - _Requirements: 13.2, 13.4_
  
  - [ ] 11.2 สร้างเอกสารคู่มือการติดตั้งแบบละเอียด
    - ขั้นตอนการติดตั้ง Node.js
    - ขั้นตอนการติดตั้ง MongoDB
    - ขั้นตอนการตั้งค่า Environment Variables
    - ขั้นตอนการ deploy application
    - ขั้นตอนการสร้าง Windows Service
    - ขั้นตอนการกำหนดค่า Firewall
    - ขั้นตอนการตั้งค่า Backup
    - รวมตัวอย่างคำสั่งและ configuration files
    - _Requirements: 13.1, 13.5_
  
  - [ ] 11.3 สร้างเอกสาร Post-Installation Checklist
    - รายการตรวจสอบหลังการติดตั้ง
    - ขั้นตอนการทดสอบระบบ
    - _Requirements: 13.3_
  
  - [ ] 11.4 สร้างเอกสาร Troubleshooting Guide
    - ปัญหาที่พบบ่อยและวิธีแก้ไข
    - วิธีตรวจสอบ logs
    - วิธีการ restart services
    - ข้อมูลการติดต่อสำหรับขอความช่วยเหลือ
    - _Requirements: 13.6, 13.7_
  
  - [ ] 11.5 สร้างเอกสาร Backup and Recovery Guide
    - ขั้นตอนการ backup MongoDB
    - ขั้นตอนการ backup uploads
    - ขั้นตอนการ restore จาก backup
    - แผนการ backup และ retention policy
    - _Requirements: 14.3, 14.5, 14.6_
  
  - [ ] 11.6 สร้างเอกสาร Maintenance and Update Guide
    - แผนการ update Node.js, MongoDB, และ Application
    - ขั้นตอนการ update แบบปลอดภัย
    - แผนการ maintenance window
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_

- [ ]* 12. (Optional) ติดตั้ง Mongo Express
  - [ ]* 12.1 ติดตั้ง Mongo Express globally
    - รันคำสั่ง: `npm install -g mongo-express`
    - _Requirements: 10.1_
  
  - [ ]* 12.2 สร้าง configuration file สำหรับ Mongo Express
    - สร้างไฟล์ config.js
    - กำหนดค่า MongoDB connection
    - กำหนดค่า basic authentication
    - กำหนดค่า port 8081
    - _Requirements: 10.2, 10.3_
  
  - [ ]* 12.3 สร้าง Windows Service สำหรับ Mongo Express
    - รันคำสั่ง: `nssm install MongoExpress "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\mongo-express\app.js"`
    - ตั้งค่า AppDirectory และ Environment Variables
    - Start service
    - _Requirements: 10.5_
  
  - [ ]* 12.4 เปิด port 8081 สำหรับ internal network
    - สร้าง Inbound Rule สำหรับ port 8081
    - จำกัดการเข้าถึงเฉพาะ internal network IP range
    - _Requirements: 4.4, 10.4_
  
  - [ ]* 12.5 ทดสอบ Mongo Express
    - เปิด browser และเข้า http://localhost:8081
    - ทดสอบ login ด้วย basic authentication
    - ตรวจสอบว่าเชื่อมต่อ MongoDB ได้
    - _Requirements: 10.2_

- [ ] 13. Checkpoint สุดท้าย - ตรวจสอบความพร้อมของระบบ
  - ตรวจสอบว่า Node.js และ MongoDB ติดตั้งและทำงานถูกต้อง
  - ตรวจสอบว่า Application Service รันอยู่และเข้าถึงได้
  - ตรวจสอบว่า Firewall rules ถูกตั้งค่าถูกต้อง
  - ตรวจสอบว่า Backup scripts ทำงานถูกต้อง
  - ตรวจสอบว่าเอกสารคู่มือครบถ้วน
  - ถามผู้ใช้ว่ามีคำถามหรือต้องการความช่วยเหลือเพิ่มเติมหรือไม่

## หมายเหตุ

- Tasks ที่มีเครื่องหมาย `*` เป็น optional tasks สามารถข้ามได้หากต้องการติดตั้งแบบ minimal
- แต่ละ task มีการอ้างอิง requirements เพื่อความชัดเจนในการตรวจสอบ
- Checkpoint tasks ช่วยให้มั่นใจว่าแต่ละขั้นตอนทำงานถูกต้องก่อนดำเนินการต่อ
- เอกสารทั้งหมดควรเขียนเป็นภาษาไทยเพื่อให้ Admin เข้าใจง่าย
- ควรทดสอบทุกขั้นตอนบน test environment ก่อนนำไปใช้บน production
