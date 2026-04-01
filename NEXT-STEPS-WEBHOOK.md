# 🎯 Next Steps: Webhook Auto Deploy Setup

## สถานการณ์ปัจจุบัน

✅ **ไฟล์ทั้งหมดพร้อมแล้ว** - รอ commit และ push ไป GitHub

### ไฟล์ที่แก้ไข/สร้างใหม่:

1. ✅ `webhook-deploy.js` - แก้ path และ PM2 app name
2. ✅ `deploy.sh` - แก้ path และ PM2 app name  
3. ✅ `.github/workflows/deploy.yml` - เปลี่ยนเป็น webhook notification
4. ✅ `WEBHOOK-SETUP-GUIDE.md` - คู่มือติดตั้งแบบละเอียด
5. ✅ `สรุป-WEBHOOK-DEPLOY.md` - สรุปภาษาไทย
6. ✅ `WEBHOOK-QUICK-SETUP.md` - คู่มือแบบย่อ
7. ✅ `setup-webhook-server.sh` - สคริปต์ติดตั้งอัตโนมัติ
8. ✅ `test-webhook.sh` - สคริปต์ทดสอบ

## 📋 ขั้นตอนถัดไป

### Step 1: Commit และ Push ไฟล์ (บนเครื่องของคุณ)

```bash
# ตรวจสอบไฟล์ที่จะ commit
git status

# Commit
git commit -m "Setup webhook auto deploy for 164.115.41.34

- Fix webhook-deploy.js paths and PM2 app name
- Update deploy.sh with correct paths
- Change GitHub Actions to webhook notification
- Add comprehensive setup guides and scripts
- Ready for webhook deployment setup"

# Push ไป GitHub
git push origin master
```

### Step 2: ติดตั้งบน Server (164.115.41.34)

เลือกวิธีใดวิธีหนึ่ง:

#### วิธีที่ 1: ใช้สคริปต์อัตโนมัติ (แนะนำ) ⭐

```bash
# SSH เข้า server
ssh root@164.115.41.34

# Pull ไฟล์ใหม่
cd /var/www/thai-music-platform
git pull origin master

# รันสคริปต์ติดตั้ง
chmod +x setup-webhook-server.sh
./setup-webhook-server.sh
```

สคริปต์จะทำให้:
- ✅ สร้าง WEBHOOK_SECRET อัตโนมัติ
- ✅ Restart webhook server
- ✅ แนะนำวิธีตั้งค่า Nginx
- ✅ ทดสอบ endpoint

#### วิธีที่ 2: ทำเองทีละขั้น

ดูรายละเอียดใน `WEBHOOK-QUICK-SETUP.md`

### Step 3: ตั้งค่า GitHub Webhook

1. ไปที่: https://github.com/9golfy/thai-music-platform/settings/hooks
2. คลิก "Add webhook"
3. กรอก:
   - Payload URL: `https://dcpschool100.net/webhook`
   - Content type: `application/json`
   - Secret: (ใส่ WEBHOOK_SECRET จาก server)
   - Events: Just the push event
4. Save

### Step 4: ทดสอบ

```bash
# แก้ไข README
echo "Test webhook deploy - $(date)" >> README.md
git add README.md
git commit -m "Test: Webhook auto deploy"
git push origin master
```

ตรวจสอบ:
- GitHub webhook deliveries: https://github.com/9golfy/thai-music-platform/settings/hooks
- Server logs: `ssh root@164.115.41.34 "pm2 logs webhook-deploy"`

## 🎓 เอกสารที่ควรอ่าน

### สำหรับการติดตั้ง:
1. **`WEBHOOK-QUICK-SETUP.md`** ⭐ - เริ่มที่นี่! คำสั่งสั้นๆ ทำตามได้เลย
2. **`WEBHOOK-SETUP-GUIDE.md`** - คู่มือละเอียด มีวิธีแก้ปัญหา
3. **`สรุป-WEBHOOK-DEPLOY.md`** - สรุปภาษาไทย อธิบายทุกอย่าง

### สำหรับการใช้งาน:
- `setup-webhook-server.sh` - รันบน server เพื่อติดตั้ง
- `test-webhook.sh` - รันบน server เพื่อทดสอบ
- `deploy.sh` - Deploy manual (ถ้า webhook มีปัญหา)

## 🔍 การตรวจสอบ

### บน Server (164.115.41.34):

```bash
# ตรวจสอบ webhook server
pm2 status webhook-deploy
pm2 logs webhook-deploy --lines 20

# ตรวจสอบ application
pm2 status thai-music-platform
pm2 logs thai-music-platform --lines 20

# ทดสอบ webhook
./test-webhook.sh

# ทดสอบ endpoint
curl http://localhost:9000/health
curl -X POST https://dcpschool100.net/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/test"}'
```

### บน GitHub:

- Webhook settings: https://github.com/9golfy/thai-music-platform/settings/hooks
- Recent deliveries: คลิกที่ webhook → ดู "Recent Deliveries"
- Actions: https://github.com/9golfy/thai-music-platform/actions

## ❓ FAQ

### Q: ทำไมต้องใช้ webhook แทน SSH?
A: GitHub Actions ไม่สามารถ SSH เข้า server ได้เพราะ firewall บล็อก

### Q: Webhook ปลอดภัยไหม?
A: ปลอดภัย! ใช้ signature verification ด้วย WEBHOOK_SECRET

### Q: ถ้า webhook ไม่ทำงานจะทำยังไง?
A: Deploy manual ด้วย `./deploy.sh` หรือดู troubleshooting ใน `WEBHOOK-SETUP-GUIDE.md`

### Q: จะรู้ได้ยังไงว่า deploy สำเร็จ?
A: ดู logs: `pm2 logs webhook-deploy` และ `pm2 logs thai-music-platform`

### Q: ต้องตั้งค่าใหม่ทุกครั้งที่ restart server ไหม?
A: ไม่ต้อง! PM2 จะ auto-start webhook server เมื่อ reboot

## 🎯 สรุป

1. **ตอนนี้**: Commit และ push ไฟล์ไป GitHub
2. **บน Server**: รัน `setup-webhook-server.sh`
3. **บน GitHub**: ตั้งค่า webhook
4. **ทดสอบ**: Push code ดูว่า deploy อัตโนมัติหรือไม่

## 📞 ต้องการความช่วยเหลือ?

อ่านเอกสารตามลำดับ:
1. `WEBHOOK-QUICK-SETUP.md` - เริ่มที่นี่
2. `WEBHOOK-SETUP-GUIDE.md` - ถ้าติดปัญหา
3. `สรุป-WEBHOOK-DEPLOY.md` - อยากเข้าใจระบบ

---

**พร้อมแล้ว! ขั้นตอนถัดไปคือ commit และ push ไฟล์เหล่านี้ไป GitHub** 🚀
