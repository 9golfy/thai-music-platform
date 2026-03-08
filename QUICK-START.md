# 🚀 Quick Start Guide

คู่มือเริ่มต้นใช้งานระบบโรงเรียนดนตรีไทย

## ⚡ เริ่มต้นแบบเร็ว (5 นาที)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# แก้ไขค่าพื้นฐาน (ถ้าต้องการ)
# - MONGO_ROOT_PASSWORD (default: rootpass)
# - JWT_SECRET (generate ใหม่ด้วย: openssl rand -base64 32)
```

### 3. เริ่ม MongoDB
```bash
npm run docker:up
```

### 4. Setup Database
```bash
npm run db:setup
```

### 5. เริ่มแอพ
```bash
npm run dev
```

### 6. เข้าสู่ระบบ
เปิดเบราว์เซอร์ที่: http://localhost:3000/dcp-admin

**Root User:**
- Email: `root@thaimusic.com`
- Password: `admin123`

---

## 📋 Checklist หลังติดตั้ง

### ✅ ขั้นตอนที่ 1: ตรวจสอบระบบ
- [ ] MongoDB ทำงานปกติ (`docker ps`)
- [ ] เข้าสู่ระบบ Admin ได้
- [ ] Dashboard แสดงผลถูกต้อง

### ✅ ขั้นตอนที่ 2: เปลี่ยนรหัสผ่าน Root
1. Login เป็น Root
2. ไปที่ User Management
3. แก้ไขข้อมูล Root user
4. เปลี่ยนรหัสผ่านเป็นรหัสที่ปลอดภัย

### ✅ ขั้นตอนที่ 3: สร้าง Admin User
1. Login เป็น Root
2. ไปที่ User Management → เพิ่มผู้ใช้งาน
3. สร้าง Admin user อย่างน้อย 1 คน
4. ทดสอบ Login ด้วย Admin user

### ✅ ขั้นตอนที่ 4: ตั้งค่า Email (ถ้าต้องการ Password Recovery)
1. ไปที่ Google Account Settings
2. เปิด 2-Step Verification
3. สร้าง App Password
4. เพิ่มใน `.env`:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ```
5. Restart แอพ

### ✅ ขั้นตอนที่ 5: ทดสอบ Teacher Portal
1. สร้าง Teacher user (ต้องมี School ID)
2. ทดสอบ Login ที่ `/teacher-login`
3. ตรวจสอบว่าไม่เห็นคะแนน

---

## 🎯 การใช้งานพื้นฐาน

### สำหรับ Admin

#### ดู Dashboard
```
URL: /dcp-admin/dashboard
- ดูสถิติรวม
- ดูรายการโรงเรียนล่าสุด
```

#### จัดการโรงเรียน
```
URL: /dcp-admin/dashboard/register100
URL: /dcp-admin/dashboard/register-support
- ดูรายการโรงเรียนทั้งหมด
- คลิกดูรายละเอียด
- ลบโรงเรียน
```

#### จัดการ Users
```
URL: /dcp-admin/dashboard/users
- ดูรายชื่อ Admin และ Teacher
- สร้าง User ใหม่ (Root only)
- Reset password
```

#### จัดการใบประกาศ
```
URL: /dcp-admin/dashboard/certificates
- ดูรายการใบประกาศ
- สร้างใบประกาศใหม่
- ลบใบประกาศ
```

### สำหรับ Teacher

#### Login
```
URL: /teacher-login
ต้องใส่:
- Email
- Password (6 หลัก)
- School ID (SCH-YYYYMMDD-XXXX)
```

#### ดูข้อมูลโรงเรียน
```
URL: /teacher/dashboard
- ดูข้อมูลทั้ง 8 steps
- ไม่เห็นคะแนน
```

#### ดูใบประกาศ
```
URL: /teacher/certificate
- ดูใบประกาศที่ได้รับ
- Download (ถ้ามี)
```

---

## 🔧 คำสั่งที่ใช้บ่อย

### Development
```bash
npm run dev              # เริ่ม dev server
npm run build            # Build production
npm start                # เริ่ม production server
```

### Docker
```bash
npm run docker:up        # เริ่ม MongoDB
npm run docker:down      # หยุด MongoDB
npm run docker:logs      # ดู logs
npm run docker:restart   # Restart services
```

### Database
```bash
npm run db:setup         # Setup database

# เข้า MongoDB shell
docker exec -it thai-music-mongo mongosh -u root -p rootpass

# Backup database
docker exec thai-music-mongo mongodump -u root -p rootpass --out /backup

# Restore database
docker exec thai-music-mongo mongorestore -u root -p rootpass /backup
```

---

## 🐛 แก้ปัญหาเบื้องต้น

### MongoDB ไม่ทำงาน
```bash
# ตรวจสอบ
docker ps

# Restart
npm run docker:restart

# ดู logs
npm run docker:logs
```

### Login ไม่ได้
```bash
# ตรวจสอบ Root user
docker exec -it thai-music-mongo mongosh -u root -p rootpass
use thai_music_school
db.users.findOne({ role: 'root' })

# Reset Root password
npm run db:setup
```

### Port 3000 ถูกใช้งาน
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Build Error
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

---

## 📚 เอกสารเพิ่มเติม

- [README.md](./README.md) - เอกสารหลัก
- [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) - คู่มือ Deploy
- [FINAL-SUMMARY.md](./FINAL-SUMMARY.md) - สรุปโปรเจค

---

## 🎉 เสร็จแล้ว!

ตอนนี้คุณพร้อมใช้งานระบบแล้ว 🚀

**Next Steps:**
1. เปลี่ยนรหัสผ่าน Root
2. สร้าง Admin users
3. ตั้งค่า Email service
4. เริ่มใช้งานจริง

**Need Help?**
- ดู [README.md](./README.md) สำหรับข้อมูลเพิ่มเติม
- ดู [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) สำหรับการ Deploy
- ตรวจสอบ logs: `npm run docker:logs`
