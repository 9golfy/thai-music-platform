# GitHub Actions Auto-Deploy Setup

## ไฟล์ที่สร้างแล้ว

✅ `.github/workflows/deploy.yml` - GitHub Actions workflow สำหรับ auto-deploy

## ขั้นตอนการตั้งค่า

### 1. ตั้งค่า GitHub Secrets

ไปที่ GitHub Repository:
1. คลิก **Settings** (ด้านบนขวา)
2. คลิก **Secrets and variables** > **Actions** (เมนูซ้าย)
3. คลิก **New repository secret**

เพิ่ม Secrets ทั้งหมด 3 ตัว:

#### Secret 1: EC2_HOST
- Name: `EC2_HOST`
- Value: `13.212.254.184`

#### Secret 2: EC2_USERNAME
- Name: `EC2_USERNAME`
- Value: `ubuntu` (หรือ username ที่คุณใช้ SSH)

#### Secret 3: EC2_SSH_KEY
- Name: `EC2_SSH_KEY`
- Value: เนื้อหาทั้งหมดของไฟล์ `.pem` key ที่ใช้ SSH เข้า EC2

**วิธีดู SSH Key:**
```bash
# Windows
type path\to\your-key.pem

# หรือเปิดไฟล์ .pem ด้วย Notepad
# Copy ทั้งหมดตั้งแต่ -----BEGIN RSA PRIVATE KEY----- ถึง -----END RSA PRIVATE KEY-----
```

### 2. ตั้งค่า EC2 (ครั้งเดียว)

SSH เข้า EC2 แล้วรัน:

```bash
# Clone repository (ถ้ายังไม่ได้ clone)
cd ~
git clone https://github.com/9golfy/thai-music-platform.git
cd thai-music-platform

# ตั้งค่า Git credentials (เพื่อให้ pull ได้โดยไม่ต้องใส่ password)
git config --global credential.helper store
git pull  # ใส่ username/password ครั้งแรก จะจำไว้

# หรือใช้ SSH key
git remote set-url origin git@github.com:9golfy/thai-music-platform.git
```

### 3. ทดสอบ Auto-Deploy

```bash
# บนเครื่อง local
git add .
git commit -m "Test: Auto-deploy"
git push
```

GitHub Actions จะ:
1. Detect push to master branch
2. SSH เข้า EC2
3. Pull latest code
4. Rebuild Docker containers
5. Restart services

### 4. ดู Deployment Status

1. ไปที่ GitHub Repository
2. คลิก **Actions** (ด้านบน)
3. ดู workflow runs และ logs

### 5. Manual Deploy (ถ้าต้องการ)

1. ไปที่ **Actions** tab
2. เลือก **Deploy to AWS EC2** workflow
3. คลิก **Run workflow** > **Run workflow**

---

## Workflow Details

### Trigger Events
- **Push to master** - Auto-deploy เมื่อ push code
- **Manual dispatch** - Deploy ด้วยตัวเองผ่าน GitHub UI

### Deployment Steps
1. Checkout code from GitHub
2. SSH to EC2 server
3. Pull latest code
4. Stop Docker containers
5. Rebuild and restart containers
6. Show last 50 lines of logs

---

## Troubleshooting

### Error: Permission denied (publickey)
- ตรวจสอบว่า `EC2_SSH_KEY` ถูกต้อง
- ตรวจสอบว่า key ไม่มี password protection

### Error: Repository not found
- ตรวจสอบว่า EC2 มี Git credentials ตั้งค่าแล้ว
- หรือใช้ SSH key แทน HTTPS

### Error: Docker command not found
- SSH เข้า EC2 แล้วติดตั้ง Docker
- ดูคำแนะนำใน `AWS-DEPLOYMENT-GUIDE.md`

### Error: Permission denied (docker)
```bash
# SSH to EC2
sudo usermod -aG docker $USER
# Logout และ login ใหม่
```

---

## ข้อดีของ Auto-Deploy

✅ Push code แล้ว deploy อัตโนมัติ
✅ ไม่ต้อง SSH เข้า EC2 ทุกครั้ง
✅ ดู deployment logs ได้ใน GitHub
✅ Rollback ได้ง่าย (revert commit แล้ว push)
✅ Deploy ด้วยตัวเองได้ผ่าน GitHub UI

---

## Security Notes

⚠️ **อย่า commit SSH key เข้า repository**
⚠️ **ใช้ GitHub Secrets เท่านั้น**
⚠️ **ตั้งค่า Security Group ใน AWS ให้เปิดแค่ port ที่จำเป็น**

---

## Next Steps

หลังจากตั้งค่าเสร็จ:
1. ✅ Push code ใหม่จะ deploy อัตโนมัติ
2. ✅ ไม่ต้อง SSH เข้า EC2 อีก
3. ✅ ดู deployment status ใน GitHub Actions
