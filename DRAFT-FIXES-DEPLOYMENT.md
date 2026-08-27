# 🔧 Draft Validation Fixes - Deployment Guide

## 📋 สรุปการแก้ไข

### **ปัญหาที่พบ**
1. ✅ **Database Configuration** - Code ดึง database name จาก URI อัตโนมัติแล้ว (ไม่ต้องแก้)
2. ✅ **CurrentStep Validation** - แก้ไขแล้ว: จำกัด currentStep ให้เป็น 1-7 เท่านั้น
3. ⚠️ **Draft ที่มี Step ผิดปกติ** - มี draft ที่ currentStep = 8 ใน database

### **ไฟล์ที่แก้ไข**
1. `app/api/draft/save/route.ts` - เพิ่ม validation: currentStep ต้องเป็น 1-7
2. `app/api/draft/[token]/route.ts` - เพิ่ม validation: currentStep ต้องเป็น 1-7

### **Scripts ใหม่**
1. `scripts/fix-invalid-drafts.js` - แก้ไข draft ที่มี step ผิดปกติ + cleanup expired drafts
2. `scripts/check-draft-by-email.js` - ตรวจสอบ draft ด้วย email

---

## 🚀 Deployment Steps

### **Step 1: Backup Database**
```bash
# SSH เข้า production server
ssh root@041034-U

# Backup database
mongodump --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --out=/root/backups/thai_music_school_$(date +%Y%m%d_%H%M%S)

# ตรวจสอบ backup
ls -lh /root/backups/
```

### **Step 2: Fix Invalid Drafts in Database**
```bash
# เข้า production server
cd /var/www/thai-music-platform

# รัน fix script
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  < scripts/fix-invalid-drafts.js

# ตรวจสอบผลลัพธ์
# Script จะแสดง:
# - จำนวน drafts ที่มี currentStep > 7 และแก้ไขเป็น 7
# - จำนวน drafts ที่หมดอายุและถูกลบ
# - สถิติ drafts ทั้งหมด
```

### **Step 3: Deploy Code Changes**
```bash
# เข้า production server
cd /var/www/thai-music-platform

# Pull latest code
git pull origin main

# ตรวจสอบว่า pull ถูก branch
git log -1 --oneline

# Install dependencies (ถ้ามีการเปลี่ยนแปลง)
npm install

# Build application
npm run build

# Restart PM2
pm2 restart thai-music-platform

# ตรวจสอบ logs
pm2 logs thai-music-platform --lines 50
```

### **Step 4: Verify Deployment**
```bash
# 1. ตรวจสอบ application status
pm2 list

# 2. ตรวจสอบ logs ว่าไม่มี error
pm2 logs thai-music-platform --lines 100 | grep -i error

# 3. ตรวจสอบ database connection
pm2 logs thai-music-platform --lines 100 | grep -i "mongodb connected"

# 4. Test API endpoint
curl -X POST https://dcpschool100.net/api/draft/save \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "0812345678",
    "submissionType": "register100",
    "formData": {},
    "currentStep": 8
  }'

# ควรได้ response:
# {"success":false,"message":"Invalid current step. Must be between 1 and 7."}
```

---

## 🔍 Troubleshooting

### **ตรวจสอบ Draft ด้วย Email**
```bash
# ใช้ script ตรวจสอบ draft
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --eval "var searchEmail='saowalak.saikaeo@gmail.com'" \
  < scripts/check-draft-by-email.js

# หรือใช้แบบ interactive
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin"
> load('scripts/check-draft-by-email.js')
> checkDraftByEmail('saowalak.saikaeo@gmail.com')
```

### **ตรวจสอบ OTP Email Logs**
```bash
# ดู logs ที่เกี่ยวกับ email
pm2 logs thai-music-platform --lines 200 | grep -i "saowalak.saikaeo@gmail.com"

# ดู logs ที่เกี่ยวกับ OTP
pm2 logs thai-music-platform --lines 200 | grep -i "otp"
```

### **Manual Database Queries**
```javascript
// เข้า MongoDB
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin"

// ดู drafts ทั้งหมดที่ active
db.draft_submissions.find({ status: "active" }).count()

// ดู drafts ที่ step 7 (พร้อม submit)
db.draft_submissions.find({ 
  currentStep: 7, 
  status: "active" 
}).count()

// ดู drafts ที่จะหมดอายุใน 7 วัน
db.draft_submissions.find({
  status: "active",
  expiresAt: { 
    $gte: new Date(),
    $lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
  }
}).count()

// แก้ไข draft เฉพาะ (ถ้าจำเป็น)
db.draft_submissions.updateOne(
  { draftToken: "cdc0a234-760d-45c4-8ce2-d2580dc911be" },
  { 
    $set: { 
      currentStep: 7,
      lastModified: new Date()
    } 
  }
)
```

---

## 📧 Customer Support Templates

### **สำหรับ Draft ที่พร้อม Submit (Step 7)**
```
เรียน คุณครู

ข่าวดี! ท่านกรอกข้อมูลครบถ้วนแล้ว พร้อมส่งข้อมูลได้เลย

📋 ข้อมูล Draft:
- โรงเรียน: [ชื่อโรงเรียน]
- สถานะ: ✅ กรอกครบทุกขั้นตอนแล้ว (7/7)
- หมดอายุ: [วันที่] (เหลืออีก [X] วัน)

🔗 กรุณาเข้าไปตรวจสอบและกดปุ่ม "ส่งข้อมูล":
https://dcpschool100.net/draft/[TOKEN]

⚠️ สำคัญ: กรุณา Submit ภายใน [X] วัน

ขอบคุณครับ/ค่ะ
ทีมงาน DCP School 100
```

### **สำหรับปัญหา OTP Email**
```
เรียน คุณครู

ทางทีมงานได้ตรวจสอบแล้ว ระบบส่ง OTP email สำเร็จแล้ว

📧 วิธีตรวจสอบ Email:
1. ✅ เช็ค Spam/Junk Folder (สำคัญที่สุด!)
2. ✅ ค้นหาใน Gmail: from:@dcpschool100.net
3. ✅ ยืนยัน email ถูกต้อง: [email]

📱 ถ้ายังไม่เจอ:
- ลองขอ OTP ใหม่อีกครั้ง
- ตรวจสอบว่า email ไม่เต็ม
- ลองใช้ email อื่น

หากยังไม่เจอ กรุณาแจ้งกลับมาพร้อมแนบ screenshot

ขอบคุณครับ/ค่ะ
ทีมงาน DCP School 100
```

---

## 📊 Monitoring Queries

### **Daily Statistics**
```javascript
use thai_music_school

print("=== DAILY DRAFT STATISTICS ===");
print("Date:", new Date().toISOString());
print("");

const now = new Date();
const stats = {
  total: db.draft_submissions.countDocuments({}),
  active: db.draft_submissions.countDocuments({ status: "active" }),
  submitted: db.draft_submissions.countDocuments({ status: "submitted" }),
  step7: db.draft_submissions.countDocuments({ currentStep: 7, status: "active" }),
  expiringSoon: db.draft_submissions.countDocuments({
    status: "active",
    expiresAt: { 
      $gte: now,
      $lt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) 
    }
  }),
  expired: db.draft_submissions.countDocuments({
    expiresAt: { $lt: now }
  })
};

print("Total Drafts:", stats.total);
print("Active:", stats.active);
print("Submitted:", stats.submitted);
print("Ready to Submit (Step 7):", stats.step7);
print("Expiring Soon (<7 days):", stats.expiringSoon);
print("Expired (need cleanup):", stats.expired);
```

### **Find Drafts Needing Attention**
```javascript
// Drafts ที่พร้อม submit แต่ใกล้หมดอายุ
db.draft_submissions.find({
  currentStep: 7,
  status: "active",
  expiresAt: { 
    $gte: new Date(),
    $lt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
  }
}).forEach(d => {
  print("Email:", d.email);
  print("School:", d.formData?.reg100_schoolName || d.formData?.regSupport_schoolName);
  print("Expires:", d.expiresAt);
  print("---");
});
```

---

## ✅ Rollback Plan

หากเกิดปัญหาหลัง deployment:

```bash
# 1. Rollback code
cd /var/www/thai-music-platform
git log -5 --oneline  # ดู commit ก่อนหน้า
git reset --hard <previous-commit-hash>
npm run build
pm2 restart thai-music-platform

# 2. Restore database (ถ้าจำเป็น)
mongorestore --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --drop \
  /root/backups/thai_music_school_YYYYMMDD_HHMMSS/thai_music_school

# 3. Verify
pm2 logs thai-music-platform --lines 50
```

---

## 📝 Post-Deployment Checklist

- [ ] Database backup สำเร็จ
- [ ] Fix invalid drafts script รันสำเร็จ
- [ ] Code deployed และ build สำเร็จ
- [ ] PM2 restart สำเร็จ
- [ ] Application logs ไม่มี error
- [ ] Database connection ปกติ
- [ ] API validation ทำงานถูกต้อง (reject currentStep = 8)
- [ ] แจ้งทีม support เกี่ยวกับการเปลี่ยนแปลง

---

## 🔗 Related Documents

- [ALL-FIXES-COMPLETE.md](./ALL-FIXES-COMPLETE.md) - สรุปการแก้ไขทั้งหมด
- [ADMIN-DASHBOARD-UPDATE.md](./ADMIN-DASHBOARD-UPDATE.md) - Admin dashboard features

---

**Last Updated**: 2026-05-28  
**Version**: 1.0.0
