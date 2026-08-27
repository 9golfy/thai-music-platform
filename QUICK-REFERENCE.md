# 🚀 Quick Reference Card - Draft Validation Fixes

## ⚡ One-Liner Deployment

```bash
# Complete deployment in one command (after backup!)
cd /var/www/thai-music-platform && \
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" < scripts/fix-invalid-drafts.js && \
git pull origin main && \
npm install && \
npm run build && \
pm2 restart thai-music-platform && \
pm2 logs thai-music-platform --lines 50
```

---

## 📋 Essential Commands

### **Backup**
```bash
mongodump --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" --out=/root/backups/thai_music_school_$(date +%Y%m%d_%H%M%S)
```

### **Fix Database**
```bash
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" < scripts/fix-invalid-drafts.js
```

### **Check Draft by Email**
```bash
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" --eval "var searchEmail='user@example.com'" < scripts/check-draft-by-email.js
```

### **Deploy Code**
```bash
git pull origin main && npm install && npm run build && pm2 restart thai-music-platform
```

### **Check Status**
```bash
pm2 list && pm2 logs thai-music-platform --lines 50
```

### **Test API**
```bash
# Should reject step 8
curl -X POST https://dcpschool100.net/api/draft/save -H "Content-Type: application/json" -d '{"email":"test@example.com","phone":"0812345678","submissionType":"register100","formData":{},"currentStep":8}'
```

### **Rollback**
```bash
git reset --hard <commit-hash> && npm run build && pm2 restart thai-music-platform
```

---

## 📊 Quick Statistics

```bash
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" << 'EOF'
use thai_music_school
print("Active:", db.draft_submissions.countDocuments({ status: "active" }));
print("Step 7:", db.draft_submissions.countDocuments({ currentStep: 7, status: "active" }));
print("Invalid:", db.draft_submissions.countDocuments({ currentStep: { $gt: 7 }, status: "active" }));
print("Expired:", db.draft_submissions.countDocuments({ expiresAt: { $lt: new Date() } }));
EOF
```

---

## 🔍 Troubleshooting

### **Check Logs**
```bash
pm2 logs thai-music-platform --lines 100 | grep -i error
```

### **Check MongoDB Connection**
```bash
pm2 logs thai-music-platform --lines 100 | grep -i "mongodb connected"
```

### **Check OTP Emails**
```bash
pm2 logs thai-music-platform --lines 200 | grep -i "otp email sent"
```

### **Manual Fix Draft**
```javascript
use thai_music_school
db.draft_submissions.updateOne(
  { draftToken: "TOKEN_HERE" },
  { $set: { currentStep: 7, lastModified: new Date() } }
)
```

---

## 📧 Email Templates

### **Step 7 Users (Ready to Submit)**
```
Subject: แจ้งเตือน: ข้อมูลของท่านพร้อมส่งแล้ว

เรียน คุณครู
ท่านกรอกข้อมูลครบถ้วนแล้ว พร้อมส่งได้เลย
🔗 https://dcpschool100.net/draft/[TOKEN]
⚠️ หมดอายุ: [DATE]
```

### **OTP Issue**
```
Subject: เรื่อง OTP Email

เรียน คุณครู
ระบบส่ง OTP สำเร็จแล้ว
📧 กรุณาเช็ค Spam/Junk Folder
🔍 ค้นหา: from:@dcpschool100.net
```

---

## 📚 Documentation

- **DEPLOYMENT-READY.md** - Start here!
- **PRODUCTION-DEPLOYMENT-COMMANDS.md** - All commands
- **DRAFT-FIXES-DEPLOYMENT.md** - Detailed guide
- **CONTEXT-TRANSFER-SUMMARY.md** - Complete overview
- **scripts/README.md** - Scripts documentation

---

## 🆘 Emergency Contacts

```
Server: root@041034-U
Database: mongodb://localhost:27017/thai_music_school
App: https://dcpschool100.net
PM2: thai-music-platform
Backups: /root/backups/
```

---

## ✅ Quick Checklist

```
[ ] Backup created
[ ] Database fixed
[ ] Code deployed
[ ] App restarted
[ ] Logs checked
[ ] API tested
[ ] Team notified
```

---

**Print this page for quick reference during deployment!**

**Last Updated**: 2026-05-28
