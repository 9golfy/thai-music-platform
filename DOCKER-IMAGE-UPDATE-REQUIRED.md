# Docker Image Update Required ⚠️

## ปัญหา:
Docker image ที่ใช้อยู่เป็นเวอร์ชันเก่า ไม่มี School ID generation code

## หลักฐาน:
1. ❌ ไม่มี log "Generated School ID" ใน Docker logs
2. ❌ Compiled JavaScript ไม่มี `schoolId` code
3. ✅ Source code (TypeScript) มี School ID generation
4. ✅ รูปภาพถูก save ใน Docker container แต่ไม่ sync กับ host

## วิธีแก้ไขชั่วคราว (สำหรับ Development):

### 1. เพิ่ม School ID ให้ records เก่า ✅
```bash
node scripts/add-school-id-to-existing.js
```

### 2. Sync รูปภาพจาก Docker container ✅
```powershell
powershell -ExecutionPolicy Bypass -File scripts/sync-uploads-from-docker.ps1
```

## วิธีแก้ไขถาวร:

### Option 1: Rebuild Docker Image (แนะนำสำหรับ Production)
```bash
# Build new image with latest code
docker build -t 889976851669.dkr.ecr.ap-southeast-1.amazonaws.com/thai-music-platform:latest .

# Push to ECR
docker push 889976851669.dkr.ecr.ap-southeast-1.amazonaws.com/thai-music-platform:latest

# Restart container
docker-compose down
docker-compose up -d
```

### Option 2: รันบน Host Machine (แนะนำสำหรับ Development)
```bash
# Stop Docker web container
docker stop thai-music-web

# Run on host
npm run dev
# หรือ
npm run build
npm start
```

### Option 3: เพิ่ม Volume Mapping (สำหรับรูปภาพ)
แก้ไข `docker-compose.yml`:
```yaml
services:
  web:
    image: 889976851669.dkr.ecr.ap-southeast-1.amazonaws.com/thai-music-platform:latest
    container_name: thai-music-web
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - mongo
    volumes:
      - ./public/uploads:/app/public/uploads  # เพิ่มบรรทัดนี้
```

## สถานะปัจจุบัน:

### ✅ แก้ไขชั่วคราวแล้ว:
- School ID ถูกเพิ่มให้ record ที่มีอยู่
- รูปภาพถูก sync จาก Docker container มาที่ host

### ⚠️ ยังต้องแก้ไข:
- Docker image ต้อง rebuild เพื่อให้ School ID generation ทำงานอัตโนมัติ
- Volume mapping สำหรับรูปภาพ

## การทดสอบ:

### Test 1: ตรวจสอบ School ID ✅
```bash
node scripts/check-specific-record-by-id.js
```
ผลลัพธ์:
- School ID: SCH-20260301-0001 ✅
- Manager Image: /uploads/mgt_1772326818378_manager.jpg ✅
- Teacher Images: มี 2 รูป ✅

### Test 2: ตรวจสอบรูปภาพ ✅
```bash
Test-Path "public/uploads/mgt_1772326818378_manager.jpg"
```
ผลลัพธ์: True ✅

### Test 3: เปิดหน้า Detail View
URL: http://localhost:3001/dcp-admin/dashboard/register100/69a38fa2a29d6ad3828c66af
- School ID ควรแสดง: SCH-20260301-0001 ✅
- รูปภาพควรแสดง ✅

## Scripts ที่สร้าง:

1. `scripts/sync-uploads-from-docker.ps1` - Sync รูปจาก Docker container
2. `scripts/add-school-id-to-existing.js` - เพิ่ม School ID ให้ records เก่า (อัพเดทแล้ว)

## คำแนะนำ:

### สำหรับ Development:
1. รันบน host machine แทน Docker
2. หรือ rebuild Docker image ทุกครั้งที่มีการเปลี่ยนแปลง code

### สำหรับ Production:
1. ต้อง rebuild Docker image
2. เพิ่ม volume mapping สำหรับ uploads
3. หรือใช้ external storage (S3, CloudFront)

## Next Steps:

1. ✅ School ID และรูปภาพแก้ไขชั่วคราวแล้ว
2. ⚠️ ต้อง rebuild Docker image สำหรับ Production
3. ⚠️ ต้องเพิ่ม volume mapping หรือใช้ external storage
4. 🔄 รัน test cases ใหม่เพื่อยืนยัน

## สรุป:
ปัญหาเกิดจาก Docker image เก่าที่ไม่มี code ล่าสุด แก้ไขชั่วคราวโดยเพิ่ม School ID และ sync รูปภาพแล้ว แต่ต้อง rebuild image สำหรับการใช้งานจริง
