# 🚀 Production Deployment - Quick Commands

## 📋 Pre-Deployment Checklist

```bash
# 1. ตรวจสอบว่าอยู่ใน production server
hostname
# ควรแสดง: 041034-U

# 2. ตรวจสอบ current directory
pwd
# ควรแสดง: /var/www/thai-music-platform

# 3. ตรวจสอบ git status
git status
git log -1 --oneline
```

---

## 🔧 Step-by-Step Deployment

### **1. Backup Database (REQUIRED)**
```bash
# สร้าง backup directory ถ้ายังไม่มี
mkdir -p /root/backups

# Backup database
mongodump --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --out=/root/backups/thai_music_school_$(date +%Y%m%d_%H%M%S)

# ตรวจสอบ backup
ls -lh /root/backups/ | tail -5
```

### **2. Fix Invalid Drafts**
```bash
# เข้า project directory
cd /var/www/thai-music-platform

# รัน fix script
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  < scripts/fix-invalid-drafts.js

# Output ที่คาดหวัง:
# ======================================================================
# 🔧 FIX INVALID DRAFT STEPS
# ======================================================================
# 
# 📊 Step 1: Finding drafts with invalid currentStep (> 7)...
# ⚠️  Found X draft(s) with invalid currentStep:
# ...
# ✅ Fixed X draft(s)
# 
# ======================================================================
# 🧹 Step 2: Cleaning up expired drafts...
# ✅ Deleted X expired draft(s)
# 
# ======================================================================
# 📊 DRAFT STATISTICS
# ======================================================================
```

### **3. Deploy Code**
```bash
# Pull latest code
git pull origin main

# ตรวจสอบว่า pull สำเร็จ
git log -1 --oneline

# Install dependencies (ถ้ามี)
npm install

# Build application
npm run build

# ตรวจสอบว่า build สำเร็จ
echo $?
# ควรแสดง: 0
```

### **4. Restart Application**
```bash
# Restart PM2
pm2 restart thai-music-platform

# ตรวจสอบ status
pm2 list

# ดู logs
pm2 logs thai-music-platform --lines 50
```

### **5. Verify Deployment**
```bash
# 1. ตรวจสอบ MongoDB connection
pm2 logs thai-music-platform --lines 100 | grep -i "mongodb connected"
# ควรเห็น: ✅ MongoDB connected successfully to database: thai_music_school

# 2. ตรวจสอบว่าไม่มี error
pm2 logs thai-music-platform --lines 100 | grep -i error

# 3. Test API validation (ควร reject currentStep = 8)
curl -X POST https://dcpschool100.net/api/draft/save \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "0812345678",
    "submissionType": "register100",
    "formData": {},
    "currentStep": 8
  }'

# Expected response:
# {"success":false,"message":"Invalid current step. Must be between 1 and 7."}

# 4. Test valid request (ควร accept currentStep = 7)
curl -X POST https://dcpschool100.net/api/draft/save \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "0812345678",
    "submissionType": "register100",
    "formData": {},
    "currentStep": 7
  }'

# Expected response:
# {"success":true,...}
```

---

## 🔍 Troubleshooting Commands

### **Check Specific Draft**
```bash
# ตรวจสอบ draft ด้วย email
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --eval "var searchEmail='saowalak.saikaeo@gmail.com'" \
  < scripts/check-draft-by-email.js
```

### **Check OTP Email Logs**
```bash
# ดู logs สำหรับ email เฉพาะ
pm2 logs thai-music-platform --lines 200 | grep -i "saowalak.saikaeo@gmail.com"

# ดู OTP logs
pm2 logs thai-music-platform --lines 200 | grep -i "otp email sent"
```

### **Manual Database Fix**
```bash
# เข้า MongoDB
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin"

# แก้ไข draft เฉพาะ
db.draft_submissions.updateOne(
  { draftToken: "cdc0a234-760d-45c4-8ce2-d2580dc911be" },
  { 
    $set: { 
      currentStep: 7,
      lastModified: new Date()
    } 
  }
)

# ตรวจสอบผลลัพธ์
db.draft_submissions.findOne({ 
  draftToken: "cdc0a234-760d-45c4-8ce2-d2580dc911be" 
})
```

---

## 📊 Monitoring Commands

### **Check Application Status**
```bash
# PM2 status
pm2 list

# Memory usage
pm2 monit

# Detailed info
pm2 info thai-music-platform
```

### **Check Database Statistics**
```bash
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" << 'EOF'
use thai_music_school

print("=== DRAFT STATISTICS ===");
print("Total Active:", db.draft_submissions.countDocuments({ status: "active" }));
print("Step 7 (Ready):", db.draft_submissions.countDocuments({ currentStep: 7, status: "active" }));
print("Expiring Soon (<7 days):", db.draft_submissions.countDocuments({
  status: "active",
  expiresAt: { $lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
}));
print("Expired:", db.draft_submissions.countDocuments({
  expiresAt: { $lt: new Date() }
}));
EOF
```

### **Check Logs**
```bash
# Real-time logs
pm2 logs thai-music-platform

# Last 100 lines
pm2 logs thai-music-platform --lines 100

# Filter errors
pm2 logs thai-music-platform --lines 200 --err

# Save logs to file
pm2 logs thai-music-platform --lines 500 > /tmp/app-logs-$(date +%Y%m%d_%H%M%S).log
```

---

## 🔄 Rollback Commands

```bash
# 1. ดู commit history
cd /var/www/thai-music-platform
git log -5 --oneline

# 2. Rollback code
git reset --hard <previous-commit-hash>

# 3. Rebuild
npm run build

# 4. Restart
pm2 restart thai-music-platform

# 5. Restore database (ถ้าจำเป็น)
mongorestore --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --drop \
  /root/backups/thai_music_school_YYYYMMDD_HHMMSS/thai_music_school

# 6. Verify
pm2 logs thai-music-platform --lines 50
```

---

## 📧 Email Notification Template

```
Subject: [Production] Draft Validation Fixes Deployed

✅ Deployment Completed Successfully

Date: $(date)
Server: 041034-U
Application: thai-music-platform

Changes:
- Fixed currentStep validation (1-7 only)
- Fixed invalid drafts in database
- Cleaned up expired drafts

Verification:
✅ Application running
✅ Database connected
✅ API validation working
✅ No errors in logs

Statistics:
- Active Drafts: [X]
- Ready to Submit: [X]
- Expiring Soon: [X]

Next Steps:
- Monitor logs for 24 hours
- Contact users with drafts at step 7
- Follow up on OTP email issues

---
Deployed by: [Your Name]
```

---

## 🆘 Emergency Contacts

```
Production Server: root@041034-U
Database: mongodb://localhost:27017/thai_music_school
Application URL: https://dcpschool100.net
PM2 Process: thai-music-platform

Backup Location: /root/backups/
Logs Location: ~/.pm2/logs/
```

---

## ✅ Post-Deployment Checklist

```bash
# Copy this checklist and mark each item as you complete it

[ ] 1. Database backup created
[ ] 2. Invalid drafts fixed
[ ] 3. Code pulled from main branch
[ ] 4. Dependencies installed
[ ] 5. Application built successfully
[ ] 6. PM2 restarted
[ ] 7. Application status: online
[ ] 8. MongoDB connection verified
[ ] 9. No errors in logs
[ ] 10. API validation tested (reject step 8)
[ ] 11. API validation tested (accept step 7)
[ ] 12. Draft statistics checked
[ ] 13. Team notified
[ ] 14. Documentation updated
```

---

**Quick Reference**

```bash
# One-liner deployment (after backup)
cd /var/www/thai-music-platform && \
git pull origin main && \
npm install && \
npm run build && \
pm2 restart thai-music-platform && \
pm2 logs thai-music-platform --lines 50
```

---

**Last Updated**: 2026-05-28  
**Version**: 1.0.0
