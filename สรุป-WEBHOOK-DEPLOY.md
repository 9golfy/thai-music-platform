# สรุป: ระบบ Auto Deploy ด้วย GitHub Webhook

## 📋 สถานการณ์

### ปัญหาเดิม
- GitHub Actions ไม่สามารถ SSH เข้า server ได้ (timeout error)
- Firewall บล็อก GitHub Actions IP ranges

### วิธีแก้ไข
- ใช้ GitHub Webhook แทน SSH
- Server รับ webhook notification จาก GitHub
- Deploy อัตโนมัติเมื่อมีการ push code

## ✅ สิ่งที่ทำเสร็จแล้ว

1. ✅ แก้ไข `webhook-deploy.js`:
   - เปลี่ยน path เป็น `/var/www/thai-music-platform`
   - เปลี่ยน PM2 app name เป็น `thai-music-platform`

2. ✅ แก้ไข `deploy.sh`:
   - ใช้ path และ app name ที่ถูกต้อง

3. ✅ อัพเดท `.github/workflows/deploy.yml`:
   - เปลี่ยนจาก SSH action เป็น webhook notification

4. ✅ สร้างไฟล์ช่วยเหลือ:
   - `WEBHOOK-SETUP-GUIDE.md` - คู่มือติดตั้งแบบละเอียด
   - `setup-webhook-server.sh` - สคริปต์ติดตั้งอัตโนมัติ
   - `test-webhook.sh` - สคริปต์ทดสอบ webhook

## 🔧 ขั้นตอนติดตั้งบน Server (164.115.41.34)

### วิธีที่ 1: ใช้สคริปต์อัตโนมัติ (แนะนำ)

```bash
# SSH เข้า server
ssh root@164.115.41.34

# ไปที่ project directory
cd /var/www/thai-music-platform

# Pull ไฟล์ใหม่จาก GitHub
git pull origin master

# รันสคริปต์ติดตั้ง
chmod +x setup-webhook-server.sh
./setup-webhook-server.sh
```

สคริปต์จะทำให้อัตโนมัติ:
- สร้าง WEBHOOK_SECRET
- Restart webhook server
- แนะนำวิธีตั้งค่า Nginx
- ทดสอบ endpoint

### วิธีที่ 2: ติดตั้งแบบ Manual

#### 1. สร้าง WEBHOOK_SECRET

```bash
cd /var/www/thai-music-platform

# สร้าง secret
WEBHOOK_SECRET=$(openssl rand -hex 32)
echo "WEBHOOK_SECRET=$WEBHOOK_SECRET" >> .env.production

# แสดง secret (เก็บไว้)
echo "Webhook Secret: $WEBHOOK_SECRET"
```

#### 2. Restart Webhook Server

```bash
pm2 restart webhook-deploy
pm2 logs webhook-deploy --lines 10
```

#### 3. ตั้งค่า Nginx

แก้ไขไฟล์: `/etc/nginx/sites-available/dcpschool100.net`

เพิ่มใน server block (port 443):

```nginx
# Webhook endpoint
location /webhook {
    proxy_pass http://localhost:9000/webhook;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Hub-Signature-256 $http_x_hub_signature_256;
    proxy_set_header X-GitHub-Event $http_x_github_event;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

ทดสอบและ reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. ทดสอบ Webhook

```bash
# ทดสอบ local
curl -X POST http://localhost:9000/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/test"}'

# ทดสอบ HTTPS
curl -X POST https://dcpschool100.net/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/test"}'

# ดู logs
pm2 logs webhook-deploy --lines 20
```

## 🔗 ตั้งค่า GitHub Webhook

1. ไปที่: https://github.com/9golfy/thai-music-platform/settings/hooks

2. คลิก "Add webhook"

3. กรอกข้อมูล:
   - **Payload URL**: `https://dcpschool100.net/webhook`
   - **Content type**: `application/json`
   - **Secret**: (ใส่ WEBHOOK_SECRET จาก server)
   - **Which events**: Just the push event
   - **Active**: ✅

4. คลิก "Add webhook"

## 🧪 ทดสอบ Auto Deploy

### 1. แก้ไขไฟล์ทดสอบ

```bash
# บนเครื่องของคุณ
echo "Test auto deploy - $(date)" >> README.md
git add README.md
git commit -m "Test: Auto deploy webhook"
git push origin master
```

### 2. ตรวจสอบ GitHub

ไปที่: https://github.com/9golfy/thai-music-platform/settings/hooks

- คลิกที่ webhook
- ดู "Recent Deliveries"
- ควรเห็น request และ response 200

### 3. ตรวจสอบ Server

```bash
# SSH เข้า server
ssh root@164.115.41.34

# ดู webhook logs
pm2 logs webhook-deploy --lines 50

# ดู application logs
pm2 logs thai-music-platform --lines 50

# ตรวจสอบสถานะ
pm2 status
```

## 📊 การทำงานของระบบ

```
1. Developer push code
   ↓
2. GitHub รับ push
   ↓
3. GitHub ส่ง webhook notification
   ↓
4. https://dcpschool100.net/webhook
   ↓
5. Nginx proxy → localhost:9000
   ↓
6. webhook-deploy.js รับ notification
   ↓
7. ตรวจสอบ signature
   ↓
8. รัน deploy commands:
   - git pull
   - npm ci --only=production
   - npm run build
   - pm2 restart thai-music-platform
   ↓
9. ✅ Deploy เสร็จสิ้น
```

## 🔍 การแก้ปัญหา

### Webhook ไม่ทำงาน

```bash
# ตรวจสอบ webhook server
pm2 status webhook-deploy
pm2 logs webhook-deploy

# ทดสอบ endpoint
curl http://localhost:9000/health

# ตรวจสอบ Nginx
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Invalid Signature Error

```bash
# ตรวจสอบ WEBHOOK_SECRET บน server
cat /var/www/thai-music-platform/.env.production | grep WEBHOOK_SECRET

# ตรวจสอบว่าตรงกับที่ตั้งใน GitHub webhook
```

### Deploy ล้มเหลว

```bash
cd /var/www/thai-music-platform

# ตรวจสอบ git status
git status
git log -1

# ลอง deploy manual
./deploy.sh

# ตรวจสอบ permissions
ls -la
```

## 📝 ข้อมูลสำคัญ

| รายการ | ค่า |
|--------|-----|
| Server IP | 164.115.41.34 |
| User | root |
| Project Path | /var/www/thai-music-platform |
| Domain | https://dcpschool100.net/ |
| Webhook Port | 9000 |
| Webhook URL | https://dcpschool100.net/webhook |
| PM2 Apps | webhook-deploy, thai-music-platform |
| Branch | master |
| Repository | https://github.com/9golfy/thai-music-platform |

## 🎯 คำสั่งที่ใช้บ่อย

```bash
# ดู logs แบบ real-time
pm2 logs webhook-deploy
pm2 logs thai-music-platform

# Restart services
pm2 restart webhook-deploy
pm2 restart thai-music-platform

# ดูสถานะ
pm2 status

# Deploy manual
cd /var/www/thai-music-platform
./deploy.sh

# ทดสอบ webhook
./test-webhook.sh

# ดู Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 📚 ไฟล์เอกสาร

- `WEBHOOK-SETUP-GUIDE.md` - คู่มือติดตั้งแบบละเอียด (ภาษาไทย)
- `setup-webhook-server.sh` - สคริปต์ติดตั้งอัตโนมัติ
- `test-webhook.sh` - สคริปต์ทดสอบ webhook
- `webhook-deploy.js` - Webhook server
- `deploy.sh` - สคริปต์ deploy manual
- `.github/workflows/deploy.yml` - GitHub Actions workflow

## ✨ ข้อดีของ Webhook

- ✅ ไม่ต้องเปิด SSH port ให้ external
- ✅ ปลอดภัยกว่า (signature verification)
- ✅ ทำงานผ่าน HTTPS ที่มีอยู่แล้ว
- ✅ ไม่มีปัญหา firewall
- ✅ Deploy เร็วกว่า (ไม่ต้อง setup SSH connection)
- ✅ ง่ายต่อการ debug (ดู logs ได้ทันที)

## 🚀 พร้อมใช้งาน!

หลังจากติดตั้งเสร็จ คุณสามารถ:

1. Push code ไป GitHub
2. Webhook จะ deploy อัตโนมัติ
3. ตรวจสอบผลได้ที่ https://dcpschool100.net/

Happy Deploying! 🎉
