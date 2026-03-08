# Development Workflow Guide 🚀

## แนวทางที่แนะนำสำหรับ Development

### ✅ Option 1: รัน Next.js บน Host + MongoDB ใน Docker (แนะนำที่สุด)

**ข้อดี:**
- ✅ Code เปลี่ยนแปลงทันที (Hot Reload)
- ✅ ไม่ต้อง rebuild Docker image
- ✅ รูปภาพ save ที่ `public/uploads` บน host (ไม่หาย)
- ✅ Debug ง่าย
- ✅ เร็วกว่า

**ข้อเสีย:**
- ⚠️ ต้องติดตั้ง Node.js บน host
- ⚠️ ต้องใช้ `.env.local` สำหรับ localhost

**วิธีตั้งค่า:**

1. **Stop Docker web container:**
```bash
docker stop thai-music-web
```

2. **เก็บ MongoDB และ Mongo Express ไว้:**
```bash
# MongoDB และ Mongo Express ยังรันอยู่
docker ps
# ควรเห็น: thai-music-mongo, thai-music-mongo-express
```

3. **ใช้ .env.local (สร้างไว้แล้ว):**
```env
MONGODB_URI=mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin
```

4. **รัน Next.js บน host:**
```bash
# Development mode (Hot Reload)
npm run dev

# หรือ Production mode
npm run build
npm start
```

5. **เข้าใช้งาน:**
- Frontend: http://localhost:3000
- Mongo Express: http://localhost:8081

**การทำงาน:**
```
┌─────────────────┐
│   Host Machine  │
│                 │
│  Next.js :3000  │ ← Code เปลี่ยนแปลงทันที
│  (npm run dev)  │
│                 │
│  public/uploads │ ← รูปภาพ save ที่นี่
└────────┬────────┘
         │
         │ localhost:27017
         ↓
┌─────────────────┐
│  Docker         │
│                 │
│  MongoDB :27017 │
│  Mongo Express  │
└─────────────────┘
```

---

### ⚠️ Option 2: Docker Compose สำหรับ Dev (ต้องแก้ไข)

**ข้อดี:**
- ✅ Environment เหมือน Production
- ✅ ไม่ต้องติดตั้ง Node.js บน host

**ข้อเสีย:**
- ❌ ต้อง rebuild image ทุกครั้งที่แก้ code
- ❌ รูปภาพหายเมื่อ rebuild (ถ้าไม่มี volume)
- ❌ ช้ากว่า

**วิธีแก้ไข:**

สร้าง `docker-compose.dev.yml`:
```yaml
services:
  mongo:
    image: mongo:7
    container_name: thai-music-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  mongo-express:
    image: mongo-express:1
    container_name: thai-music-mongo-express
    restart: unless-stopped
    depends_on:
      - mongo
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ${MONGO_ROOT_USERNAME}
      ME_CONFIG_MONGODB_ADMINPASSWORD: ${MONGO_ROOT_PASSWORD}
      ME_CONFIG_MONGODB_SERVER: mongo
      ME_CONFIG_BASICAUTH: "false"
    ports:
      - "8081:8081"

  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: thai-music-web-dev
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - mongo
    volumes:
      # Mount source code for hot reload
      - .:/app
      - /app/node_modules
      - /app/.next
      # Mount uploads directory
      - ./public/uploads:/app/public/uploads
    command: npm run dev

volumes:
  mongo_data:
```

**การใช้งาน:**
```bash
# Start dev environment
docker-compose -f docker-compose.dev.yml up -d

# Rebuild เมื่อแก้ code
docker-compose -f docker-compose.dev.yml up -d --build

# Stop
docker-compose -f docker-compose.dev.yml down
```

---

### 🎯 Option 3: Hybrid (แนะนำสำหรับทีม)

**สำหรับ Developer:**
- รัน Next.js บน host (Option 1)
- ใช้ MongoDB ใน Docker

**สำหรับ Testing/Staging:**
- ใช้ Docker Compose แบบเต็ม
- มี volume mapping สำหรับ uploads

---

## การจัดการรูปภาพ

### ปัญหา:
- รูปภาพใน Docker container หายเมื่อ rebuild
- รูปภาพไม่ sync ระหว่าง host และ container

### วิธีแก้:

#### 1. Volume Mapping (แนะนำสำหรับ Dev)
แก้ไข `docker-compose.yml`:
```yaml
services:
  web:
    volumes:
      - ./public/uploads:/app/public/uploads
```

#### 2. External Storage (แนะนำสำหรับ Production)
- AWS S3 + CloudFront
- Azure Blob Storage
- Google Cloud Storage

#### 3. Sync Script (ชั่วคราว)
```bash
# Sync จาก Docker มา host
powershell -ExecutionPolicy Bypass -File scripts/sync-uploads-from-docker.ps1

# Sync จาก host ไป Docker
docker cp public/uploads/. thai-music-web:/app/public/uploads/
```

---

## Workflow แนะนำ

### สำหรับ Development (รายวัน):

```bash
# 1. Start MongoDB
docker-compose up -d mongo mongo-express

# 2. Stop web container (ถ้ารันอยู่)
docker stop thai-music-web

# 3. Run Next.js บน host
npm run dev

# 4. เข้าใช้งาน
# - Frontend: http://localhost:3000
# - Mongo Express: http://localhost:8081
```

### สำหรับ Testing:

```bash
# 1. Clear data
node scripts/clear-all-data.js

# 2. Run tests
npx playwright test tests/register100.spec.ts

# 3. Check database
node scripts/check-all-databases.js

# 4. Check specific record
node scripts/check-specific-record-by-id.js
```

### สำหรับ Production Build:

```bash
# 1. Build Docker image
docker build -t thai-music-platform:latest .

# 2. Test locally
docker-compose up -d

# 3. Push to ECR
docker tag thai-music-platform:latest 889976851669.dkr.ecr.ap-southeast-1.amazonaws.com/thai-music-platform:latest
docker push 889976851669.dkr.ecr.ap-southeast-1.amazonaws.com/thai-music-platform:latest
```

---

## เปรียบเทียบ

| Feature | Host (Option 1) | Docker Dev (Option 2) | Docker Prod |
|---------|----------------|----------------------|-------------|
| Hot Reload | ✅ ทันที | ⚠️ ต้อง rebuild | ❌ ไม่มี |
| รูปภาพ | ✅ ไม่หาย | ⚠️ ต้อง volume | ⚠️ ต้อง volume |
| ความเร็ว | ✅ เร็ว | ⚠️ ปานกลาง | ✅ เร็ว |
| Setup | ⚠️ ต้องติดตั้ง Node | ✅ ง่าย | ✅ ง่าย |
| Debug | ✅ ง่าย | ⚠️ ยาก | ❌ ยากมาก |

---

## คำแนะนำสุดท้าย

### สำหรับคุณ (Development):
1. ✅ ใช้ Option 1: รัน Next.js บน host
2. ✅ เก็บ MongoDB ใน Docker
3. ✅ ใช้ `.env.local` สำหรับ localhost
4. ✅ รูปภาพจะ save ที่ `public/uploads` บน host (ไม่หาย)

### สำหรับ Production:
1. ✅ Build Docker image ใหม่
2. ✅ เพิ่ม volume mapping สำหรับ uploads
3. ✅ หรือใช้ S3 สำหรับรูปภาพ

---

## Quick Start

```bash
# 1. Stop Docker web
docker stop thai-music-web

# 2. Start MongoDB only
docker-compose up -d mongo mongo-express

# 3. Run Next.js
npm run dev

# 4. Open browser
# http://localhost:3000
```

---

## Troubleshooting

### ปัญหา: Cannot connect to MongoDB
```bash
# ตรวจสอบว่า MongoDB รันอยู่
docker ps | grep mongo

# ตรวจสอบ .env.local
cat .env.local
# ต้องเป็น localhost:27017 ไม่ใช่ mongo:27017
```

### ปัญหา: Port 3000 ถูกใช้งาน
```bash
# หา process ที่ใช้ port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### ปัญหา: รูปภาพไม่แสดง
```bash
# ตรวจสอบว่าไฟล์มีอยู่
ls public/uploads

# ตรวจสอบ permissions
# Windows: ไม่มีปัญหา
# Linux/Mac: chmod -R 755 public/uploads
```

---

## สรุป

✅ **แนะนำ:** รัน Next.js บน host + MongoDB ใน Docker
- เร็ว, ไม่ต้อง rebuild, รูปไม่หาย, debug ง่าย

⚠️ **ทางเลือก:** Docker Compose Dev
- ต้องเพิ่ม volume mapping และ hot reload

🚀 **Production:** Docker Image + Volume/S3
- Build image ใหม่, ใช้ external storage
