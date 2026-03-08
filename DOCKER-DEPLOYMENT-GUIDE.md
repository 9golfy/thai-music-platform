# Docker Deployment Guide

## ไฟล์ที่เกี่ยวข้อง

- `Dockerfile` - สำหรับ development (ใช้ `npm run dev`)
- `Dockerfile.prod` - สำหรับ production (multi-stage build, optimized)
- `docker-compose.yml` - Development environment
- `docker-compose.prod.yml` - Production environment

## Development Mode (ปัจจุบัน)

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop
docker-compose down
```

Services:
- Web: http://localhost:3000 (Frontend + API)
- MongoDB: localhost:27017
- Mongo Express: http://localhost:8081 (admin/admin123)

## Production Mode

### Build และ Run

```bash
# Build production image
docker-compose -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f web

# Stop
docker-compose -f docker-compose.prod.yml down
```

### Environment Variables

สร้างไฟล์ `.env.production`:

```env
MONGODB_URI=mongodb://mongodb:27017/thai-music-platform
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=production
```

### ความแตกต่าง Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Dockerfile | `Dockerfile` | `Dockerfile.prod` |
| Build | Hot reload | Optimized build |
| Size | ~1.5 GB | ~200 MB |
| Command | `npm run dev` | `node server.js` |
| Volumes | Mounted (live reload) | No volumes (immutable) |

## การเปลี่ยนแปลงที่ทำ

1. **ลบ service `api` ออก** - ไม่จำเป็นเพราะ Next.js มี API routes อยู่แล้ว
2. **สร้าง Dockerfile.prod** - Multi-stage build สำหรับ production
3. **อัพเดท next.config.ts** - เพิ่ม `output: 'standalone'` สำหรับ production
4. **สร้าง docker-compose.prod.yml** - Configuration สำหรับ production

## Vercel Deployment

สำหรับ Vercel ไม่ต้องใช้ Docker:

1. Push code ไป GitHub
2. Import project ใน Vercel
3. ตั้งค่า Environment Variables:
   - `MONGODB_URI` - MongoDB connection string (ใช้ MongoDB Atlas)
   - `NEXT_PUBLIC_API_URL` - Vercel URL ของคุณ

Vercel จะ auto-detect Next.js และ deploy อัตโนมัติ
