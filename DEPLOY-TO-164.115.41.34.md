# คู่มือ Deploy ไปที่ Server 164.115.41.34

## 📋 ข้อมูล Server

- **IP Address**: 164.115.41.34
- **OS**: Ubuntu 20.04 LTS (สันนิษฐาน)
- **User**: ubuntu
- **App Directory**: /home/ubuntu/thai-music-platform

---

## 🚀 วิธีการ Deploy

### วิธีที่ 1: ใช้สคริปต์อัตโนมัติ (แนะนำ)

```bash
# ให้สิทธิ์ execute
chmod +x deploy-to-server.sh

# Run deployment
./deploy-to-server.sh
```

สคริปต์จะทำงานดังนี้:
1. ✅ ทดสอบ SSH connection
2. ✅ Pull code ล่าสุดจาก git
3. ✅ ติดตั้ง dependencies
4. ✅ Build application
5. ✅ Restart PM2
6. ✅ Reload Nginx
7. ✅ แสดง logs

---

### วิธีที่ 2: Deploy ด้วยมือ (Manual)

#### 1. SSH เข้า Server
```bash
ssh ubuntu@164.115.41.34
```

#### 2. ไปที่ App Directory
```bash
cd /home/ubuntu/thai-music-platform
```

#### 3. Pull Code ล่าสุด
```bash
git pull origin main
```

#### 4. ติดตั้ง Dependencies
```bash
npm ci --only=production
```

#### 5. Build Application
```bash
npm run build
```

#### 6. Restart Application
```bash
pm2 restart thai-music
# หรือถ้ายังไม่มี
pm2 start npm --name thai-music -- start
pm2 save
```

#### 7. Reload Nginx
```bash
sudo systemctl reload nginx
```

#### 8. ตรวจสอบ Status
```bash
pm2 status
pm2 logs thai-music --lines 50
```

---

## 🔧 การตั้งค่าครั้งแรก (First Time Setup)

### 1. เตรียม Server

```bash
# SSH เข้า server
ssh ubuntu@164.115.41.34

# อัพเดทระบบ
sudo apt update && sudo apt upgrade -y

# ติดตั้ง Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# ติดตั้ง PM2
sudo npm install -g pm2

# ติดตั้ง Git (ถ้ายังไม่มี)
sudo apt install -y git
```

### 2. Clone Repository

```bash
cd /home/ubuntu
git clone YOUR_REPOSITORY_URL thai-music-platform
cd thai-music-platform
```

### 3. ตั้งค่า Environment Variables

```bash
# สร้าง .env.production
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

### 4. ติดตั้ง MongoDB

```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install
sudo apt update
sudo apt install -y mongodb-org

# Start and enable
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 5. ติดตั้งและตั้งค่า Nginx

```bash
# ติดตั้ง Nginx
sudo apt install -y nginx nginx-extras

# คัดลอก config
sudo cp nginx.conf.example /etc/nginx/sites-available/thai-music

# แก้ไขไฟล์
sudo nano /etc/nginx/sites-available/thai-music
```

แก้ไข:
- `your-domain.com` → `164.115.41.34` หรือโดเมนจริง
- ลบส่วน SSL ออกก่อน (ถ้ายังไม่มี certificate)

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/thai-music /etc/nginx/sites-enabled/

# ลบ default site
sudo rm /etc/nginx/sites-enabled/default

# ทดสอบ config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 6. Build และ Start Application

```bash
cd /home/ubuntu/thai-music-platform

# ติดตั้ง dependencies
npm ci --only=production

# Build
npm run build

# Start with PM2
pm2 start npm --name thai-music -- start

# Save PM2 config
pm2 save

# Setup PM2 startup
pm2 startup
# ทำตามคำสั่งที่แสดง
```

### 7. ตั้งค่า Firewall

```bash
# เปิด ports ที่จำเป็น
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 🔒 ติดตั้ง SSL Certificate (Optional แต่แนะนำ)

### ถ้ามีโดเมน

```bash
# ติดตั้ง Certbot
sudo apt install -y certbot python3-certbot-nginx

# ขอ certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# ทดสอบ auto-renewal
sudo certbot renew --dry-run
```

### ถ้าใช้ IP เท่านั้น

ไม่สามารถใช้ Let's Encrypt ได้ ต้องใช้:
1. Self-signed certificate (สำหรับทดสอบ)
2. ซื้อ SSL certificate จาก CA
3. ใช้ Cloudflare (ฟรี)

---

## 🧪 ทดสอบหลัง Deploy

### 1. ทดสอบ Application

```bash
# ทดสอบ health check
curl http://164.115.41.34/api/health

# ทดสอบ main page
curl -I http://164.115.41.34
```

### 2. ทดสอบ Security (ถ้ามี HTTPS)

```bash
# ใช้สคริปต์
chmod +x test-security.sh
./test-security.sh your-domain.com
```

### 3. ตรวจสอบ Logs

```bash
# PM2 logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music --lines 50'

# Nginx logs
ssh ubuntu@164.115.41.34 'sudo tail -f /var/log/nginx/access.log'
ssh ubuntu@164.115.41.34 'sudo tail -f /var/log/nginx/error.log'
```

---

## 📊 Monitoring

### ตรวจสอบ Status

```bash
# Application status
ssh ubuntu@164.115.41.34 'pm2 status'

# Nginx status
ssh ubuntu@164.115.41.34 'sudo systemctl status nginx'

# MongoDB status
ssh ubuntu@164.115.41.34 'sudo systemctl status mongod'

# Disk space
ssh ubuntu@164.115.41.34 'df -h'

# Memory usage
ssh ubuntu@164.115.41.34 'free -h'
```

### ดู Logs

```bash
# Application logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music'

# Nginx access logs
ssh ubuntu@164.115.41.34 'sudo tail -f /var/log/nginx/access.log'

# Nginx error logs
ssh ubuntu@164.115.41.34 'sudo tail -f /var/log/nginx/error.log'

# MongoDB logs
ssh ubuntu@164.115.41.34 'sudo tail -f /var/log/mongodb/mongod.log'
```

---

## 🔄 การอัพเดท Application

### วิธีที่ 1: ใช้สคริปต์
```bash
./deploy-to-server.sh
```

### วิธีที่ 2: Manual
```bash
ssh ubuntu@164.115.41.34
cd /home/ubuntu/thai-music-platform
git pull origin main
npm ci --only=production
npm run build
pm2 restart thai-music
```

---

## 💾 Backup

### Backup MongoDB

```bash
# SSH เข้า server
ssh ubuntu@164.115.41.34

# Backup database
mongodump --uri="mongodb://admin:password@localhost:27017/thai_music_school_prod?authSource=admin" --out=/home/ubuntu/backups/mongodb/$(date +%Y%m%d)

# Compress backup
tar -czf /home/ubuntu/backups/mongodb-$(date +%Y%m%d).tar.gz /home/ubuntu/backups/mongodb/$(date +%Y%m%d)
```

### Backup Application Files

```bash
# Backup uploaded files
ssh ubuntu@164.115.41.34 'tar -czf /home/ubuntu/backups/app-files-$(date +%Y%m%d).tar.gz /home/ubuntu/thai-music-platform/public/uploads'
```

### ตั้งค่า Auto Backup (Cron)

```bash
# SSH เข้า server
ssh ubuntu@164.115.41.34

# Edit crontab
crontab -e

# เพิ่มบรรทัดนี้ (backup ทุกวันเวลา 2:00 AM)
0 2 * * * mongodump --uri="mongodb://admin:password@localhost:27017/thai_music_school_prod?authSource=admin" --out=/home/ubuntu/backups/mongodb/$(date +\%Y\%m\%d) && tar -czf /home/ubuntu/backups/mongodb-$(date +\%Y\%m\%d).tar.gz /home/ubuntu/backups/mongodb/$(date +\%Y\%m\%d) && find /home/ubuntu/backups -name "mongodb-*.tar.gz" -mtime +7 -delete
```

---

## 🆘 Troubleshooting

### Application ไม่ start

```bash
# ตรวจสอบ logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music --lines 100'

# ตรวจสอบ port
ssh ubuntu@164.115.41.34 'sudo netstat -tulpn | grep :3000'

# Restart
ssh ubuntu@164.115.41.34 'pm2 restart thai-music'
```

### Nginx error

```bash
# ตรวจสอบ config
ssh ubuntu@164.115.41.34 'sudo nginx -t'

# ตรวจสอบ logs
ssh ubuntu@164.115.41.34 'sudo tail -f /var/log/nginx/error.log'

# Restart
ssh ubuntu@164.115.41.34 'sudo systemctl restart nginx'
```

### MongoDB connection error

```bash
# ตรวจสอบ status
ssh ubuntu@164.115.41.34 'sudo systemctl status mongod'

# Restart
ssh ubuntu@164.115.41.34 'sudo systemctl restart mongod'

# ตรวจสอบ connection
ssh ubuntu@164.115.41.34 'mongosh "mongodb://admin:password@localhost:27017/thai_music_school_prod?authSource=admin"'
```

---

## 📝 Checklist

### ก่อน Deploy ครั้งแรก
- [ ] Server มี Node.js 20.x
- [ ] Server มี MongoDB 7.x
- [ ] Server มี Nginx
- [ ] Server มี PM2
- [ ] Clone repository แล้ว
- [ ] ตั้งค่า .env.production แล้ว
- [ ] ตั้งค่า Nginx config แล้ว
- [ ] เปิด firewall ports แล้ว

### ทุกครั้งที่ Deploy
- [ ] Pull code ล่าสุด
- [ ] ติดตั้ง dependencies
- [ ] Build application
- [ ] Restart PM2
- [ ] Reload Nginx
- [ ] ทดสอบ application
- [ ] ตรวจสอบ logs

---

## 🎯 URLs

- **Application**: http://164.115.41.34
- **API Health Check**: http://164.115.41.34/api/health
- **Admin Dashboard**: http://164.115.41.34/dashboard

---

## 📞 Quick Commands

```bash
# Deploy
./deploy-to-server.sh

# SSH to server
ssh ubuntu@164.115.41.34

# View logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music'

# Restart app
ssh ubuntu@164.115.41.34 'pm2 restart thai-music'

# Check status
ssh ubuntu@164.115.41.34 'pm2 status'

# Reload Nginx
ssh ubuntu@164.115.41.34 'sudo systemctl reload nginx'
```

---

**หมายเหตุ**: อย่าลืมเปลี่ยน passwords และ secrets ทั้งหมดก่อน deploy production!
