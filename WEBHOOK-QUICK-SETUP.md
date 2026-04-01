# 🚀 Quick Setup: Webhook Auto Deploy

## คำสั่งเดียวจบ (บน Server)

```bash
ssh root@164.115.41.34
cd /var/www/thai-music-platform
git pull origin master
chmod +x setup-webhook-server.sh
./setup-webhook-server.sh
```

## หรือทำเองทีละขั้น

### 1. สร้าง Secret (30 วินาที)

```bash
cd /var/www/thai-music-platform
WEBHOOK_SECRET=$(openssl rand -hex 32)
echo "WEBHOOK_SECRET=$WEBHOOK_SECRET" >> .env.production
echo "Secret: $WEBHOOK_SECRET"  # เก็บไว้
pm2 restart webhook-deploy
```

### 2. ตั้งค่า Nginx (2 นาที)

```bash
sudo nano /etc/nginx/sites-available/dcpschool100.net
```

เพิ่มใน server block (port 443):

```nginx
location /webhook {
    proxy_pass http://localhost:9000/webhook;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Hub-Signature-256 $http_x_hub_signature_256;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 3. ตั้งค่า GitHub (1 นาที)

https://github.com/9golfy/thai-music-platform/settings/hooks

- URL: `https://dcpschool100.net/webhook`
- Content type: `application/json`
- Secret: (ใส่ WEBHOOK_SECRET)
- Events: Just the push event

### 4. ทดสอบ (30 วินาที)

```bash
# แก้ไข README
echo "Test $(date)" >> README.md
git add README.md
git commit -m "Test webhook"
git push origin master

# ดู logs
pm2 logs webhook-deploy
```

## ✅ เสร็จแล้ว!

ตอนนี้ทุกครั้งที่ push code ไป GitHub จะ deploy อัตโนมัติ

## 🔍 ตรวจสอบ

```bash
pm2 status                    # ดูสถานะ
pm2 logs webhook-deploy       # ดู webhook logs
pm2 logs thai-music-platform  # ดู app logs
./test-webhook.sh             # ทดสอบ webhook
```

## 📚 เอกสารเพิ่มเติม

- `WEBHOOK-SETUP-GUIDE.md` - คู่มือละเอียด
- `สรุป-WEBHOOK-DEPLOY.md` - สรุปภาษาไทย
- `setup-webhook-server.sh` - สคริปต์ติดตั้ง
- `test-webhook.sh` - สคริปต์ทดสอบ
