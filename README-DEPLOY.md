# 📚 คู่มือ Deploy ทั้งหมด

## 🎯 ภาพรวม

คุณมี 3 วิธีในการ deploy:

| วิธี | ความยาก | เวลา | แนะนำ |
|------|---------|------|-------|
| 1. GitHub Actions | ⭐ ง่าย | 10 นาที (setup ครั้งแรก) | ⭐⭐⭐ |
| 2. GitHub Webhook | ⭐⭐ ปานกลาง | 15 นาที | ⭐⭐ |
| 3. Manual Deploy | ⭐ ง่าย | 5 นาที | ⭐ |

---

## 📁 เอกสารทั้งหมด

### เริ่มต้นที่นี่
1. **เริ่มที่นี่.md** - เริ่มต้นภาษาไทยแบบสั้น
2. **QUICK-START-GITHUB-DEPLOY.md** - เริ่มต้นด่วน GitHub Actions (5 นาที)

### คู่มือ Deploy
3. **GITHUB-DEPLOY-SETUP.md** - คู่มือ GitHub Actions และ Webhook (ฉบับเต็ม)
4. **DEPLOY-TO-164.115.41.34.md** - คู่มือ deploy สำหรับ server นี้
5. **DEPLOYMENT-SUMMARY.md** - สรุปการ deploy ทั้งหมด

### คู่มือ Security
6. **SECURITY-SUMMARY-TH.md** - สรุปความปลอดภัยภาษาไทย
7. **SECURITY-QUICK-START.md** - เริ่มต้นด่วน Security
8. **SECURITY-HEADERS-GUIDE.md** - คู่มือ Security ฉบับเต็ม
9. **README-SECURITY.md** - เอกสาร Security หลัก

### คู่มือ Production
10. **PRODUCTION-DEPLOY.md** - คู่มือ deploy production
11. **DEPLOYMENT-CHECKLIST.md** - Checklist ครบถ้วน

---

## 🚀 เลือกวิธี Deploy

### วิธีที่ 1: GitHub Actions (แนะนำ) ⭐⭐⭐

**เหมาะกับ**: ทุกคน, production

**ข้อดี**:
- ✅ Auto deploy เมื่อ push code
- ✅ ปลอดภัยที่สุด
- ✅ มี logs ใน GitHub
- ✅ ไม่ต้องเปิด port เพิ่ม

**เริ่มต้น**: อ่าน `QUICK-START-GITHUB-DEPLOY.md` (5 นาที)

**คู่มือเต็ม**: `GITHUB-DEPLOY-SETUP.md`

---

### วิธีที่ 2: GitHub Webhook ⭐⭐

**เหมาะกับ**: คนที่ต้องการควบคุมเต็มที่

**ข้อดี**:
- ✅ Deploy เร็วกว่า GitHub Actions
- ✅ ควบคุมได้เต็มที่
- ✅ Custom logic ได้

**ข้อเสีย**:
- ⚠️ ต้องเปิด port 9000
- ⚠️ ต้องดูแล webhook server

**คู่มือ**: `GITHUB-DEPLOY-SETUP.md` (ส่วน Webhook)

---

### วิธีที่ 3: Manual Deploy ⭐

**เหมาะกับ**: ทดสอบ, deploy ด่วน

**จาก Local**:
```bash
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

**บน Server**:
```bash
ssh ubuntu@164.115.41.34
cd /home/ubuntu/thai-music-platform
./deploy.sh
```

**คู่มือ**: `DEPLOY-TO-164.115.41.34.md`

---

## 🖥️ ข้อมูล Server

- **IP**: 164.115.41.34
- **User**: ubuntu
- **App Directory**: /home/ubuntu/thai-music-platform
- **PM2 App Name**: thai-music
- **Branch**: main (หรือ master)

---

## 📋 Workflow แต่ละวิธี

### GitHub Actions
```
Local Machine
  ↓ git push
GitHub
  ↓ trigger Actions
GitHub Actions
  ↓ SSH
Server (164.115.41.34)
  ↓ git pull, build, restart
✅ Done!
```

### GitHub Webhook
```
Local Machine
  ↓ git push
GitHub
  ↓ send webhook
Server (164.115.41.34)
  ↓ receive webhook
  ↓ git pull, build, restart
✅ Done!
```

### Manual Deploy
```
Local Machine
  ↓ run script
  ↓ SSH
Server (164.115.41.34)
  ↓ git pull, build, restart
✅ Done!
```

---

## 🔒 Security Features

ทุกวิธีมี security features เหล่านี้:

### Next.js Security Headers
- ✅ Content-Security-Policy
- ✅ X-Frame-Options: DENY
- ✅ Strict-Transport-Security
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection
- ✅ Referrer-Policy

### Nginx Security
- ✅ TLS 1.2+ only
- ✅ AEAD ciphers
- ✅ gzip disabled
- ✅ Server tokens hidden
- ✅ Timestamp headers removed

**คู่มือ**: `SECURITY-SUMMARY-TH.md`

---

## 🧪 การทดสอบ

### ทดสอบ Application
```bash
# Health check
curl http://164.115.41.34/api/health

# Main page
curl -I http://164.115.41.34
```

### ทดสอบ Security (ถ้ามี HTTPS)
```bash
chmod +x test-security.sh
./test-security.sh your-domain.com
```

### ดู Logs
```bash
# Application logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music'

# Nginx logs
ssh ubuntu@164.115.41.34 'sudo tail -f /var/log/nginx/access.log'
```

---

## 📊 เปรียบเทียบวิธี Deploy

| Feature | GitHub Actions | Webhook | Manual |
|---------|---------------|---------|--------|
| Auto deploy | ✅ | ✅ | ❌ |
| ความปลอดภัย | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| ความเร็ว | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| Logs | GitHub | Server | Terminal |
| Setup | ง่าย | ปานกลาง | ง่ายที่สุด |
| Maintenance | ไม่ต้อง | ต้องดูแล | ไม่ต้อง |
| เปิด port | ไม่ต้อง | ต้อง (9000) | ไม่ต้อง |

---

## 🎓 แนะนำสำหรับ...

### Beginner
1. เริ่มจาก Manual Deploy
2. ทดสอบให้คุ้นเคย
3. อัพเกรดเป็น GitHub Actions

**เริ่มที่**: `QUICK-START-GITHUB-DEPLOY.md`

### Intermediate
1. ใช้ GitHub Actions
2. ตั้งค่า security headers
3. ติดตั้ง SSL certificate

**เริ่มที่**: `GITHUB-DEPLOY-SETUP.md`

### Advanced
1. ใช้ GitHub Actions + Webhook
2. Custom deployment logic
3. Multi-environment setup
4. Monitoring และ alerting

**เริ่มที่**: `PRODUCTION-DEPLOY.md`

---

## 🆘 Troubleshooting

### ปัญหาทั่วไป

#### Deploy ล้มเหลว
```bash
# ดู logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music --lines 100'

# ลอง build manual
ssh ubuntu@164.115.41.34
cd /home/ubuntu/thai-music-platform
npm run build
```

#### Git pull failed
```bash
# ตรวจสอบ git status
ssh ubuntu@164.115.41.34
cd /home/ubuntu/thai-music-platform
git status

# Stash changes
git stash
git pull origin main
```

#### Application ไม่ start
```bash
# Restart PM2
ssh ubuntu@164.115.41.34 'pm2 restart thai-music'

# ตรวจสอบ .env.production
ssh ubuntu@164.115.41.34 'cat /home/ubuntu/thai-music-platform/.env.production'
```

---

## 📞 Quick Commands

```bash
# Deploy (GitHub Actions)
git push origin main

# Deploy (Manual)
./deploy-to-server.sh

# ดู logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music'

# Restart
ssh ubuntu@164.115.41.34 'pm2 restart thai-music'

# Status
ssh ubuntu@164.115.41.34 'pm2 status'

# SSH
ssh ubuntu@164.115.41.34
```

---

## 📚 เอกสารแนะนำตามหัวข้อ

### ต้องการ Auto Deploy
→ `QUICK-START-GITHUB-DEPLOY.md`

### ต้องการ Deploy Manual
→ `DEPLOY-TO-164.115.41.34.md`

### ต้องการแก้ไข Security
→ `SECURITY-SUMMARY-TH.md`

### ต้องการ Setup Production
→ `PRODUCTION-DEPLOY.md`

### ต้องการ Checklist
→ `DEPLOYMENT-CHECKLIST.md`

---

## ✅ Checklist ก่อนเริ่ม

### Local Machine
- [ ] Git repository พร้อม
- [ ] Code ทดสอบแล้ว
- [ ] .env.example มีครบ

### Server (164.115.41.34)
- [ ] Node.js 20.x ติดตั้งแล้ว
- [ ] MongoDB 7.x ติดตั้งแล้ว
- [ ] Nginx ติดตั้งแล้ว
- [ ] PM2 ติดตั้งแล้ว
- [ ] Firewall ตั้งค่าแล้ว

### GitHub
- [ ] Repository สร้างแล้ว
- [ ] Secrets ตั้งค่าแล้ว (ถ้าใช้ Actions)
- [ ] Webhook ตั้งค่าแล้ว (ถ้าใช้ Webhook)

---

## 🎯 เริ่มต้นเลย!

### สำหรับคนรีบ (5 นาที)
1. อ่าน `QUICK-START-GITHUB-DEPLOY.md`
2. ตั้งค่า GitHub Secrets
3. Push code
4. ✅ Done!

### สำหรับคนละเอียด (30 นาที)
1. อ่าน `GITHUB-DEPLOY-SETUP.md`
2. อ่าน `SECURITY-SUMMARY-TH.md`
3. ตั้งค่าทุกอย่าง
4. ทดสอบ
5. ✅ Done!

### สำหรับ Production (2 ชั่วโมง)
1. อ่าน `PRODUCTION-DEPLOY.md`
2. อ่าน `DEPLOYMENT-CHECKLIST.md`
3. Setup ทุกอย่างตาม checklist
4. ทดสอบทุก features
5. ติดตั้ง SSL
6. ทดสอบ security
7. ✅ Done!

---

## 🎉 สรุป

คุณมีเอกสารครบถ้วนสำหรับ:
1. ✅ Deploy แบบ Auto (GitHub Actions)
2. ✅ Deploy แบบ Manual
3. ✅ Security Headers ครบถ้วน
4. ✅ Production-ready setup

**เริ่มต้นที่**: `QUICK-START-GITHUB-DEPLOY.md`

**เวลาที่ใช้**:
- Setup ครั้งแรก: 10-30 นาที
- Deploy ครั้งถัดไป: 2-3 นาที (auto)

Good luck! 🚀
