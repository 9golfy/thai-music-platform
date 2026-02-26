# AWS Deployment Troubleshooting

## ปัญหาที่พบ: API Error 500

Test แสดงว่า:
- ✅ Network ทำงาน (API ตอบกลับภายใน 31 วินาที)
- ❌ Server error 500 (Internal Server Error)
- ❌ Form submission ล้มเหลว

## สาเหตุที่เป็นไปได้

### 1. MongoDB ไม่ทำงาน
```bash
# SSH เข้า AWS EC2
ssh -i your-key.pem ubuntu@13.212.254.184

# ตรวจสอบ Docker containers
docker ps

# ควรเห็น containers:
# - thai-music-web
# - thai-music-mongo
# - thai-music-mongo-express

# ถ้า MongoDB ไม่ running
docker-compose up -d mongodb
```

### 2. Environment Variables ไม่ถูกต้อง
```bash
# ตรวจสอบ env vars
docker exec thai-music-web env | grep MONGODB

# ควรเห็น:
# MONGODB_URI=mongodb://mongodb:27017/thai-music-platform
```

### 3. Code ยังไม่ได้ pull ล่าสุด
```bash
cd ~/thai-music-platform
git pull origin master
docker-compose down
docker-compose up -d --build
```

### 4. Uploads directory ไม่มีสิทธิ์เขียน
```bash
# ตรวจสอบ permissions
docker exec thai-music-web ls -la public/

# ถ้าไม่มี uploads folder หรือไม่มีสิทธิ์
docker exec thai-music-web mkdir -p public/uploads
docker exec thai-music-web chmod 777 public/uploads
```

### 5. ดู Server Logs
```bash
# ดู logs แบบ real-time
docker-compose logs -f web

# หรือดู logs ล่าสุด 100 บรรทัด
docker-compose logs --tail=100 web

# ดู MongoDB logs
docker-compose logs --tail=50 mongodb
```

## วิธีแก้ไขแบบเร็ว

### Option 1: Restart ทั้งหมด
```bash
cd ~/thai-music-platform
git pull
docker-compose down
docker-compose up -d --build
docker-compose logs -f
```

### Option 2: ใช้ Production Mode
```bash
cd ~/thai-music-platform
git pull
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
docker-compose -f docker-compose.prod.yml logs -f
```

## ตรวจสอบ MongoDB Connection

```bash
# เข้า MongoDB shell
docker exec -it thai-music-mongo mongosh

# ใน MongoDB shell:
show dbs
use thai_music_school
show collections
db.register_support_submissions.countDocuments()
exit
```

## ตรวจสอบ API Endpoint

```bash
# Test API health (ถ้ามี health endpoint)
curl http://localhost:3000/api/health

# Test MongoDB connection
docker exec thai-music-web node -e "const {MongoClient} = require('mongodb'); const client = new MongoClient('mongodb://mongodb:27017'); client.connect().then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e.message))"
```

## Common Errors และวิธีแก้

### Error: "ECONNREFUSED mongodb:27017"
```bash
# MongoDB ไม่ running
docker-compose up -d mongodb
docker-compose restart web
```

### Error: "EACCES: permission denied, mkdir '/app/public/uploads'"
```bash
# ไม่มีสิทธิ์สร้าง folder
docker exec thai-music-web mkdir -p public/uploads
docker exec thai-music-web chmod 777 public/uploads
docker-compose restart web
```

### Error: "Cannot find module 'mongodb'"
```bash
# Dependencies ไม่ครบ
docker-compose down
docker-compose up -d --build
```

## ขั้นตอนการ Debug

1. **ดู logs ก่อน**
   ```bash
   docker-compose logs --tail=100 web
   ```

2. **ตรวจสอบ containers**
   ```bash
   docker ps -a
   ```

3. **Test MongoDB**
   ```bash
   docker exec -it thai-music-mongo mongosh --eval "db.adminCommand('ping')"
   ```

4. **Restart services**
   ```bash
   docker-compose restart
   ```

5. **Rebuild ถ้าจำเป็น**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

## ติดต่อผม

ถ้าแก้ไม่ได้ ให้:
1. รัน: `docker-compose logs --tail=200 web > logs.txt`
2. ส่ง logs.txt มาให้ผมดู
3. บอกผลลัพธ์จาก `docker ps`
