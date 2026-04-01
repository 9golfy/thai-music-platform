# Ubuntu 24.04 Server Setup Guide
## Thai Music Platform Deployment

Server IP: 164.115.41.34
OS: Ubuntu 24.04.2 LTS

---

## 1. อัพเดทระบบ

```bash
# อัพเดท package list
sudo apt update

# อัพเกรด packages ที่มีอยู่
sudo apt upgrade -y

# ติดตั้ง essential tools
sudo apt install -y curl wget git build-essential
```

---

## 2. ติดตั้ง Node.js (v20 LTS)

```bash
# ติดตั้ง Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# ตรวจสอบเวอร์ชัน
node --version  # ควรได้ v20.x.x
npm --version   # ควรได้ v10.x.x
```

---

## 3. ติดตั้ง MongoDB 7.0

```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# สร้าง list file สำหรับ MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# อัพเดทและติดตั้ง MongoDB
sudo apt update
sudo apt install -y mongodb-org

# เริ่มต้น MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# ตรวจสอบสถานะ
sudo systemctl status mongod

# ตรวจสอบเวอร์ชัน
mongod --version
```

---

## 4. ตั้งค่า MongoDB Security

```bash
# เข้าสู่ MongoDB shell
mongosh

# สร้าง admin user (ใน mongosh)
use admin
db.createUser({
  user: "root",
  pwd: "rootpass",
  roles: [ { role: "root", db: "admin" } ]
})

# สร้าง database และ user สำหรับ application
use thai_music_school
db.createUser({
  user: "thaimusic_user",
  pwd: "your_secure_password_here",
  roles: [ { role: "readWrite", db: "thai_music_school" } ]
})

# ออกจาก mongosh
exit
```

```bash
# แก้ไข MongoDB config เพื่อเปิด authentication
sudo nano /etc/mongod.conf

# เพิ่ม/แก้ไขบรรทัดนี้:
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod
```

---

## 5. ติดตั้ง PM2 (Process Manager)

```bash
# ติดตั้ง PM2 globally
sudo npm install -g pm2

# ตั้งค่าให้ PM2 เริ่มต้นอัตโนมัติเมื่อ reboot
pm2 startup systemd
# (รันคำสั่งที่ PM2 แสดงให้)

# ตรวจสอบเวอร์ชัน
pm2 --version
```

---

## 6. ติดตั้ง Nginx (Reverse Proxy)

```bash
# ติดตั้ง Nginx
sudo apt install -y nginx

# เริ่มต้น Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# ตรวจสอบสถานะ
sudo systemctl status nginx

# อนุญาต Nginx ผ่าน firewall
sudo ufw allow 'Nginx Full'
```

---

## 7. Clone Project จาก GitHub

```bash
# สร้าง directory สำหรับ application
sudo mkdir -p /var/www
cd /var/www

# Clone repository
sudo git clone https://github.com/9golfy/thai-music-platform.git
cd thai-music-platform

# เปลี่ยน ownership
sudo chown -R $USER:$USER /var/www/thai-music-platform
```

---

## 8. ตั้งค่า Environment Variables

```bash
# สร้างไฟล์ .env.production
nano .env.production
```

เพิ่มเนื้อหาต่อไปนี้:

```env
# MongoDB Connection
MONGODB_URI=mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin
MONGO_DB=thai_music_school

# Application
NODE_ENV=production
PORT=3000

# Session Secret (สร้าง random string)
SESSION_SECRET=your_very_long_random_secret_key_here

# Email Configuration (ถ้ามี)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Base URL
NEXT_PUBLIC_BASE_URL=http://164.115.41.34:3000
```

---

## 9. ติดตั้ง Dependencies และ Build

```bash
cd /var/www/thai-music-platform

# ติดตั้ง dependencies
npm install

# Build production
npm run build

# ทดสอบรัน
npm start
# กด Ctrl+C เพื่อหยุด
```

---

## 10. ตั้งค่า PM2 สำหรับ Production

```bash
# สร้างไฟล์ PM2 ecosystem
nano ecosystem.config.js
```

เพิ่มเนื้อหา:

```javascript
module.exports = {
  apps: [{
    name: 'thai-music-platform',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/thai-music-platform',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

```bash
# เริ่มต้น application ด้วย PM2
pm2 start ecosystem.config.js

# บันทึก PM2 process list
pm2 save

# ดู logs
pm2 logs thai-music-platform

# ดูสถานะ
pm2 status
```

---

## 11. ตั้งค่า Nginx Reverse Proxy (Optional)

```bash
# สร้าง Nginx config
sudo nano /etc/nginx/sites-available/thai-music-platform
```

เพิ่มเนื้อหา:

```nginx
server {
    listen 80;
    server_name 164.115.41.34;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/thai-music-platform /etc/nginx/sites-enabled/

# ทดสอบ config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 12. ตั้งค่า Firewall

```bash
# เปิดใช้งาน UFW
sudo ufw enable

# อนุญาต SSH
sudo ufw allow 22/tcp

# อนุญาต HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# อนุญาต port 3000 (ถ้าไม่ใช้ Nginx)
sudo ufw allow 3000/tcp

# ตรวจสอบสถานะ
sudo ufw status
```

---

## 13. คำสั่งที่มีประโยชน์

### PM2 Commands
```bash
# ดูสถานะ
pm2 status

# ดู logs
pm2 logs thai-music-platform

# Restart application
pm2 restart thai-music-platform

# Stop application
pm2 stop thai-music-platform

# Delete from PM2
pm2 delete thai-music-platform

# Monitor
pm2 monit
```

### MongoDB Commands
```bash
# เข้า MongoDB shell
mongosh -u root -p rootpass --authenticationDatabase admin

# Backup database
mongodump --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" --out=/backup/mongodb

# Restore database
mongorestore --uri="mongodb://root:rootpass@localhost:27017/thai_music_school?authSource=admin" /backup/mongodb/thai_music_school
```

### Git Commands
```bash
# Pull latest code
cd /var/www/thai-music-platform
git pull origin master

# Rebuild and restart
npm install
npm run build
pm2 restart thai-music-platform
```

### System Commands
```bash
# ดู disk usage
df -h

# ดู memory usage
free -h

# ดู running processes
htop  # (ติดตั้งด้วย: sudo apt install htop)

# ดู logs
sudo journalctl -u mongod -f  # MongoDB logs
sudo tail -f /var/log/nginx/error.log  # Nginx error logs
```

---

## 14. Security Best Practices

```bash
# เปลี่ยน SSH port (optional)
sudo nano /etc/ssh/sshd_config
# เปลี่ยน Port 22 เป็นเลขอื่น

# ปิด root login
sudo nano /etc/ssh/sshd_config
# ตั้ง PermitRootLogin no

# Restart SSH
sudo systemctl restart sshd

# ติดตั้ง fail2ban
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 15. Monitoring และ Maintenance

```bash
# ตั้งค่า automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# ติดตั้ง monitoring tools
sudo apt install -y htop iotop nethogs

# Setup log rotation
sudo nano /etc/logrotate.d/thai-music-platform
```

---

## 16. SSL Certificate (ถ้ามี Domain)

```bash
# ติดตั้ง Certbot
sudo apt install -y certbot python3-certbot-nginx

# ขอ SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## Troubleshooting

### ถ้า MongoDB ไม่เริ่มต้น
```bash
sudo systemctl status mongod
sudo journalctl -u mongod -n 50
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
sudo systemctl restart mongod
```

### ถ้า Next.js build ล้มเหลว
```bash
# ลบ cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### ถ้า PM2 ไม่ทำงาน
```bash
pm2 kill
pm2 start ecosystem.config.js
pm2 save
```

---

## Quick Start Commands (สรุป)

```bash
# 1. อัพเดทระบบ
sudo apt update && sudo apt upgrade -y

# 2. ติดตั้ง Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. ติดตั้ง MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl start mongod && sudo systemctl enable mongod

# 4. ติดตั้ง PM2
sudo npm install -g pm2

# 5. Clone project
cd /var/www
sudo git clone https://github.com/9golfy/thai-music-platform.git
cd thai-music-platform
sudo chown -R $USER:$USER /var/www/thai-music-platform

# 6. Setup และ deploy
npm install
# สร้างไฟล์ .env.production
npm run build
pm2 start ecosystem.config.js
pm2 save
```

---

## เข้าถึง Application

- **Direct Access**: http://164.115.41.34:3000
- **With Nginx**: http://164.115.41.34

---

## Support

หากมีปัญหาในการติดตั้ง:
1. ตรวจสอบ logs: `pm2 logs`
2. ตรวจสอบ MongoDB: `sudo systemctl status mongod`
3. ตรวจสอบ Nginx: `sudo nginx -t`
4. ตรวจสอบ firewall: `sudo ufw status`
