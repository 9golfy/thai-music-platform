# 🔍 ตรวจสอบ Database Configuration

## 📋 สรุป

จาก code ที่ตรวจสอบ:

### **1. Save Draft API** (`app/api/draft/save/route.ts`)
```typescript
// Line 197-198
const { db } = await connectToDatabase();
const draftsCollection = db.collection('draft_submissions');
```
✅ **บันทึกใน collection**: `draft_submissions`

### **2. MongoDB Connection** (`lib/mongodb.ts`)
```typescript
// Line 16-23
let dbName = process.env.MONGO_DB;

if (!dbName) {
  // Try to extract from URI: mongodb://user:pass@host:port/dbname?options
  const match = uri.match(/\/([^/?]+)(\?|$)/);
  dbName = match ? match[1] : 'thai_music_school';
  console.log('📝 Database name extracted from URI:', dbName);
}
```

✅ **Database name มาจาก**:
1. `process.env.MONGO_DB` (ถ้ามี)
2. แตกจาก `MONGODB_URI` (ถ้าไม่มี MONGO_DB)
3. Default: `thai_music_school` (ถ้าแตกไม่ได้)

---

## 🔍 วิธีตรวจสอบ Production

### **Step 1: ตรวจสอบ Environment Variables**
```bash
# SSH เข้า production
ssh root@041034-U

# ไปที่ project directory
cd /var/www/thai-music-platform

# ดู .env files
echo "=== .env.production ==="
cat .env.production | grep -E "MONGO|DATABASE"

echo -e "\n=== .env ==="
cat .env 2>/dev/null | grep -E "MONGO|DATABASE" || echo "No .env file"

echo -e "\n=== .env.local ==="
cat .env.local 2>/dev/null | grep -E "MONGO|DATABASE" || echo "No .env.local file"
```

### **Step 2: ตรวจสอบ Application Logs**
```bash
# ดู logs ว่าเชื่อมต่อ database ไหน
pm2 logs thai-music-platform --lines 200 | grep -E "Database name|MongoDB connected"

# ตัวอย่าง output ที่คาดหวัง:
# 📝 Database name extracted from URI: thai_music_school
# ✅ MongoDB connected successfully to database: thai_music_school
```

### **Step 3: ตรวจสอบ PM2 Environment**
```bash
# ดู environment variables ที่ PM2 ใช้
pm2 env thai-music-platform | grep -E "MONGO|DATABASE"
```

---

## 🎯 สาเหตุที่เป็นไปได้

### **1. Database Name ต่างกัน**

#### **Scenario A: ใช้ MONGO_DB**
```env
# .env.production
MONGO_DB=thai-music-platform
MONGODB_URI=mongodb://root:rootpass@localhost:27017?authSource=admin
```
➡️ **ใช้ database**: `thai-music-platform`

#### **Scenario B: แตกจาก URI**
```env
# .env.production
MONGODB_URI=mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin
```
➡️ **ใช้ database**: `thai_music_school`

#### **Scenario C: แตกจาก URI (ชื่ออื่น)**
```env
# .env.production
MONGODB_URI=mongodb://root:rootpass@localhost:27017/thai-music-platform?authSource=admin
```
➡️ **ใช้ database**: `thai-music-platform`

#### **Scenario D: Default**
```env
# .env.production
MONGODB_URI=mongodb://root:rootpass@localhost:27017?authSource=admin
```
➡️ **ใช้ database**: `thai_music_school` (default)

---

## 🔧 วิธีแก้ไข

### **ถ้าต้องการใช้ `thai_music_school`**
```env
# .env.production
MONGODB_URI=mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin
```

### **ถ้าต้องการใช้ `thai-music-platform`**
```env
# .env.production
MONGODB_URI=mongodb://root:rootpass@localhost:27017/thai-music-platform?authSource=admin
```

### **หรือกำหนดชัดเจน**
```env
# .env.production
MONGO_DB=thai_music_school
MONGODB_URI=mongodb://root:rootpass@localhost:27017?authSource=admin
```

---

## 📊 ตรวจสอบ Databases ทั้งหมด

```bash
# เข้า MongoDB
mongosh "mongodb://root:rootpass@localhost:27017?authSource=admin"

# ดู databases ทั้งหมด
show dbs

# ตัวอย่าง output:
# admin              180.00 KiB
# config             108.00 KiB
# local               72.00 KiB
# thai_music_school    5.23 MiB  ← ตัวนี้
# thai-music-platform  2.15 MiB  ← หรือตัวนี้?
# test                 8.00 KiB
```

---

## 🔍 ค้นหา Token ในทุก Database

```javascript
// เข้า MongoDB
mongosh "mongodb://root:rootpass@localhost:27017?authSource=admin"

// ค้นหาใน thai_music_school
use thai_music_school
db.draft_submissions.findOne({
  $or: [
    { draftToken: "7ade1ea6-8478-43af-a854-53ec8dfddd06" },
    { token: "7ade1ea6-8478-43af-a854-53ec8dfddd06" }
  ]
})

// ค้นหาใน thai-music-platform
use thai-music-platform
db.draft_submissions.findOne({
  $or: [
    { draftToken: "7ade1ea6-8478-43af-a854-53ec8dfddd06" },
    { token: "7ade1ea6-8478-43af-a854-53ec8dfddd06" }
  ]
})

// หรือใช้ script ที่สร้างไว้
exit
```

```bash
# ใช้ script ค้นหาทุก database
mongosh "mongodb://root:rootpass@localhost:27017?authSource=admin" \
  --eval "var searchToken='7ade1ea6-8478-43af-a854-53ec8dfddd06'" \
  < scripts/search-all-databases.js
```

---

## ✅ Checklist

- [ ] ตรวจสอบ `.env.production`
- [ ] ดู application logs
- [ ] ตรวจสอบ PM2 environment
- [ ] ดู databases ทั้งหมดใน MongoDB
- [ ] ค้นหา token ในแต่ละ database
- [ ] ยืนยัน database name ที่ใช้จริง

---

## 📝 สรุป

**Draft ถูกบันทึกที่**:
- **Collection**: `draft_submissions`
- **Database**: ขึ้นอยู่กับ environment variables
  - ถ้ามี `MONGO_DB` → ใช้ค่านั้น
  - ถ้าไม่มี → แตกจาก `MONGODB_URI`
  - ถ้าแตกไม่ได้ → ใช้ `thai_music_school` (default)

**ต้องตรวจสอบ**:
1. ดู `.env.production` ว่ามี `MONGO_DB` หรือไม่
2. ดู `MONGODB_URI` ว่ามี database name ใน URI หรือไม่
3. ดู application logs ว่าเชื่อมต่อ database ไหน
4. ค้นหา token ในทุก database

---

**Last Updated**: 2026-05-28
