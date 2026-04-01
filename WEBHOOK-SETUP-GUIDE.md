# คู่มือติดตั้ง GitHub Webhook Auto Deploy

## สถานการณ์ปัจจุบัน

- ✅ Webhook server (`webhook-deploy.js`) กำลังทำงานบน PM2 (pid: 111568)
- ✅ Server ฟังที่ port 9000
- ⚠️ ยังไม่มี WEBHOOK_SECRET ใน `.env.production`
- ⚠️ Nginx ยังไม่ได้ตั้งค่า reverse proxy
- ⚠️ GitHub webhook ยังไม่ได้ตั้งค่า

## ขั้นตอนการติดตั้ง

### 1. สร้าง WEBHOOK_SECRET บน Server

SSH เข้า server และรันคำสั่ง:

```bash
cd /var/www/thai-music-platform

# สร้าง secret key แบบสุ่ม
WEBHOOK_SECRET=$(openssl rand -hex 32)

# เพิ่มเข้า .env.production
echo "WEBHOOK_SECRET=$WEBHOOK_SECRET" >> .env.production

# แสดง secret (เก็บไว้สำหรับตั้งค่า GitHub)
echo ""
echo "🔑 Webhook Secret:"
echo "$WEBHOOK_SECRET"
echo ""
echo "⚠️  เก็บ secret นี้ไว้ จะใช้ตั้งค่า GitHub webhook"
```

### 2. Restart Webhook Server

```bash
# Restart เพื่อโหลด WEBHOOK_SECRET ใหม่
pm2 restart webhook-deploy

# ตรวจสอบ logs
pm2 logs webhook-deploy --lines 20
```

คุณควรเห็น: `✓ Custom secret configured` (ไม่ใช่ warning)

### 3. ตั้งค่า Nginx Reverse Proxy

#### 3.1 หา Nginx config file

```bash
# ตรวจสอบว่ามี config file ไหนบ้าง
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/
```

#### 3.2 แก้ไข Nginx config

เปิดไฟล์ config (อาจเป็น `dcpschool100.net` หรือ `default`):

```bash
sudo nano /etc/nginx/sites-available/dcpschool100.net
```

#### 3.3 เพิ่ม location block สำหรับ webhook

เพิ่มใน `server` block ที่มี SSL (port 443):

```nginx
server {
    listen 443 ssl http2;
    server_name dcpschool100.net www.dcpschool100.net;
    
    # ... SSL certificates ...
    
    # Webhook endpoint
    location /webhook {
        proxy_pass http://localhost:9000/webhook;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # GitHub webhook headers
        proxy_set_header X-Hub-Signature-256 $http_x_hub_signature_256;
        proxy_set_header X-GitHub-Event $http_x_github_event;
        proxy_set_header X-GitHub-Delivery $http_x_github_delivery;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # ... rest of config ...
}
```

#### 3.4 ทดสอบและ reload Nginx

```bash
# ทดสอบ config
sudo nginx -t

# ถ้าผ่าน ให้ reload
sudo systemctl reload nginx

# ตรวจสอบสถานะ
sudo systemctl status nginx
```

### 4. ทดสอบ Webhook Endpoint

```bash
# ทดสอบจากภายใน server
curl -X POST http://localhost:9000/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/test"}'

# ทดสอบผ่าน HTTPS (จากเครื่องอื่น)
curl -X POST https://dcpschool100.net/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/test"}'
```

ตรวจสอบ logs:

```bash
pm2 logs webhook-deploy --lines 20
```

### 5. ตั้งค่า GitHub Webhook

#### 5.1 ไปที่ GitHub Repository Settings

```
https://github.com/9golfy/thai-music-platform/settings/hooks
```

#### 5.2 คลิก "Add webhook"

#### 5.3 กรอกข้อมูล

- **Payload URL**: `https://dcpschool100.net/webhook`
- **Content type**: `application/json`
- **Secret**: (ใส่ WEBHOOK_SECRET จากขั้นตอนที่ 1)
- **Which events**: เลือก "Just the push event"
- **Active**: ✅ เลือก

#### 5.4 คลิก "Add webhook"

### 6. ทดสอบ Auto Deploy

#### 6.1 แก้ไข README.md

```bash
# บนเครื่องของคุณ
echo "Test auto deploy - $(date)" >> README.md
git add README.md
git commit -m "Test: Auto deploy webhook"
git push origin master
```

#### 6.2 ตรวจสอบ GitHub Webhook

ไปที่: `https://github.com/9golfy/thai-music-platform/settings/hooks`

- คลิกที่ webhook ที่สร้าง
- ดูที่ "Recent Deliveries"
- ควรเห็น request ที่ส่งไป และ response 200

#### 6.3 ตรวจสอบ Server Logs

```bash
# ดู webhook logs
pm2 logs webhook-deploy --lines 50

# ดู application logs
pm2 logs thai-music-platform --lines 50

# ตรวจสอบสถานะ
pm2 status
```

## การแก้ปัญหา

### ปัญหา: Webhook ไม่ทำงาน

```bash
# 1. ตรวจสอบว่า webhook server ทำงานอยู่
pm2 status webhook-deploy

# 2. ตรวจสอบ logs
pm2 logs webhook-deploy --lines 50

# 3. ทดสอบ endpoint
curl http://localhost:9000/health

# 4. ตรวจสอบ Nginx
sudo nginx -t
sudo systemctl status nginx
```

### ปัญหา: Invalid signature

```bash
# ตรวจสอบว่า WEBHOOK_SECRET ตรงกันระหว่าง:
# 1. Server (.env.production)
cat /var/www/thai-music-platform/.env.production | grep WEBHOOK_SECRET

# 2. GitHub webhook settings
# ไปดูที่ GitHub webhook settings
```

### ปัญหา: Deploy ล้มเหลว

```bash
# ตรวจสอบ git status
cd /var/www/thai-music-platform
git status
git log -1

# ลอง deploy manual
./deploy.sh

# ตรวจสอบ permissions
ls -la /var/www/thai-music-platform
```

## ข้อมูลสำคัญ

- **Server**: 164.115.41.34
- **User**: root
- **Project Path**: `/var/www/thai-music-platform`
- **Domain**: https://dcpschool100.net/
- **Webhook Port**: 9000
- **Webhook URL**: https://dcpschool100.net/webhook
- **PM2 App Names**: 
  - `webhook-deploy` (webhook server)
  - `thai-music-platform` (main app)
- **Branch**: master

## คำสั่งที่มีประโยชน์

```bash
# ดู webhook logs แบบ real-time
pm2 logs webhook-deploy

# Restart webhook server
pm2 restart webhook-deploy

# ดูสถานะทั้งหมด
pm2 status

# Deploy manual
cd /var/www/thai-music-platform
./deploy.sh

# ตรวจสอบ Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## ทำไมต้องใช้ Webhook แทน GitHub Actions SSH?

GitHub Actions ไม่สามารถ SSH เข้า server ได้เพราะ:
- Firewall บล็อก GitHub Actions IP ranges
- Network policy ไม่อนุญาตให้ external SSH

วิธี Webhook:
- ✅ Server เปิด HTTPS port 443 อยู่แล้ว
- ✅ ไม่ต้องเปิด SSH port ให้ external
- ✅ ปลอดภัยกว่า (ใช้ signature verification)
- ✅ ทำงานผ่าน Nginx reverse proxy
