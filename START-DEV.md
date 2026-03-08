# เริ่มต้น Development 🚀

## สถานะปัจจุบัน: ✅ พร้อมใช้งาน

### Docker Containers ที่รันอยู่:
- ✅ MongoDB (port 27017)
- ✅ Mongo Express (port 8081)
- ✅ thai-music-web (stopped แล้ว)

### Configuration:
- ✅ `.env.local` สร้างแล้ว (ใช้ localhost:27017)
- ✅ `public/uploads` มีรูปภาพ 93 ไฟล์

---

## วิธีเริ่มต้น

### 1. รัน Next.js บน Host:

```bash
# Development mode (Hot Reload)
npm run dev
```

หรือ

```bash
# Production mode
npm run build
npm start
```

### 2. เข้าใช้งาน:

- **Frontend:** http://localhost:3000
- **Mongo Express:** http://localhost:8081
- **API:** http://localhost:3000/api/*

---

## ทดสอบว่าทำงาน:

### Test 1: เปิด Frontend
```
http://localhost:3000
```
ควรเห็นหน้าแรกของเว็บ

### Test 2: ตรวจสอบ Database Connection
```bash
node scripts/check-all-databases.js
```
ควรเห็น:
- Database: thai_music_school
- Collections: register100_submissions (1 record)

### Test 3: Submit Form ใหม่
```
http://localhost:3000/regist100
```
- กรอกข้อมูล + upload รูป
- Submit
- ตรวจสอบว่า School ID ถูกสร้าง
- ตรวจสอบว่ารูปแสดง

### Test 4: ตรวจสอบ Record
```bash
# ดู record ล่าสุด
node scripts/check-all-databases.js

# ตรวจสอบ record เฉพาะ (แก้ไข ID)
node scripts/check-specific-record-by-id.js
```

---

## ข้อดีของวิธีนี้:

1. ✅ **Hot Reload:** แก้ code แล้วเห็นผลทันที
2. ✅ **รูปไม่หาย:** save ที่ `public/uploads` บน host
3. ✅ **School ID ทำงาน:** ใช้ code ล่าสุด
4. ✅ **Debug ง่าย:** ดู console logs ได้ชัดเจน
5. ✅ **เร็วกว่า:** ไม่ต้อง rebuild Docker

---

## Workflow การทำงาน:

```
1. แก้ code ใน VS Code
   ↓
2. Save file (Ctrl+S)
   ↓
3. Next.js Hot Reload อัตโนมัติ
   ↓
4. Refresh browser เพื่อดูผล
   ↓
5. ทดสอบ
```

---

## คำสั่งที่ใช้บ่อย:

```bash
# เริ่ม Development
npm run dev

# Clear database
node scripts/clear-all-data.js

# ตรวจสอบ database
node scripts/check-all-databases.js

# Run tests
npx playwright test tests/register100.spec.ts

# Sync รูปจาก Docker (ถ้าจำเป็น)
powershell -ExecutionPolicy Bypass -File scripts/sync-uploads-from-docker.ps1
```

---

## หยุดการทำงาน:

```bash
# หยุด Next.js
Ctrl+C

# หยุด MongoDB (ถ้าต้องการ)
docker-compose down
```

---

## เริ่มใหม่:

```bash
# Start MongoDB
docker-compose up -d mongo mongo-express

# Start Next.js
npm run dev
```

---

## Troubleshooting:

### ปัญหา: Port 3000 ถูกใช้งาน
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# หรือเปลี่ยน port
# แก้ไข package.json: "dev": "next dev -p 3001"
```

### ปัญหา: Cannot connect to MongoDB
```bash
# ตรวจสอบ MongoDB
docker ps | grep mongo

# ตรวจสอบ .env.local
cat .env.local
# ต้องมี: MONGODB_URI=mongodb://root:rootpass@localhost:27017/...
```

### ปัญหา: Module not found
```bash
# ติดตั้ง dependencies
npm install
```

---

## สรุป:

✅ พร้อมใช้งาน! เพียงรัน:
```bash
npm run dev
```

แล้วเปิด http://localhost:3000
