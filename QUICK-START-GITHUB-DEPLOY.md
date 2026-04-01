# 🚀 Quick Start: GitHub Auto Deploy

## เริ่มต้นด่วน 5 นาที

### ขั้นตอนที่ 1: ตั้งค่า Server (ทำครั้งเดียว)

```bash
# 1. SSH เข้า server
ssh ubuntu@164.115.41.34

# 2. สร้าง SSH key
ssh-keygen -t ed25519 -C "github-deploy"
# กด Enter ทุกครั้ง

# 3. เพิ่ม public key ใน authorized_keys
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys

# 4. แสดง private key (เก็บไว้ใช้ใน GitHub)
cat ~/.ssh/id_ed25519
# คัดลอกทั้งหมด (รวม -----BEGIN และ -----END)

# 5. Clone repository
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git thai-music-platform
cd thai-music-platform

# 6. สร้าง .env.production
nano .env.production
# ใส่ค่าตาม .env.production.example

# 7. Build และ start
npm ci --only=production
npm run build
pm2 start npm --name thai-music -- start
pm2 save
pm2 startup
# ทำตามคำสั่งที่แสดง
```

---

### ขั้นตอนที่ 2: ตั้งค่า GitHub Secrets

1. ไปที่ GitHub repository
2. Settings → Secrets and variables → Actions
3. คลิก "New repository secret"
4. เพิ่ม secrets ทั้ง 4 ตัว:

#### SSH_HOST
```
164.115.41.34
```

#### SSH_USER
```
ubuntu
```

#### SSH_PRIVATE_KEY
```
(วาง private key จากขั้นตอนที่ 1.4)
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

#### SSH_PORT (optional)
```
22
```

---

### ขั้นตอนที่ 3: ทดสอบ Auto Deploy

```bash
# บน local machine
git add .
git commit -m "Test auto deploy"
git push origin main
```

**ดู logs**:
1. ไปที่ GitHub repository
2. คลิก "Actions" tab
3. เลือก workflow ล่าสุด
4. ดู logs

---

## ✅ เสร็จแล้ว!

ตอนนี้ทุกครั้งที่คุณ push code ไป GitHub:
1. GitHub Actions จะ trigger อัตโนมัติ
2. SSH เข้า server 164.115.41.34
3. Pull code ล่าสุด
4. Build application
5. Restart PM2
6. ✅ Deploy เสร็จสิ้น!

---

## 🧪 ทดสอบ

### ทดสอบ Application
```bash
curl http://164.115.41.34/api/health
```

### ดู Logs บน Server
```bash
ssh ubuntu@164.115.41.34 'pm2 logs thai-music'
```

### ดู Logs ใน GitHub
GitHub → Actions → เลือก workflow

---

## 🔄 Workflow

```
Developer (Local)
    ↓ git push
GitHub Repository
    ↓ trigger
GitHub Actions
    ↓ SSH
Server (164.115.41.34)
    ↓ git pull
    ↓ npm build
    ↓ pm2 restart
✅ Deploy Complete!
```

---

## 🆘 ปัญหาที่พบบ่อย

### GitHub Actions ไม่ทำงาน

**ตรวจสอบ**:
1. Push ไป branch ที่ถูกต้อง (main หรือ master)
2. GitHub Secrets ตั้งค่าครบทั้ง 4 ตัว
3. SSH_PRIVATE_KEY ต้องมี header และ footer ครบ

**แก้ไข**:
```bash
# ลอง trigger manual
GitHub → Actions → Deploy to Production → Run workflow
```

### SSH Connection Failed

**ตรวจสอบ**:
```bash
# ทดสอบ SSH จาก local
ssh -i ~/.ssh/id_ed25519 ubuntu@164.115.41.34

# ตรวจสอบ authorized_keys บน server
ssh ubuntu@164.115.41.34 'cat ~/.ssh/authorized_keys'
```

### Build Failed

**ดู logs**:
```bash
# บน server
ssh ubuntu@164.115.41.34
cd /home/ubuntu/thai-music-platform
npm run build
```

---

## 📚 เอกสารเพิ่มเติม

- **คู่มือฉบับเต็ม**: `GITHUB-DEPLOY-SETUP.md`
- **Deploy manual**: `DEPLOY-TO-164.115.41.34.md`
- **Security**: `SECURITY-SUMMARY-TH.md`

---

## 📞 Quick Commands

```bash
# ดู GitHub Actions logs
# GitHub → Actions

# ดู server logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music'

# Restart application
ssh ubuntu@164.115.41.34 'pm2 restart thai-music'

# Manual deploy
ssh ubuntu@164.115.41.34 'cd /home/ubuntu/thai-music-platform && ./deploy.sh'
```

---

## 🎯 Checklist

### Setup ครั้งแรก
- [ ] สร้าง SSH key บน server
- [ ] Clone repository บน server
- [ ] ตั้งค่า .env.production
- [ ] Build และ start application
- [ ] เพิ่ม GitHub Secrets ทั้ง 4 ตัว

### ทุกครั้งที่ Deploy
- [ ] Commit code
- [ ] Push ไป GitHub
- [ ] ดู logs ใน GitHub Actions
- [ ] ทดสอบ application

---

**เวลาที่ใช้**:
- Setup ครั้งแรก: 10-15 นาที
- Deploy ครั้งถัดไป: 2-3 นาที (อัตโนมัติ)

**ผลลัพธ์**: Auto deploy ทุกครั้งที่ push code! 🎉
