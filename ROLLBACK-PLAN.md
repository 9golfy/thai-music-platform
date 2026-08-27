# 🔄 Rollback Plan - Thai Music Platform
## แผนย้อนกลับเมื่อ Deploy แล้วเจอปัญหา

**Server:** root@041034-U (dcpschool100.net)  
**Project Path:** `/var/www/thai-music-platform`  
**PM2 App Name:** `thai-music-platform`

---

## 📋 สารบัญ

1. [ก่อน Deploy - เตรียมความพร้อม](#1-ก่อน-deploy---เตรียมความพร้อม)
2. [ขั้นตอน Deploy](#2-ขั้นตอน-deploy)
3. [ตรวจสอบหลัง Deploy](#3-ตรวจสอบหลัง-deploy)
4. [Rollback แบบฉุกเฉิน (Emergency)](#4-rollback-แบบฉุกเฉิน-emergency)
5. [Rollback แบบปลอดภัย (Safe)](#5-rollback-แบบปลอดภัย-safe)
6. [Rollback แบบ Hard Reset](#6-rollback-แบบ-hard-reset)
7. [ตรวจสอบหลัง Rollback](#7-ตรวจสอบหลัง-rollback)
8. [สถานการณ์และวิธีแก้](#8-สถานการณ์และวิธีแก้)

---

## 1. ก่อน Deploy - เตรียมความพร้อม

### 📝 Checklist ก่อน Deploy

```bash
# SSH เข้า production server
ssh root@041034-U

# ไปที่ directory ของ project
cd /var/www/thai-music-platform

# ✅ 1. บันทึก commit ปัจจุบัน
git rev-parse HEAD > ~/backup-commit-$(date +%Y%m%d-%H%M%S).txt
git log -1 > ~/backup-commit-detail-$(date +%Y%m%d-%H%M%S).txt

# แสดง commit ปัจจุบัน
echo "=== Current Commit ==="
git log -1 --oneline
git rev-parse HEAD

# ✅ 2. Backup database
mongodump --uri="mongodb://localhost:27017/thai_music_school" \
  --out=/backup/db-$(date +%Y%m%d-%H%M%S)

# ✅ 3. Backup .env files
cp .env.production .env.production.backup-$(date +%Y%m%d-%H%M%S)
cp .env.local .env.local.backup-$(date +%Y%m%d-%H%M%S)

# ✅ 4. Backup node_modules (optional)
tar -czf ~/node_modules-backup-$(date +%Y%m%d-%H%M%S).tar.gz node_modules/

# ✅ 5. สร้าง backup branch
git branch backup-before-deploy-$(date +%Y%m%d-%H%M%S)

# ✅ 6. ตรวจสอบสถานะปัจจุบัน
pm2 status
pm2 logs thai-music-platform --lines 20
```

### 📄 บันทึกข้อมูลสำคัญ

สร้างไฟล์ `~/deployment-info.txt`:

```bash
cat > ~/deployment-info-$(date +%Y%m%d-%H%M%S).txt << EOF
=== Deployment Information ===
Date: $(date)
Current Commit: $(git rev-parse HEAD)
Current Branch: $(git branch --show-current)
PM2 Status: $(pm2 jlist)
Node Version: $(node --version)
NPM Version: $(npm --version)

=== Last 5 Commits ===
$(git log -5 --oneline)

=== Modified Files ===
$(git status)
EOF
```

---

## 2. ขั้นตอน Deploy

```bash
# 1. Pull code ใหม่
git pull origin main

# 2. แสดง commit ใหม่
echo "=== New Commit ==="
git log -1 --oneline

# 3. Install dependencies
npm install

# 4. Build
npm run build

# 5. Restart PM2
pm2 restart thai-music-platform

# 6. Save PM2 config
pm2 save
```

---

## 3. ตรวจสอบหลัง Deploy

### ✅ Checklist หลัง Deploy

```bash
# 1. ตรวจสอบ PM2 status
pm2 status

# 2. ดู logs (ต้องไม่มี error)
pm2 logs thai-music-platform --lines 50

# 3. ทดสอบ health check
curl http://localhost:3000/api/health

# 4. ทดสอบหน้าหลัก
curl -I https://dcpschool100.net/

# 5. ทดสอบ admin dashboard
curl -I https://dcpschool100.net/dcp-admin/dashboard

# 6. ทดสอบ Token Management
curl -I https://dcpschool100.net/dcp-admin/dashboard/drafts

# 7. ตรวจสอบ database connection
node scripts/check-database-connection.js
```

### 🚨 สัญญาณเตือนที่ต้อง Rollback

- ❌ PM2 status แสดง `errored` หรือ `stopped`
- ❌ Logs แสดง error ซ้ำๆ
- ❌ Website แสดง 502 Bad Gateway
- ❌ Website แสดง 500 Internal Server Error
- ❌ API ไม่ตอบกลับ (timeout)
- ❌ Database connection error
- ❌ Build failed
- ❌ ฟีเจอร์สำคัญใช้งานไม่ได้

---

## 4. Rollback แบบฉุกเฉิน (Emergency)

**ใช้เมื่อ:** Website down หรือ error ร้ายแรง ต้องแก้ไขทันที

### ⚡ ขั้นตอนฉุกเฉิน (5 นาที)

```bash
# 1. หยุด server ทันที
pm2 stop thai-music-platform

# 2. อ่าน commit เก่าจากไฟล์ backup
OLD_COMMIT=$(cat ~/backup-commit-*.txt | tail -1)
echo "Rolling back to: $OLD_COMMIT"

# 3. Hard reset ไปยัง commit เก่า
git reset --hard $OLD_COMMIT

# 4. ลบ node_modules และ .next
rm -rf node_modules .next

# 5. Install dependencies
npm install

# 6. Build
npm run build

# 7. Start server
pm2 start thai-music-platform

# 8. ตรวจสอบทันที
pm2 logs thai-music-platform --lines 50
curl http://localhost:3000/api/health
```

### 🔍 ตรวจสอบว่า Rollback สำเร็จ

```bash
# ตรวจสอบ commit ปัจจุบัน
git log -1

# ตรวจสอบ PM2
pm2 status

# ทดสอบ website
curl -I https://dcpschool100.net/
```

---

## 5. Rollback แบบปลอดภัย (Safe)

**ใช้เมื่อ:** มีเวลาพอ ต้องการเก็บ history ไว้

### ✅ ขั้นตอนแบบปลอดภัย (10 นาที)

```bash
# 1. ดู commits ที่ต้องการ revert
git log -10 --oneline

# 2. Revert commit ล่าสุด (สร้าง commit ใหม่)
git revert HEAD --no-edit

# หรือ revert หลาย commits
# git revert HEAD~3..HEAD --no-edit

# 3. Push ขึ้น remote
git push origin main

# 4. ลบ build เก่า
rm -rf .next

# 5. Install dependencies (ถ้าจำเป็น)
npm install

# 6. Build ใหม่
npm run build

# 7. Restart PM2
pm2 restart thai-music-platform

# 8. ตรวจสอบ
pm2 logs thai-music-platform --lines 50
```

### ข้อดี
- ✅ ไม่ลบ history
- ✅ ปลอดภัย สามารถ track ได้
- ✅ ทีมอื่นๆ ไม่มีปัญหาเมื่อ pull

### ข้อเสีย
- ❌ สร้าง commit ใหม่ (history ยาวขึ้น)

---

## 6. Rollback แบบ Hard Reset

**ใช้เมื่อ:** ต้องการลบ commits ที่มีปัญหาออกจาก history

### ⚠️ ขั้นตอนแบบ Hard Reset (ระวัง!)

```bash
# 1. Backup branch ปัจจุบันก่อน (สำคัญ!)
git branch backup-failed-deploy-$(date +%Y%m%d-%H%M%S)

# 2. ดู commit ที่ต้องการย้อนกลับไป
git log -10 --oneline

# 3. Hard reset ไปยัง commit ที่ต้องการ
# ตัวอย่าง: ย้อนกลับ 1 commit
git reset --hard HEAD~1

# หรือ ย้อนกลับไปยัง commit ที่ระบุ
# git reset --hard abc123def

# 4. Force push (ระวัง!)
git push origin main --force

# 5. ลบ build เก่า
rm -rf node_modules .next

# 6. Install dependencies
npm install

# 7. Build
npm run build

# 8. Restart PM2
pm2 restart thai-music-platform

# 9. ตรวจสอบ
pm2 logs thai-music-platform --lines 50
```

### ข้อดี
- ✅ History สะอาด
- ✅ ย้อนกลับได้เร็ว

### ข้อเสีย
- ❌ ลบ history (อันตราย!)
- ❌ ถ้าคนอื่น pull ไปแล้วจะเกิดปัญหา
- ❌ ต้องใช้ `--force` push

---

## 7. ตรวจสอบหลัง Rollback

### ✅ Checklist หลัง Rollback

```bash
# 1. ตรวจสอบ commit ปัจจุบัน
echo "=== Current Commit After Rollback ==="
git log -1 --oneline
git rev-parse HEAD

# 2. ตรวจสอบ PM2 status
pm2 status

# 3. ดู logs (ต้องไม่มี error)
pm2 logs thai-music-platform --lines 100

# 4. ทดสอบ health check
curl http://localhost:3000/api/health

# 5. ทดสอบหน้าหลัก
curl -I https://dcpschool100.net/

# 6. ทดสอบ admin dashboard
curl -I https://dcpschool100.net/dcp-admin/dashboard

# 7. ทดสอบฟีเจอร์สำคัญ
# - Login
# - Register
# - Draft save
# - Admin functions

# 8. ตรวจสอบ database
mongosh "mongodb://localhost:27017/thai_music_school" \
  --eval "db.draft_submissions.countDocuments()"

# 9. Monitor logs เป็นเวลา 5-10 นาที
pm2 logs thai-music-platform
```

### 📊 ตรวจสอบ Performance

```bash
# CPU และ Memory usage
pm2 monit

# Response time
time curl https://dcpschool100.net/

# Database connection
node scripts/check-database-connection.js
```

---

## 8. สถานการณ์และวิธีแก้

### 🔴 สถานการณ์ที่ 1: Website แสดง 502 Bad Gateway

**สาเหตุ:** Next.js app crash หรือไม่ได้ start

**วิธีแก้:**
```bash
# 1. ตรวจสอบ PM2
pm2 status

# 2. ดู logs
pm2 logs thai-music-platform --lines 100

# 3. ถ้า app stopped หรือ errored
pm2 restart thai-music-platform

# 4. ถ้ายังไม่ได้ ให้ rollback
# ใช้วิธี Emergency Rollback (ข้อ 4)
```

---

### 🔴 สถานการณ์ที่ 2: Build Failed

**สาเหตุ:** Dependencies ขาดหาย หรือ code error

**วิธีแก้:**
```bash
# 1. ดู error message
npm run build

# 2. ลองลบและ install ใหม่
rm -rf node_modules package-lock.json .next
npm install
npm run build

# 3. ถ้ายังไม่ได้ ให้ rollback
git reset --hard HEAD~1
npm install
npm run build
pm2 restart thai-music-platform
```

---

### 🔴 สถานการณ์ที่ 3: Database Connection Error

**สาเหตุ:** MongoDB ไม่ทำงาน หรือ connection string ผิด

**วิธีแก้:**
```bash
# 1. ตรวจสอบ MongoDB
systemctl status mongod

# 2. ถ้า MongoDB stopped
sudo systemctl start mongod

# 3. ตรวจสอบ connection string
cat .env.production | grep MONGODB_URI

# 4. ทดสอบ connection
mongosh "mongodb://localhost:27017/thai_music_school"

# 5. Restart app
pm2 restart thai-music-platform
```

---

### 🔴 สถานการณ์ที่ 4: API ไม่ตอบกลับ (Timeout)

**สาเหตุ:** Server overload หรือ infinite loop

**วิธีแก้:**
```bash
# 1. ตรวจสอบ CPU/Memory
pm2 monit

# 2. ดู logs
pm2 logs thai-music-platform --lines 200

# 3. Restart app
pm2 restart thai-music-platform

# 4. ถ้ายังไม่ได้ ให้ rollback ทันที
# ใช้วิธี Emergency Rollback (ข้อ 4)
```

---

### 🔴 สถานการณ์ที่ 5: ฟีเจอร์ใหม่ไม่ทำงาน

**สาเหตุ:** Code bug หรือ missing dependencies

**วิธีแก้:**
```bash
# 1. ตรวจสอบ logs
pm2 logs thai-music-platform --lines 100

# 2. ตรวจสอบ browser console (F12)

# 3. ถ้าเป็น bug เล็กน้อย อาจแก้ไขได้ทันที
# แก้ไข code → git commit → git push → deploy

# 4. ถ้าเป็น bug ร้ายแรง ให้ rollback
# ใช้วิธี Safe Rollback (ข้อ 5)
```

---

### 🔴 สถานการณ์ที่ 6: Token Management ไม่ทำงาน

**สาเหตุ:** API endpoint error หรือ database issue

**วิธีแก้:**
```bash
# 1. ทดสอบ API
curl http://localhost:3000/api/admin/drafts

# 2. ตรวจสอบ database
mongosh "mongodb://localhost:27017/thai_music_school" \
  --eval "db.draft_submissions.findOne()"

# 3. ดู logs
pm2 logs thai-music-platform | grep "admin/drafts"

# 4. ถ้าแก้ไม่ได้ ให้ rollback
# ใช้วิธี Safe Rollback (ข้อ 5)
```

---

## 📝 คำสั่งสำคัญ (Quick Reference)

### ดู Commit ปัจจุบัน
```bash
git rev-parse HEAD
git log -1 --oneline
```

### ดู History
```bash
git log -10 --oneline
git log --graph --oneline --all -10
```

### Rollback ฉุกเฉิน (1 คำสั่ง)
```bash
git reset --hard HEAD~1 && npm install && npm run build && pm2 restart thai-music-platform
```

### Rollback ปลอดภัย (1 คำสั่ง)
```bash
git revert HEAD --no-edit && git push origin main && npm run build && pm2 restart thai-music-platform
```

### ตรวจสอบสถานะ
```bash
pm2 status && pm2 logs thai-music-platform --lines 20
```

### ทดสอบ Website
```bash
curl -I https://dcpschool100.net/ && curl http://localhost:3000/api/health
```

---

## 🎯 Decision Tree - เลือกวิธี Rollback

```
เจอปัญหาหลัง Deploy?
│
├─ Website Down / Error ร้ายแรง?
│  └─ YES → ใช้ Emergency Rollback (ข้อ 4) ⚡
│
├─ มีเวลาพอ / ต้องการเก็บ History?
│  └─ YES → ใช้ Safe Rollback (ข้อ 5) ✅
│
├─ ต้องการลบ Commits ที่มีปัญหา?
│  └─ YES → ใช้ Hard Reset (ข้อ 6) ⚠️
│
└─ Bug เล็กน้อย / แก้ไขได้ทันที?
   └─ YES → แก้ไข Code → Deploy ใหม่
```

---

## 📞 Contact & Support

### ถ้าเจอปัญหาที่แก้ไม่ได้

1. **หยุด Server ทันที:** `pm2 stop thai-music-platform`
2. **Rollback ไปยัง version ที่ stable**
3. **บันทึก logs:** `pm2 logs thai-music-platform > ~/error-logs.txt`
4. **ติดต่อทีม Dev** พร้อม logs และ error messages

### ข้อมูลที่ควรส่งให้ทีม Dev

- Current commit hash: `git rev-parse HEAD`
- Error logs: `pm2 logs thai-music-platform --lines 200`
- PM2 status: `pm2 status`
- System info: `uname -a`, `node --version`, `npm --version`
- Database status: `systemctl status mongod`

---

## ✅ Best Practices

### ก่อน Deploy
- ✅ Backup commit hash
- ✅ Backup database
- ✅ Backup .env files
- ✅ สร้าง backup branch
- ✅ ทดสอบบน staging ก่อน (ถ้ามี)

### ระหว่าง Deploy
- ✅ Deploy ในช่วงเวลาที่ traffic น้อย
- ✅ แจ้งทีมก่อน deploy
- ✅ Monitor logs ตลอดเวลา

### หลัง Deploy
- ✅ ทดสอบฟีเจอร์สำคัญทันที
- ✅ Monitor logs อย่างน้อย 10-15 นาที
- ✅ ตรวจสอบ error rate
- ✅ เก็บ deployment logs

### เมื่อต้อง Rollback
- ✅ แจ้งทีมทันที
- ✅ บันทึก error logs
- ✅ วิเคราะห์สาเหตุ
- ✅ แก้ไขและทดสอบก่อน deploy ใหม่

---

## 🎓 สรุป

### วิธี Rollback ทั้ง 3 แบบ

| วิธี | ความเร็ว | ความปลอดภัย | เก็บ History | ใช้เมื่อ |
|------|---------|------------|-------------|---------|
| **Emergency** | ⚡ เร็วที่สุด (5 นาที) | ⚠️ ปานกลาง | ❌ ไม่เก็บ | Website down |
| **Safe Rollback** | 🐢 ปานกลาง (10 นาที) | ✅ ปลอดภัยที่สุด | ✅ เก็บ | มีเวลาพอ |
| **Hard Reset** | ⚡ เร็ว (7 นาที) | ❌ อันตราย | ❌ ลบ commits | ต้องการ clean history |

### คำแนะนำ

1. **ใช้ Safe Rollback เป็นหลัก** (git revert) - ปลอดภัยที่สุด
2. **Backup ก่อนเสมอ** - commit hash, database, .env
3. **ทดสอบบน staging ก่อน** - ลด risk
4. **Monitor logs หลัง deploy** - จับปัญหาได้เร็ว
5. **มี rollback plan พร้อมเสมอ** - ลดเวลาแก้ไข

---

**วันที่สร้าง:** 29 พฤษภาคม 2026  
**Version:** 1.0  
**สถานะ:** ✅ พร้อมใช้งาน

