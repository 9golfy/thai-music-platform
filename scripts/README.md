# 🛠️ Database Scripts

This directory contains MongoDB scripts for managing drafts and database maintenance.

---

## 📋 Available Scripts

### **1. fix-invalid-drafts.js**
Fix drafts with invalid currentStep values and cleanup expired drafts.

**What it does**:
- Finds drafts with `currentStep > 7`
- Fixes invalid steps to 7
- Deletes expired drafts
- Shows statistics

**Usage**:
```bash
# Production
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  < scripts/fix-invalid-drafts.js

# Local development
mongosh "mongodb://localhost:27017/thai_music_school" \
  < scripts/fix-invalid-drafts.js
```

**Output Example**:
```
======================================================================
🔧 FIX INVALID DRAFT STEPS
======================================================================

📊 Step 1: Finding drafts with invalid currentStep (> 7)...

⚠️  Found 1 draft(s) with invalid currentStep:

1. Email: user@example.com
   Token: abc123...
   Current Step: 8 ❌
   School: โรงเรียนตัวอย่าง

🔧 Fixing invalid currentStep values...

✅ Fixed 1 draft(s)

======================================================================
🧹 Step 2: Cleaning up expired drafts...

✅ Deleted 3 expired draft(s)

======================================================================
📊 DRAFT STATISTICS
======================================================================

📈 Current Statistics:
   Total Drafts: 25
   Active: 20
   Submitted: 5
   Ready to Submit (Step 7): 8
   Expiring Soon (<7 days): 12

======================================================================
✅ SCRIPT COMPLETED
======================================================================
```

---

### **2. check-draft-by-email.js**
Search and display detailed draft information by email address.

**What it does**:
- Searches for drafts by email (exact match)
- Falls back to case-insensitive search
- Falls back to partial match
- Displays detailed draft information

**Usage**:
```bash
# Command line (production)
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --eval "var searchEmail='user@example.com'" \
  < scripts/check-draft-by-email.js

# Interactive mode
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin"
> load('scripts/check-draft-by-email.js')
> checkDraftByEmail('user@example.com')

# Local development
mongosh "mongodb://localhost:27017/thai_music_school"
> load('scripts/check-draft-by-email.js')
> checkDraftByEmail('user@example.com')
```

**Output Example**:
```
======================================================================
🔍 SEARCHING FOR DRAFTS: user@example.com
======================================================================

📋 DRAFT #1 INFORMATION

📧 BASIC INFO:
   Email: user@example.com
   Phone: 0812345678
   Token: abc123-def456-ghi789
   Type: register100
   Status: active
   Current Step: 7 / 7

🏫 SCHOOL INFO:
   School: โรงเรียนตัวอย่าง
   Province: กรุงเทพมหานคร
   Level: ประถมศึกษา

👤 MANAGEMENT:
   Name: นายตัวอย่าง
   Position: ผู้อำนวยการ
   Phone: 0898765432
   Email: director@example.com

👨‍🏫 TEACHERS: 3 person(s)
   1. นางสาวครูตัวอย่าง - ครูชำนาญการ
   2. นายครูตัวอย่าง - ครู
   3. นางครูตัวอย่าง - ครูผู้ช่วย

📧 OTP INFO:
   OTP Request Count: 5
   Last OTP Request: 2026-05-28T10:30:00.000Z
   OTP Attempts: 2
   OTP Expires At: 2026-05-28T10:45:00.000Z

📅 DATES:
   Created: 2026-05-21T08:00:00.000Z
   Last Modified: 2026-05-28T10:30:00.000Z
   Expires: 2026-06-04T08:00:00.000Z
   Days Left: ✅ 7 days

📊 STATS:
   Save Count: 15

🔗 DRAFT LINK:
   https://dcpschool100.net/draft/abc123-def456-ghi789

======================================================================
```

---

## 🚀 Common Use Cases

### **Case 1: User Reports Invalid Draft**
```bash
# 1. Check draft details
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin"
> load('scripts/check-draft-by-email.js')
> checkDraftByEmail('user@example.com')

# 2. If step is invalid, run fix script
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  < scripts/fix-invalid-drafts.js
```

### **Case 2: Regular Maintenance**
```bash
# Run weekly to cleanup expired drafts
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  < scripts/fix-invalid-drafts.js
```

### **Case 3: User Can't Find Draft**
```bash
# Search by email (handles typos and case differences)
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --eval "var searchEmail='user@example.com'" \
  < scripts/check-draft-by-email.js
```

### **Case 4: Check Draft Statistics**
```bash
# Use fix-invalid-drafts.js to see statistics (without making changes)
# The script shows stats even if no fixes are needed
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  < scripts/fix-invalid-drafts.js
```

---

## 🔒 Safety Notes

### **fix-invalid-drafts.js**
- ✅ **Safe to run multiple times** - Only fixes actual issues
- ✅ **Non-destructive** - Only updates invalid data
- ⚠️ **Deletes expired drafts** - Make sure you have backups
- 📝 **Always backup first** - See backup commands below

### **check-draft-by-email.js**
- ✅ **Read-only** - Does not modify any data
- ✅ **Safe to run anytime** - No side effects
- ✅ **No backup needed** - Only queries data

---

## 💾 Backup Commands

### **Before Running Fix Scripts**
```bash
# Create backup directory
mkdir -p /root/backups

# Backup entire database
mongodump --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --out=/root/backups/thai_music_school_$(date +%Y%m%d_%H%M%S)

# Backup only draft_submissions collection
mongodump --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --collection=draft_submissions \
  --out=/root/backups/drafts_$(date +%Y%m%d_%H%M%S)

# Verify backup
ls -lh /root/backups/
```

### **Restore from Backup**
```bash
# Restore entire database
mongorestore --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --drop \
  /root/backups/thai_music_school_YYYYMMDD_HHMMSS/thai_music_school

# Restore only draft_submissions collection
mongorestore --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" \
  --collection=draft_submissions \
  --drop \
  /root/backups/drafts_YYYYMMDD_HHMMSS/thai_music_school/draft_submissions.bson
```

---

## 🔍 Manual Queries

### **Find Invalid Drafts**
```javascript
use thai_music_school

// Find drafts with invalid currentStep
db.draft_submissions.find({
  currentStep: { $gt: 7 },
  status: "active"
})

// Count invalid drafts
db.draft_submissions.countDocuments({
  currentStep: { $gt: 7 },
  status: "active"
})
```

### **Find Expired Drafts**
```javascript
// Find expired drafts
db.draft_submissions.find({
  expiresAt: { $lt: new Date() }
})

// Count expired drafts
db.draft_submissions.countDocuments({
  expiresAt: { $lt: new Date() }
})
```

### **Find Drafts by Email**
```javascript
// Exact match
db.draft_submissions.find({
  email: "user@example.com"
})

// Case-insensitive
db.draft_submissions.find({
  email: /^user@example\.com$/i
})

// Partial match
db.draft_submissions.find({
  email: /user/i
})
```

### **Get Statistics**
```javascript
const now = new Date();

print("Total Drafts:", db.draft_submissions.countDocuments({}));
print("Active:", db.draft_submissions.countDocuments({ status: "active" }));
print("Submitted:", db.draft_submissions.countDocuments({ status: "submitted" }));
print("Step 7:", db.draft_submissions.countDocuments({ currentStep: 7, status: "active" }));
print("Expired:", db.draft_submissions.countDocuments({ expiresAt: { $lt: now } }));
```

---

## 📚 Related Documentation

- [DRAFT-FIXES-DEPLOYMENT.md](../DRAFT-FIXES-DEPLOYMENT.md) - Full deployment guide
- [PRODUCTION-DEPLOYMENT-COMMANDS.md](../PRODUCTION-DEPLOYMENT-COMMANDS.md) - Quick commands
- [CASE-SAOWALAK-OTP-ISSUE.md](../CASE-SAOWALAK-OTP-ISSUE.md) - OTP case study
- [CONTEXT-TRANSFER-SUMMARY.md](../CONTEXT-TRANSFER-SUMMARY.md) - Complete summary

---

## 🆘 Troubleshooting

### **Script Won't Run**
```bash
# Check if mongosh is installed
mongosh --version

# Check if MongoDB is running
systemctl status mongod

# Check connection
mongosh "mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" --eval "db.runCommand({ ping: 1 })"
```

### **Permission Denied**
```bash
# Make scripts executable
chmod +x scripts/*.js

# Or run with mongosh directly
mongosh "mongodb://..." < scripts/script-name.js
```

### **Wrong Database**
```bash
# Check current database
mongosh "mongodb://..." --eval "db.getName()"

# List all databases
mongosh "mongodb://..." --eval "show dbs"

# Switch database in script
# Scripts already include: use thai_music_school
```

---

## 📝 Script Development

### **Testing Scripts Locally**
```bash
# 1. Start local MongoDB
docker run -d -p 27017:27017 --name mongo-test mongo:latest

# 2. Import test data
mongorestore --uri="mongodb://localhost:27017/thai_music_school" \
  /path/to/test/data

# 3. Run script
mongosh "mongodb://localhost:27017/thai_music_school" \
  < scripts/your-script.js

# 4. Cleanup
docker stop mongo-test
docker rm mongo-test
```

### **Adding New Scripts**
1. Create script in `scripts/` directory
2. Add `use thai_music_school` at the top
3. Add error handling
4. Add documentation in this README
5. Test locally before production
6. Create backup before running in production

---

## ✅ Best Practices

1. **Always backup before running fix scripts**
2. **Test scripts locally first**
3. **Run during low-traffic hours**
4. **Monitor logs after running**
5. **Document any manual changes**
6. **Keep scripts version controlled**
7. **Review output carefully**
8. **Have rollback plan ready**

---

**Last Updated**: 2026-05-28  
**Maintainer**: Development Team  
**Version**: 1.0.0


---

## 🔄 Backup & Restore Scripts

### **check-backup-data.js**
เช็คข้อมูลใน backup database

**Usage**:
```bash
# เช็คข้อมูลทั้งหมดใน backup
node scripts/check-backup-data.js

# เช็คโรงเรียนเฉพาะจาก backup
node scripts/check-backup-data.js SCH-20260607-0496
```

### **compare-backup-production.js**
เปรียบเทียบข้อมูลระหว่าง backup กับ production เพื่อหาข้อมูลที่หายไป

**Usage**:
```bash
# เปรียบเทียบทั้งหมด
node scripts/compare-backup-production.js

# เช็คเฉพาะประเภท
node scripts/compare-backup-production.js register100
node scripts/compare-backup-production.js register-support
```

### **restore-from-backup.js**
กู้คืนข้อมูลโรงเรียนจาก backup database

**Usage**:
```bash
# กู้คืนโรงเรียน
node scripts/restore-from-backup.js SCH-20260607-0496 register100
node scripts/restore-from-backup.js SCH-20260607-0496 register-support
```

**Environment Variables**:
- `BACKUP_MONGODB_URI` - MongoDB URI สำหรับ backup database
- `MONGODB_URI` - MongoDB URI สำหรับ production database

**Example**:
```bash
# ตั้งค่า environment variable
export BACKUP_MONGODB_URI="mongodb://root:rootpass@localhost:27017/thai_music_school_backup?authSource=admin"

# หรือใส่ในคำสั่งเดียว
BACKUP_MONGODB_URI="mongodb://..." node scripts/check-backup-data.js
```

---
