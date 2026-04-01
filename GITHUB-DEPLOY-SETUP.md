# คู่มือตั้งค่า GitHub และ Auto Deploy

## 🎯 ภาพรวม

ระบบ deployment มี 2 วิธี:
1. **GitHub Actions** (แนะนำ) - Auto deploy เมื่อ push ไป GitHub
2. **GitHub Webhook** - Server รับ webhook จาก GitHub แล้ว deploy เอง

---

## 📋 ข้อมูล Server

- **IP**: 164.115.41.34
- **User**: ubuntu
- **App Directory**: /home/ubuntu/thai-music-platform
- **PM2 App Name**: thai-music

---

## 🚀 วิธีที่ 1: GitHub Actions (แนะนำ)

### ข้อดี
- ✅ ไม่ต้องเปิด port บน server
- ✅ ปลอดภัยกว่า (ใช้ SSH key)
- ✅ มี logs ใน GitHub
- ✅ ทำงานอัตโนมัติ

### ขั้นตอนการตั้งค่า

#### 1. สร้าง SSH Key บน Server

```bash
# SSH เข้า server
ssh ubuntu@164.115.41.34

# สร้าง SSH key (ถ้ายังไม่มี)
ssh-keygen -t ed25519 -C "github-actions-deploy"
# กด Enter ทุกครั้ง (ไม่ต้องใส่ passphrase)

# แสดง public key
cat ~/.ssh/id_ed25519.pub

# คัดลอก public key ไปเพิ่มใน authorized_keys
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys

# แสดง private key (เก็บไว้ใช้ใน GitHub Secrets)
cat ~/.ssh/id_ed25519
```

#### 2. ตั้งค่า GitHub Secrets

ไปที่ GitHub repository:
1. Settings → Secrets and variables → Actions
2. คลิก "New repository secret"
3. เพิ่ม secrets ต่อไปนี้:

| Secret Name | Value | ตัวอย่าง |
|-------------|-------|----------|
| `SSH_HOST` | 164.115.41.34 | IP ของ server |
| `SSH_USER` | ubuntu | username |
| `SSH_PRIVATE_KEY` | (private key จากขั้นตอนที่ 1) | เนื้อหาจาก `~/.ssh/id_ed25519` |
| `SSH_PORT` | 22 | port SSH (ถ้าไม่ใช่ 22) |

#### 3. Clone Repository บน Server

```bash
# SSH เข้า server
ssh ubuntu@164.115.41.34

# Clone repository
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git thai-music-platform
cd thai-music-platform

# ตั้งค่า git config (ถ้าจำเป็น)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

#### 4. ตั้งค่า Environment Variables

```bash
# สร้าง .env.production
cd /home/ubuntu/thai-music-platform
nano .env.production
```

ใส่ค่าต่อไปนี้:
```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=YOUR_SECURE_PASSWORD
MONGO_DATABASE=thai_music_school_prod
MONGODB_URI=mongodb://admin:YOUR_SECURE_PASSWORD@localhost:27017/thai_music_school_prod?authSource=admin

JWT_SECRET=YOUR_JWT_SECRET
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

NEXT_PUBLIC_APP_URL=http://164.115.41.34
NEXT_PUBLIC_API_URL=http://164.115.41.34/api

NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### 5. Build และ Start ครั้งแรก

```bash
cd /home/ubuntu/thai-music-platform

# ติดตั้ง dependencies
npm ci --only=production

# Build
npm run build

# Start with PM2
pm2 start npm --name thai-music -- start
pm2 save
pm2 startup
# ทำตามคำสั่งที่แสดง
```

#### 6. ทดสอบ Auto Deploy

```bash
# บน local machine
git add .
git commit -m "Test auto deploy"
git push origin main
```

ไปดู logs ที่ GitHub:
- Repository → Actions → เลือก workflow ล่าสุด

---

## 🎣 วิธีที่ 2: GitHub Webhook

### ข้อดี
- ✅ Deploy เร็วกว่า (ไม่ต้องรอ GitHub Actions)
- ✅ ควบคุมได้เต็มที่

### ข้อเสีย
- ⚠️ ต้องเปิด port 9000
- ⚠️ ต้องดูแล webhook server

### ขั้นตอนการตั้งค่า

#### 1. ตั้งค่า Webhook Server บน Server

```bash
# SSH เข้า server
ssh ubuntu@164.115.41.34

# ไปที่ project directory
cd /home/ubuntu/thai-music-platform

# สร้าง webhook secret
WEBHOOK_SECRET=$(openssl rand -hex 32)
echo "WEBHOOK_SECRET=$WEBHOOK_SECRET" >> .env.production
echo "Webhook Secret: $WEBHOOK_SECRET"
# เก็บ secret นี้ไว้ใช้ใน GitHub

# Start webhook server with PM2
pm2 start webhook-deploy.js --name webhook-deploy
pm2 save
```

#### 2. เปิด Port 9000 บน Firewall

```bash
# เปิด port 9000
sudo ufw allow 9000/tcp

# ตรวจสอบ
sudo ufw status
```

#### 3. ตั้งค่า Nginx Reverse Proxy (Optional แต่แนะนำ)

```bash
# แก้ไข Nginx config
sudo nano /etc/nginx/sites-available/thai-music
```

เพิ่มส่วนนี้:
```nginx
# Webhook endpoint
location /webhook {
    proxy_pass http://localhost:9000/webhook;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

```bash
# ทดสอบและ reload
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. ตั้งค่า GitHub Webhook

ไปที่ GitHub repository:
1. Settings → Webhooks → Add webhook
2. ตั้งค่าดังนี้:

| Field | Value |
|-------|-------|
| Payload URL | `http://164.115.41.34:9000/webhook` หรือ `http://164.115.41.34/webhook` (ถ้าใช้ Nginx) |
| Content type | `application/json` |
| Secret | (webhook secret จากขั้นตอนที่ 1) |
| Which events | Just the push event |
| Active | ✓ เลือก |

3. คลิก "Add webhook"

#### 5. ทดสอบ Webhook

```bash
# ดู logs ของ webhook server
pm2 logs webhook-deploy

# บน local machine - push code
git add .
git commit -m "Test webhook deploy"
git push origin main

# ดู logs บน server
pm2 logs webhook-deploy
pm2 logs thai-music
```

---

## 🔄 Workflow การ Deploy

### GitHub Actions Workflow

```
1. Developer push code ไป GitHub
   ↓
2. GitHub Actions trigger
   ↓
3. GitHub Actions SSH เข้า server
   ↓
4. Server pull code จาก GitHub
   ↓
5. Server build และ restart
   ↓
6. ✅ Deploy เสร็จสิ้น
```

### Webhook Workflow

```
1. Developer push code ไป GitHub
   ↓
2. GitHub ส่ง webhook ไป server
   ↓
3. Webhook server รับ request
   ↓
4. Server pull code จาก GitHub
   ↓
5. Server build และ restart
   ↓
6. ✅ Deploy เสร็จสิ้น
```

---

## 🧪 การทดสอบ

### ทดสอบ GitHub Actions

```bash
# บน local machine
echo "# Test" >> README.md
git add README.md
git commit -m "Test GitHub Actions deploy"
git push origin main

# ดู logs ที่ GitHub
# Repository → Actions → เลือก workflow ล่าสุด
```

### ทดสอบ Webhook

```bash
# ทดสอบ webhook endpoint
curl http://164.115.41.34:9000/health

# ดู logs
ssh ubuntu@164.115.41.34 'pm2 logs webhook-deploy'

# Push code
git add .
git commit -m "Test webhook"
git push origin main
```

---

## 📊 Monitoring

### ตรวจสอบ GitHub Actions

1. ไปที่ GitHub repository
2. คลิก "Actions" tab
3. ดู workflow runs ล่าสุด

### ตรวจสอบ Webhook Server

```bash
# ดู status
ssh ubuntu@164.115.41.34 'pm2 status'

# ดู logs
ssh ubuntu@164.115.41.34 'pm2 logs webhook-deploy'

# Restart webhook server
ssh ubuntu@164.115.41.34 'pm2 restart webhook-deploy'
```

### ตรวจสอบ Application

```bash
# ดู status
ssh ubuntu@164.115.41.34 'pm2 status'

# ดู logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music'

# ทดสอบ application
curl http://164.115.41.34/api/health
```

---

## 🆘 Troubleshooting

### GitHub Actions ไม่ทำงาน

**ปัญหา**: Workflow ไม่ trigger

**วิธีแก้**:
1. ตรวจสอบว่า push ไป branch ที่ถูกต้อง (main หรือ master)
2. ตรวจสอบ GitHub Secrets ว่าตั้งค่าครบ
3. ลอง trigger manual: Actions → เลือก workflow → Run workflow

**ปัญหา**: SSH connection failed

**วิธีแก้**:
1. ตรวจสอบ SSH_PRIVATE_KEY ใน GitHub Secrets
2. ตรวจสอบว่า public key อยู่ใน `~/.ssh/authorized_keys` บน server
3. ทดสอบ SSH จาก local: `ssh -i ~/.ssh/id_ed25519 ubuntu@164.115.41.34`

### Webhook ไม่ทำงาน

**ปัญหา**: Webhook ไม่ได้รับ request

**วิธีแก้**:
1. ตรวจสอบว่า webhook server ทำงานอยู่: `pm2 status`
2. ตรวจสอบ port 9000 เปิดอยู่: `sudo ufw status`
3. ทดสอบ endpoint: `curl http://164.115.41.34:9000/health`
4. ดู logs: `pm2 logs webhook-deploy`

**ปัญหา**: Invalid signature

**วิธีแก้**:
1. ตรวจสอบ WEBHOOK_SECRET ใน .env.production
2. ตรวจสอบ Secret ใน GitHub webhook settings
3. ต้องตรงกันทั้ง 2 ที่

### Deploy ล้มเหลว

**ปัญหา**: Build failed

**วิธีแก้**:
```bash
# SSH เข้า server
ssh ubuntu@164.115.41.34
cd /home/ubuntu/thai-music-platform

# ลอง build manual
npm run build

# ดู error logs
pm2 logs thai-music --lines 100
```

**ปัญหา**: Git pull failed

**วิธีแก้**:
```bash
# ตรวจสอบ git status
cd /home/ubuntu/thai-music-platform
git status

# ถ้ามี uncommitted changes
git stash
git pull origin main
```

---

## 🔒 Security Best Practices

### 1. ใช้ SSH Key แทน Password
```bash
# สร้าง SSH key ที่มีความปลอดภัยสูง
ssh-keygen -t ed25519 -C "deploy-key"
```

### 2. ตั้งค่า Webhook Secret
```bash
# สร้าง strong secret
openssl rand -hex 32
```

### 3. จำกัด IP ที่เข้าถึง Webhook (Optional)
```nginx
# ใน Nginx config
location /webhook {
    # อนุญาตเฉพาะ GitHub IPs
    allow 140.82.112.0/20;
    allow 143.55.64.0/20;
    deny all;
    
    proxy_pass http://localhost:9000/webhook;
}
```

### 4. ใช้ HTTPS
- ติดตั้ง SSL certificate
- เปลี่ยน webhook URL เป็น HTTPS

---

## 📝 Checklist

### Setup ครั้งแรก
- [ ] Clone repository บน server
- [ ] ตั้งค่า .env.production
- [ ] Build และ start application
- [ ] ตั้งค่า PM2 startup

### GitHub Actions
- [ ] สร้าง SSH key บน server
- [ ] เพิ่ม GitHub Secrets
- [ ] ทดสอบ push code
- [ ] ตรวจสอบ workflow logs

### Webhook (Optional)
- [ ] Start webhook server
- [ ] เปิด port 9000
- [ ] ตั้งค่า GitHub webhook
- [ ] ทดสอบ webhook

---

## 🎯 สรุป

**แนะนำใช้**: GitHub Actions (วิธีที่ 1)
- ปลอดภัยกว่า
- ไม่ต้องเปิด port เพิ่ม
- มี logs ใน GitHub

**ใช้ Webhook เมื่อ**:
- ต้องการ deploy เร็วมาก
- ต้องการควบคุมเต็มที่
- มี custom logic ในการ deploy

---

## 📞 Quick Commands

```bash
# ดู GitHub Actions logs
# ไปที่ GitHub → Actions

# ดู webhook logs
ssh ubuntu@164.115.41.34 'pm2 logs webhook-deploy'

# ดู application logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music'

# Restart webhook
ssh ubuntu@164.115.41.34 'pm2 restart webhook-deploy'

# Restart application
ssh ubuntu@164.115.41.34 'pm2 restart thai-music'

# Manual deploy
ssh ubuntu@164.115.41.34 'cd /home/ubuntu/thai-music-platform && ./deploy.sh'
```

---

**หมายเหตุ**: อย่าลืมเปลี่ยน `YOUR_USERNAME/YOUR_REPO` เป็น repository จริงของคุณ!
