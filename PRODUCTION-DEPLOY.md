# คู่มือ Deploy Production แบบปลอดภัย

## 📋 เตรียมความพร้อม

### ความต้องการของระบบ
- Ubuntu 20.04 LTS หรือใหม่กว่า
- Node.js 20.x
- Nginx
- MongoDB 7.x
- SSL Certificate (Let's Encrypt)
- โดเมนที่ชี้มาที่ server แล้ว

---

## 🔐 ขั้นตอนที่ 1: เตรียม Environment Variables

```bash
# 1. คัดลอกไฟล์ตัวอย่าง
cp .env.production.example .env.production

# 2. สร้าง strong passwords
openssl rand -base64 24  # สำหรับ MongoDB
openssl rand -base64 32  # สำหรับ JWT

# 3. แก้ไขไฟล์ .env.production
nano .env.production
```

แก้ไขค่าต่อไปนี้:
- `MONGO_ROOT_PASSWORD` - รหัสผ่าน MongoDB
- `JWT_SECRET` - JWT secret key
- `GMAIL_USER` - อีเมลสำหรับส่งเมล
- `GMAIL_APP_PASSWORD` - Gmail app password
- `NEXT_PUBLIC_APP_URL` - URL ของเว็บไซต์

---

## 🚀 ขั้นตอนที่ 2: ติดตั้งและตั้งค่า Server

### 2.1 อัพเดทระบบ
```bash
sudo apt update
sudo apt upgrade -y
```

### 2.2 ติดตั้ง Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # ตรวจสอบเวอร์ชัน
```

### 2.3 ติดตั้ง MongoDB
```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2.4 ติดตั้ง Nginx และ Security Tools
```bash
chmod +x setup-security.sh
sudo ./setup-security.sh
```

---

## 🏗️ ขั้นตอนที่ 3: Build และ Deploy Application

### 3.1 Clone และ Build
```bash
# Clone repository
git clone https://github.com/your-repo/thai-music-platform.git
cd thai-music-platform

# ติดตั้ง dependencies
npm ci --only=production

# Build application
npm run build
```

### 3.2 ติดตั้ง PM2 (Process Manager)
```bash
sudo npm install -g pm2

# Start application
pm2 start npm --name "thai-music" -- start

# ตั้งค่า auto-start
pm2 startup
pm2 save
```

---

## 🔒 ขั้นตอนที่ 4: ตั้งค่า Nginx และ SSL

### 4.1 คัดลอก Nginx Config
```bash
# คัดลอกไฟล์ตัวอย่าง
sudo cp nginx.conf.example /etc/nginx/sites-available/your-domain

# แก้ไขไฟล์
sudo nano /etc/nginx/sites-available/your-domain
```

แก้ไขค่าต่อไปนี้:
- `your-domain.com` → โดเมนจริงของคุณ
- `/path/to/ssl/` → path ของ SSL certificate

### 4.2 Enable Site
```bash
# สร้าง symlink
sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/

# ลบ default site (ถ้ามี)
sudo rm /etc/nginx/sites-enabled/default

# ทดสอบ config
sudo nginx -t
```

### 4.3 ขอ SSL Certificate
```bash
# ติดตั้ง Certbot (ถ้ายังไม่ได้ติดตั้ง)
sudo apt install -y certbot python3-certbot-nginx

# ขอ certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# ทดสอบ auto-renewal
sudo certbot renew --dry-run
```

### 4.4 Restart Nginx
```bash
sudo systemctl restart nginx
```

---

## 🧪 ขั้นตอนที่ 5: ทดสอบความปลอดภัย

### 5.1 ทดสอบด้วยสคริปต์
```bash
chmod +x test-security.sh
./test-security.sh your-domain.com
```

### 5.2 ทดสอบด้วย Online Tools

1. **SSL Labs** (ควรได้ A หรือ A+)
   ```
   https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
   ```

2. **Security Headers** (ควรได้ A หรือ A+)
   ```
   https://securityheaders.com/?q=your-domain.com
   ```

3. **Mozilla Observatory** (ควรได้ B+ ขึ้นไป)
   ```
   https://observatory.mozilla.org/analyze/your-domain.com
   ```

### 5.3 ทดสอบ Application
```bash
# ทดสอบ health check
curl https://your-domain.com/api/health

# ทดสอบ main page
curl -I https://your-domain.com
```

---

## 📊 ขั้นตอนที่ 6: Monitoring และ Maintenance

### 6.1 ตั้งค่า Monitoring
```bash
# ดู PM2 status
pm2 status

# ดู logs
pm2 logs thai-music

# ดู Nginx logs
sudo tail -f /var/log/nginx/your-domain-access.log
sudo tail -f /var/log/nginx/your-domain-error.log
```

### 6.2 ตั้งค่า Backup
```bash
# Backup MongoDB
mongodump --uri="mongodb://admin:password@localhost:27017/thai_music_school_prod?authSource=admin" --out=/backup/mongodb/$(date +%Y%m%d)

# Backup application files
tar -czf /backup/app/thai-music-$(date +%Y%m%d).tar.gz /path/to/thai-music-platform
```

### 6.3 ตั้งค่า Auto-update SSL
```bash
# Certbot จะ auto-renew อัตโนมัติ แต่ควรตรวจสอบ
sudo systemctl status certbot.timer

# หรือเพิ่ม cron job
sudo crontab -e
# เพิ่มบรรทัดนี้:
0 0 * * * certbot renew --quiet && systemctl reload nginx
```

---

## 🔄 การอัพเดท Application

### วิธีที่ 1: Manual Update
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci --only=production

# Build
npm run build

# Restart
pm2 restart thai-music
```

### วิธีที่ 2: Zero-downtime Update
```bash
# Pull และ build
git pull origin main
npm ci --only=production
npm run build

# Reload PM2 (zero-downtime)
pm2 reload thai-music
```

---

## 🐳 ทางเลือก: Deploy ด้วย Docker

### ข้อดีของ Docker
- แยก environment ได้ชัดเจน
- Deploy ง่ายกว่า
- Rollback ง่าย
- Consistent across environments

### ขั้นตอน Deploy ด้วย Docker
```bash
# 1. Build image
docker build -f Dockerfile.secure -t thai-music-platform:secure .

# 2. Run with docker-compose
docker-compose -f docker-compose.secure.yml up -d

# 3. ตรวจสอบ
docker-compose -f docker-compose.secure.yml ps
docker-compose -f docker-compose.secure.yml logs -f
```

---

## 🆘 Troubleshooting

### ปัญหา: Application ไม่ start
```bash
# ตรวจสอบ logs
pm2 logs thai-music

# ตรวจสอบ port
sudo netstat -tulpn | grep :3000

# Restart
pm2 restart thai-music
```

### ปัญหา: Nginx error
```bash
# ตรวจสอบ config
sudo nginx -t

# ตรวจสอบ logs
sudo tail -f /var/log/nginx/error.log

# Restart
sudo systemctl restart nginx
```

### ปัญหา: MongoDB connection error
```bash
# ตรวจสอบ MongoDB status
sudo systemctl status mongod

# ตรวจสอบ connection
mongosh "mongodb://admin:password@localhost:27017/thai_music_school_prod?authSource=admin"

# Restart MongoDB
sudo systemctl restart mongod
```

### ปัญหา: SSL certificate error
```bash
# ตรวจสอบ certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📋 Checklist ก่อน Go Live

- [ ] Environment variables ตั้งค่าครบถ้วน
- [ ] MongoDB ทำงานปกติ
- [ ] Application build สำเร็จ
- [ ] PM2 start application สำเร็จ
- [ ] Nginx config ถูกต้อง
- [ ] SSL certificate ติดตั้งแล้ว
- [ ] Security headers ครบถ้วน
- [ ] ทดสอบ SSL Labs ได้ A+
- [ ] ทดสอบ Security Headers ได้ A+
- [ ] ทดสอบ application ทำงานปกติ
- [ ] Backup system ตั้งค่าแล้ว
- [ ] Monitoring ตั้งค่าแล้ว
- [ ] Auto-renewal SSL ตั้งค่าแล้ว

---

## 🎯 Performance Optimization (Optional)

### Enable Nginx Caching
```nginx
# เพิ่มใน nginx.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

location / {
    proxy_cache my_cache;
    proxy_cache_valid 200 60m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    # ... proxy settings ...
}
```

### Enable HTTP/2
```nginx
listen 443 ssl http2;
```

### Enable Brotli Compression (ถ้าต้องการ)
```bash
sudo apt install -y nginx-module-brotli
```

---

## 📞 Support

- คู่มือความปลอดภัย: `SECURITY-HEADERS-GUIDE.md`
- คู่มือเริ่มต้นด่วน: `SECURITY-QUICK-START.md`
- สรุปภาษาไทย: `SECURITY-SUMMARY-TH.md`

---

## ✅ สรุป

การ deploy production ที่ปลอดภัยต้องใช้เวลาประมาณ 30-60 นาที รวมทั้ง:
- ติดตั้ง dependencies
- Build application
- ตั้งค่า Nginx และ SSL
- ทดสอบความปลอดภัย

**ผลลัพธ์ที่คาดหวัง**: 
- SSL Labs: A+
- Security Headers: A+
- Application ทำงานปกติ
- Zero security vulnerabilities
