# วิธีทดสอบ Auto Deploy

## 🚀 ขั้นตอนที่ 1: ทดสอบ Auto Deploy

### วิธีที่ 1: ใช้สคริปต์ (แนะนำ)

```bash
# ให้สิทธิ์
chmod +x test-auto-deploy.sh

# รันสคริปต์
./test-auto-deploy.sh
```

สคริปต์จะ:
1. สร้าง/อัพเดท TEST-DEPLOY.md
2. Commit และ push ไป GitHub
3. แสดงคำแนะนำขั้นตอนถัดไป

---

### วิธีที่ 2: ทำเอง

```bash
# 1. สร้างหรือแก้ไขไฟล์
echo "# Test $(date)" >> TEST-DEPLOY.md

# 2. Commit
git add TEST-DEPLOY.md
git commit -m "test: Auto deploy test"

# 3. Push
git push origin main
```

---

## 🔍 ขั้นตอนที่ 2: ตรวจสอบผลลัพธ์

### วิธีที่ 1: ใช้สคริปต์ (แนะนำ)

```bash
# ให้สิทธิ์
chmod +x check-deploy-status.sh

# รอ 2-3 นาที แล้วรันสคริปต์
./check-deploy-status.sh
```

สคริปต์จะตรวจสอบ:
1. ✅ ไฟล์ TEST-DEPLOY.md บน server
2. ✅ PM2 status
3. ✅ Application health
4. ✅ Recent logs
5. ✅ Git commits

---

### วิธีที่ 2: ตรวจสอบเอง

#### 1. ตรวจสอบ GitHub Actions

1. ไปที่ GitHub repository
2. คลิก "Actions" tab
3. ดู workflow ล่าสุด: "Deploy to Production"
4. ตรวจสอบว่า:
   - ✅ Workflow สีเขียว (success)
   - ❌ Workflow สีแดง (failed) → ดู logs

#### 2. ตรวจสอบบน Server

```bash
# ตรวจสอบว่าไฟล์ถูก deploy
ssh ubuntu@164.115.41.34 'cat /home/ubuntu/thai-music-platform/TEST-DEPLOY.md'

# ตรวจสอบ PM2 status
ssh ubuntu@164.115.41.34 'pm2 status'

# ตรวจสอบ logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music --lines 20'
```

#### 3. ตรวจสอบ Application

```bash
# Health check
curl http://164.115.41.34/api/health

# Main page
curl -I http://164.115.41.34
```

---

## ✅ ผลลัพธ์ที่คาดหวัง

### ถ้าสำเร็จ:

1. **GitHub Actions**:
   - Workflow สีเขียว ✅
   - ไม่มี errors ใน logs

2. **Server**:
   - ไฟล์ TEST-DEPLOY.md ปรากฏบน server ✅
   - PM2 แสดง "online" ✅
   - Logs ไม่มี errors ✅

3. **Application**:
   - Health check return 200 OK ✅
   - Application ทำงานปกติ ✅

---

## 🆘 ถ้าไม่สำเร็จ

### ปัญหา 1: GitHub Actions Failed

**อาการ**: Workflow สีแดง

**ตรวจสอบ**:
1. คลิกที่ workflow ที่ failed
2. ดู logs ว่า error ตรงไหน
3. ตรวจสอบ GitHub Secrets:
   - Settings → Secrets and variables → Actions
   - ต้องมี: SSH_HOST, SSH_USER, SSH_PRIVATE_KEY, SSH_PORT

**แก้ไข**:
```bash
# ถ้า SSH connection failed
# ตรวจสอบ SSH key บน server
ssh ubuntu@164.115.41.34 'cat ~/.ssh/authorized_keys'

# ตรวจสอบว่า SSH key ใน GitHub Secrets ถูกต้อง
```

---

### ปัญหา 2: Workflow Success แต่ไฟล์ไม่ปรากฏบน Server

**อาการ**: GitHub Actions สีเขียว แต่ไฟล์ไม่มีบน server

**ตรวจสอบ**:
```bash
# ตรวจสอบ git status บน server
ssh ubuntu@164.115.41.34 'cd /home/ubuntu/thai-music-platform && git status'

# ตรวจสอบ git log
ssh ubuntu@164.115.41.34 'cd /home/ubuntu/thai-music-platform && git log -1'
```

**แก้ไข**:
```bash
# Manual pull
ssh ubuntu@164.115.41.34
cd /home/ubuntu/thai-music-platform
git pull origin main
```

---

### ปัญหา 3: Application ไม่ Start

**อาการ**: PM2 แสดง "errored" หรือ "stopped"

**ตรวจสอบ**:
```bash
# ดู error logs
ssh ubuntu@164.115.41.34 'pm2 logs thai-music --lines 50'

# ตรวจสอบ .env.production
ssh ubuntu@164.115.41.34 'ls -la /home/ubuntu/thai-music-platform/.env.production'
```

**แก้ไข**:
```bash
# Restart PM2
ssh ubuntu@164.115.41.34 'pm2 restart thai-music'

# หรือ start ใหม่
ssh ubuntu@164.115.41.34 'cd /home/ubuntu/thai-music-platform && pm2 start npm --name thai-music -- start'
```

---

## 📊 Timeline

```
0:00 - Push code to GitHub
0:10 - GitHub Actions triggers
0:30 - Actions SSH to server
1:00 - Server pulls code
1:30 - Server builds application
2:00 - Server restarts PM2
2:30 - Deploy complete! ✅
```

**รวม**: ประมาณ 2-3 นาที

---

## 🎯 Quick Commands

```bash
# ทดสอบ deploy
./test-auto-deploy.sh

# รอ 2-3 นาที...

# ตรวจสอบผลลัพธ์
./check-deploy-status.sh

# ดู GitHub Actions
# ไปที่ GitHub → Actions

# ดู logs บน server
ssh ubuntu@164.115.41.34 'pm2 logs thai-music'

# ทดสอบ application
curl http://164.115.41.34/api/health
```

---

## 📝 Checklist

### ก่อนทดสอบ
- [ ] GitHub Secrets ตั้งค่าครบ (SSH_HOST, SSH_USER, SSH_PRIVATE_KEY)
- [ ] Server มี SSH key ที่ถูกต้อง
- [ ] Repository clone บน server แล้ว
- [ ] Application ทำงานปกติ

### หลังทดสอบ
- [ ] GitHub Actions workflow สีเขียว
- [ ] ไฟล์ TEST-DEPLOY.md ปรากฏบน server
- [ ] PM2 status เป็น "online"
- [ ] Health check return 200 OK
- [ ] Application ทำงานปกติ

---

## 🎉 สำเร็จแล้ว!

ถ้าทุกอย่างผ่าน แสดงว่า:
- ✅ Auto deploy ทำงานได้แล้ว
- ✅ ทุกครั้งที่ push code จะ deploy อัตโนมัติ
- ✅ ไม่ต้อง deploy manual อีกต่อไป

**ขั้นตอนถัดไป**:
1. ลบไฟล์ TEST-DEPLOY.md (optional)
2. Push code จริงเพื่อ deploy features ใหม่
3. Monitor logs เป็นประจำ

---

## 📚 เอกสารเพิ่มเติม

- **GITHUB-DEPLOY-SETUP.md** - คู่มือฉบับเต็ม
- **QUICK-START-GITHUB-DEPLOY.md** - เริ่มต้นด่วน
- **README-DEPLOY.md** - ภาพรวม deploy

---

**Good luck! 🚀**
