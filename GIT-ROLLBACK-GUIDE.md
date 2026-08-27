# 🔄 คู่มือ Git Rollback - ย้อนกลับเมื่อเจอปัญหา

## 📋 ขั้นตอนก่อน Deploy (สำคัญมาก!)

### 1. บันทึก Version ปัจจุบัน

```bash
# SSH เข้า production server
ssh root@041034-U

# ไปที่ directory ของ project
cd /path/to/thai-music-platform

# ดู commit ปัจจุบัน
git log -1

# หรือดูแบบสั้น
git rev-parse HEAD

# บันทึก output ที่ได้ เช่น:
# commit abc123def456... (HEAD -> main)
```

**Output ตัวอย่าง:**
```
commit 7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t
Author: Your Name <your.email@example.com>
Date:   Thu May 29 18:30:00 2026 +0700

    Add Token Management feature
```

**บันทึก commit hash นี้:** `7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t`

---

## 🔍 คำสั่งเช็ค Version

### 1. ดู Commit ปัจจุบัน

```bash
# แบบสั้น (แสดง 7 ตัวอักษรแรก)
git rev-parse --short HEAD

# แบบเต็ม (แสดงทั้งหมด)
git rev-parse HEAD

# ดูพร้อมข้อความ
git log -1 --oneline
```

### 2. ดู History ย้อนหลัง

```bash
# ดู 10 commits ล่าสุด
git log -10 --oneline

# ดูแบบละเอียด
git log -5 --pretty=format:"%h - %an, %ar : %s"

# ดูแบบ graph
git log --oneline --graph --all -10
```

**Output ตัวอย่าง:**
```
7a8b9c0 (HEAD -> main) Add Token Management feature
6f5e4d3 Fix score editing issue
5d4c3b2 Add admin notes feature
4c3b2a1 Update dashboard layout
3b2a190 Fix draft token expiry
```

### 3. ดูความแตกต่างระหว่าง Commits

```bash
# เปรียบเทียบ 2 commits
git diff abc123..def456

# ดูไฟล์ที่เปลี่ยนแปลง
git diff --name-only abc123..def456

# ดูจำนวนบรรทัดที่เปลี่ยน
git diff --stat abc123..def456
```

---

## 🔙 วิธี Rollback

### วิธีที่ 1: Rollback แบบปลอดภัย (แนะนำ)

```bash
# 1. ดู commit ที่ต้องการย้อนกลับไป
git log -10 --oneline

# 2. Rollback ไปยัง commit ที่ต้องการ (ไม่ลบ history)
git revert HEAD --no-edit

# หรือ revert หลาย commits
git revert HEAD~3..HEAD --no-edit

# 3. Push ขึ้น remote
git push origin main

# 4. Rebuild และ restart
npm run build
pm2 restart thai-music-platform
```

**ข้อดี:**
- ✅ ไม่ลบ history
- ✅ ปลอดภัย
- ✅ สามารถ track ได้ว่าเคย rollback

**ข้อเสีย:**
- ❌ สร้าง commit ใหม่ (history ยาวขึ้น)

---

### วิธีที่ 2: Rollback แบบ Hard Reset (ระวัง!)

```bash
# 1. ดู commit ที่ต้องการย้อนกลับไป
git log -10 --oneline

# 2. Backup branch ปัจจุบันก่อน (สำคัญ!)
git branch backup-$(date +%Y%m%d-%H%M%S)

# 3. Reset ไปยัง commit ที่ต้องการ
git reset --hard abc123def

# 4. Force push (ระวัง!)
git push origin main --force

# 5. Rebuild และ restart
npm run build
pm2 restart thai-music-platform
```

**ข้อดี:**
- ✅ History สะอาด
- ✅ ย้อนกลับได้เร็ว

**ข้อเสีย:**
- ❌ ลบ history (อันตราย!)
- ❌ ถ้าคนอื่น pull ไปแล้วจะเกิดปัญหา

---

### วิธีที่ 3: Rollback ชั่วคราว (ทดสอบก่อน)

```bash
# 1. Checkout ไปยัง commit เก่า (ไม่แก้ไข branch)
git checkout abc123def

# 2. ทดสอบว่าทำงานได้หรือไม่
npm run build
pm2 restart thai-music-platform

# 3. ถ้าใช้ได้ ให้สร้าง branch ใหม่
git checkout -b rollback-temp
git push origin rollback-temp

# 4. กลับไปที่ main
git checkout main

# 5. Merge rollback-temp เข้า main
git merge rollback-temp
git push origin main
```

---

## 📝 ขั้นตอนแบบละเอียด (Step-by-Step)

### ก่อน Deploy

```bash
# 1. SSH เข้า server
ssh root@041034-U

# 2. ไปที่ directory
cd /path/to/thai-music-platform

# 3. บันทึก commit ปัจจุบัน
git log -1 > ~/backup-commit-$(date +%Y%m%d).txt
git rev-parse HEAD > ~/current-commit.txt

# 4. ดู commit hash
cat ~/current-commit.txt
# Output: 7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t

# 5. บันทึกไว้ในโน้ต หรือส่งให้ตัวเอง
echo "Current commit: $(git rev-parse HEAD)" | mail -s "Backup Commit" your@email.com
```

### Deploy

```bash
# 1. Pull code ใหม่
git pull origin main

# 2. ดู commit ใหม่
git log -1

# 3. Build
npm run build

# 4. Restart
pm2 restart thai-music-platform

# 5. ทดสอบ
curl http://localhost:3000/api/health
```

### ถ้าเจอปัญหา - Rollback

```bash
# 1. อ่าน commit เก่าจากไฟล์
OLD_COMMIT=$(cat ~/current-commit.txt)
echo "Rolling back to: $OLD_COMMIT"

# 2. Rollback (เลือกวิธีที่ 1 หรือ 2)

# วิธีที่ 1: Revert (ปลอดภัย)
git revert HEAD --no-edit
git push origin main

# วิธีที่ 2: Hard Reset (ระวัง!)
git reset --hard $OLD_COMMIT
git push origin main --force

# 3. Rebuild
npm run build

# 4. Restart
pm2 restart thai-music-platform

# 5. ตรวจสอบ
git log -1
pm2 logs thai-music-platform
```

---

## 🛡️ Best Practices

### 1. ใช้ Git Tags สำหรับ Production

```bash
# ก่อน deploy ให้ tag version
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0

# ดู tags ทั้งหมด
git tag -l

# Rollback ไปยัง tag
git checkout v1.0.0
```

### 2. ใช้ Branches สำหรับ Production

```bash
# สร้าง production branch
git checkout -b production
git push origin production

# Deploy จาก production branch
git checkout production
git merge main
git push origin production

# Rollback
git checkout production
git reset --hard v1.0.0
git push origin production --force
```

### 3. Backup ก่อน Deploy

```bash
# Backup code
tar -czf ~/backup-$(date +%Y%m%d-%H%M%S).tar.gz /path/to/thai-music-platform

# Backup database
mongodump --uri="mongodb://..." --out=/backup/db-$(date +%Y%m%d)

# Backup .env
cp .env .env.backup-$(date +%Y%m%d)
```

---

## 🚨 Emergency Rollback (ฉุกเฉิน)

```bash
# 1. หยุด server ทันที
pm2 stop thai-music-platform

# 2. Rollback code
git reset --hard HEAD~1  # ย้อนกลับ 1 commit
# หรือ
git reset --hard abc123  # ย้อนกลับไปยัง commit ที่ระบุ

# 3. Rebuild
npm run build

# 4. Start server
pm2 start thai-music-platform

# 5. Monitor logs
pm2 logs thai-music-platform --lines 100
```

---

## 📊 ตรวจสอบหลัง Rollback

```bash
# 1. ตรวจสอบ commit ปัจจุบัน
git log -1

# 2. ตรวจสอบ server status
pm2 status

# 3. ตรวจสอบ logs
pm2 logs thai-music-platform --lines 50

# 4. ทดสอบ API
curl http://localhost:3000/api/health
curl http://localhost:3000/dcp-admin/dashboard

# 5. ตรวจสอบ database
mongosh "mongodb://..." --eval "db.draft_submissions.countDocuments()"
```

---

## 📝 Checklist

### ก่อน Deploy
- [ ] บันทึก commit hash ปัจจุบัน
- [ ] Backup database
- [ ] Backup code
- [ ] ทดสอบบน staging/dev ก่อน
- [ ] แจ้งทีมว่ากำลัง deploy

### หลัง Deploy
- [ ] ตรวจสอบ logs
- [ ] ทดสอบฟีเจอร์หลัก
- [ ] Monitor error rate
- [ ] ตรวจสอบ performance

### ถ้าเจอปัญหา
- [ ] หยุด server ทันที (ถ้าจำเป็น)
- [ ] Rollback code
- [ ] Rebuild
- [ ] Restart server
- [ ] ตรวจสอบว่ากลับมาทำงานปกติ
- [ ] วิเคราะห์สาเหตุ
- [ ] แก้ไขและทดสอบใหม่

---

## 🎯 สรุป

### คำสั่งสำคัญที่ต้องจำ

```bash
# ดู commit ปัจจุบัน
git rev-parse HEAD

# ดู history
git log -10 --oneline

# Rollback แบบปลอดภัย
git revert HEAD --no-edit

# Rollback แบบ hard (ระวัง!)
git reset --hard abc123
git push origin main --force

# Backup commit ปัจจุบัน
git rev-parse HEAD > ~/current-commit.txt
```

### แนะนำ

1. **ใช้ git revert** สำหรับ production (ปลอดภัยที่สุด)
2. **Backup ก่อนเสมอ** (code + database)
3. **ทดสอบบน staging ก่อน** deploy production
4. **Monitor logs** หลัง deploy
5. **มี rollback plan** พร้อมเสมอ

---

**สรุป:** ไม่ต้องจดเลข version ไว้ก่อน เพราะ Git เก็บ history ไว้ให้อยู่แล้ว แต่แนะนำให้ backup ไว้เผื่อไว้ครับ! 🚀
