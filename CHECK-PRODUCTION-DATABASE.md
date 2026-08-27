# ตรวจสอบ Production Database

เอกสารนี้อธิบายวิธีตรวจสอบว่า production application เชื่อมต่อกับ database ไหน และ draft ถูกบันทึกที่ไหน

---

## วิธีที่ 1: ใช้ Script ตรวจสอบ Database Connection

### รันบน Production Server:

```bash
cd /var/www/thai-music-platform
node scripts/check-database-connection.js
```

### ผลลัพธ์ที่ได้:
- ✅ Database ที่ application เชื่อมต่อ
- ✅ Collections ที่มีใน database
- ✅ จำนวน drafts ใน draft_submissions
- ✅ Draft ล่าสุดที่ถูกสร้าง
- ⚠️ ถ้ามี draft_submissions ใน database อื่น

---

## วิธีที่ 2: ทดสอบผ่าน API โดยตรง

### รันบน Production Server:

```bash
cd /var/www/thai-music-platform
bash scripts/test-draft-save-api.sh
```

### สิ่งที่ script จะทำ:
1. สร้าง test draft ผ่าน API `/api/draft/save`
2. ตรวจสอบว่า draft ถูกบันทึกใน database ไหน
3. ลบ test draft ออกอัตโนมัติ

---

## วิธีที่ 3: ตรวจสอบ Environment Variables

### ดู MONGODB_URI ที่ application ใช้:

```bash
cd /var/www/thai-music-platform
cat .env.production | grep MONGODB_URI
```

### ตัวอย่าง:
```
MONGODB_URI=mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin
```

**Database name อยู่หลัง `/` และก่อน `?`** → `thai_music_school`

---

## วิธีที่ 4: ตรวจสอบด้วย MongoDB Shell

### เชื่อมต่อและตรวจสอบ:

```bash
mongosh "mongodb://root:rootpass@localhost:27017?authSource=admin"
```

### คำสั่งใน mongosh:

```javascript
// 1. ดู databases ทั้งหมด
show dbs

// 2. เข้า database thai_music_school
use thai_music_school

// 3. นับจำนวน drafts
db.draft_submissions.countDocuments()

// 4. ดู draft ล่าสุด
db.draft_submissions.find().sort({createdAt: -1}).limit(1).pretty()

// 5. เข้า database thai_music_platform
use thai_music_platform

// 6. นับจำนวน drafts
db.draft_submissions.countDocuments()

// 7. ดู draft ล่าสุด
db.draft_submissions.find().sort({createdAt: -1}).limit(1).pretty()
```

---

## วิธีที่ 5: ตรวจสอบจาก Application Logs

### ดู logs ของ application:

```bash
# ถ้าใช้ PM2
pm2 logs thai-music-platform --lines 100

# หรือ
pm2 logs --lines 100 | grep -i "database\|mongodb\|draft"
```

### หา log ที่เกี่ยวข้อง:
- `Connected to database: thai_music_school`
- `Draft save email sent to: xxx@example.com`
- `Error saving draft:`

---

## วิธีที่ 6: ทดสอบด้วย curl (Manual)

### สร้าง test draft:

```bash
curl -X POST https://dcpschool100.net/api/draft/save \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-check@example.com",
    "phone": "0812345678",
    "submissionType": "register100",
    "currentStep": 1,
    "formData": {
      "reg100_schoolName": "โรงเรียนทดสอบ",
      "reg100_schoolProvince": "กรุงเทพมหานคร"
    }
  }'
```

### ตรวจสอบใน database:

```javascript
// ใน mongosh
use thai_music_school
db.draft_submissions.findOne({email: "test-check@example.com"})

use thai_music_platform
db.draft_submissions.findOne({email: "test-check@example.com"})
```

### ลบ test draft:

```javascript
use thai_music_school
db.draft_submissions.deleteOne({email: "test-check@example.com"})

use thai_music_platform
db.draft_submissions.deleteOne({email: "test-check@example.com"})
```

---

## สรุปการตรวจสอบ

### ✅ ถ้า draft อยู่ใน `thai_music_school`:
- Application config ถูกต้อง
- ใช้ database เดียวกับที่เราตรวจสอบ
- ไม่มีปัญหา

### ⚠️ ถ้า draft อยู่ใน `thai_music_platform`:
- Application อาจใช้ MONGODB_URI ผิด
- ต้องตรวจสอบ `.env.production`
- อาจต้อง migrate data

### ❌ ถ้าหาไม่เจอทั้ง 2 database:
- ตรวจสอบว่า API ทำงานหรือไม่
- ตรวจสอบ application logs
- ตรวจสอบ database connection

---

## Troubleshooting

### ปัญหา: Script ไม่ทำงาน

```bash
# ติดตั้ง dependencies
cd /var/www/thai-music-platform
npm install

# ตรวจสอบว่ามี .env.production
ls -la .env.production

# ตรวจสอบ permissions
chmod +x scripts/test-draft-save-api.sh
```

### ปัญหา: ไม่สามารถเชื่อมต่อ MongoDB

```bash
# ตรวจสอบว่า MongoDB ทำงาน
sudo systemctl status mongod

# ตรวจสอบ port
sudo netstat -tulpn | grep 27017

# ทดสอบเชื่อมต่อ
mongosh "mongodb://root:rootpass@localhost:27017?authSource=admin"
```

### ปัญหา: Permission Denied

```bash
# เปลี่ยน owner
sudo chown -R $USER:$USER /var/www/thai-music-platform

# หรือรันด้วย sudo
sudo node scripts/check-database-connection.js
```

---

## คำแนะนำ

1. **รัน script ตรวจสอบก่อน** เพื่อดูภาพรวม
2. **ทดสอบ API** เพื่อยืนยันว่า draft ถูกบันทึกที่ไหน
3. **ตรวจสอบ logs** ถ้ามีปัญหา
4. **Backup database** ก่อนทำการแก้ไขใดๆ

---

## ติดต่อ

หากพบปัญหาหรือต้องการความช่วยเหลือ:
- ตรวจสอบ logs: `pm2 logs`
- ตรวจสอบ database: `mongosh`
- ตรวจสอบ application: `pm2 status`
